import { Component, OnInit, inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { ToastService } from "../../../../../services/toast.service";
import { LoadingSpinnerDialogContentComponent } from "../../../../../shared/loading-spinner-dialog-content/loading-spinner-dialog-content";
import { BlobStorageService } from "../../services/blob-storage.service";
import { ManagerButtonComponent } from "../../../../../shared/buttons/manager-button/manager-button.component";
import { FileUploadInputComponent } from "../../../../../shared/file-upload-input/file-upload-input.component";
import { UploadBlobFileRequest } from "../../models/UploadBlobFileRequest";
import { BlobUploadFile } from "../../models/BlobUploadFile";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatProgressBar } from '@angular/material/progress-bar';
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { AxerpProgressBarComponent } from "../../../../../shared/axerp-progress-bar/axerp-progress-bar.component";


@Component({
  selector: 'app-upload-blob-files-dialog',
  standalone: true,
  imports: [
    LoadingSpinnerDialogContentComponent, ManagerButtonComponent, FileUploadInputComponent,
    MatFormField, MatInput, MatLabel, ReactiveFormsModule, MatProgressBar,
    AxerpProgressBarComponent
],
  templateUrl: './upload-blob-files-dialog.component.html',
  styleUrl: './upload-blob-files-dialog.component.scss'
})
export class UploadBlobFilesDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<UploadBlobFilesDialogComponent>);

  readonly dialog = inject(MatDialog);

  files: File[] | null = null
  
  fileStatus: { [id: string]: { value: number, error?: string, done?: boolean }} = {}
  get uploadFinished(): boolean {
    var res = true
    Object.keys(this.fileStatus).forEach((key: string) => {
      if (!this.fileStatus[key].done) {
        res = false
      }
    })
    return res
  }
  get hasErrors(): boolean {
    var res = false
    Object.keys(this.fileStatus).forEach((key: string) => {
      if (this.fileStatus[key].error) {
        res = true
      }
    })
    return res
  }

  loading: boolean = false
  uploading: boolean = false

  form: FormGroup = new FormGroup({
    folderName: new FormControl('import')
  })

  get DisableDialogButtons(): boolean {
    return this.loading || this.uploading
  }

  data = inject(MAT_DIALOG_DATA)

  constructor(private service: BlobStorageService,
    private snackService: ToastService) {
  }

  async ngOnInit(): Promise<void> {}

  onFileSelected(event: any) {
    const files: File[] = event;

    if (files?.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.fileStatus[files[i].name] = { value: 0 }
      }
      this.files = files;
    }
  }

  async onUpload() {
    this.uploading = true
    try {
      for (let i = 0; i < this.files!.length; i++) {
        const file = this.files![i]
        var uploadFile = new BlobUploadFile(file!.name, this.form.controls["folderName"].value, file!)

        this.service.UploadBlobFile(new UploadBlobFileRequest(uploadFile))
          .subscribe({
            next: (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.fileStatus[file.name].value = Math.round(100 * event.loaded / (event.total ?? event.loaded))
                if (this.fileStatus[file.name].value >= 100) {
                  this.fileStatus[file.name].done = true
                }
              } else if (event instanceof HttpResponse) {
                if (event.body?.Value?.RequestError) {
                  this.fileStatus[file.name].value = 0
                  this.fileStatus[file.name].error = event.body?.Value?.RequestError
                  this.fileStatus[file.name].done = true
                } else {
                  this.fileStatus[file.name].done = true
                }
              }
            },
            error: (err: any) => {
              this.fileStatus[file.name].value = 0
              this.fileStatus[file.name].error = err
              this.fileStatus[file.name].done = true
            }
          })
      }
    } catch(error) {
      this.snackService.openError(error)
    }
    this.uploading = false
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
