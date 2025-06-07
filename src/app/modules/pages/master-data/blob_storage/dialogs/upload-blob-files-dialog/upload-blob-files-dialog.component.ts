import { Component, inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { ToastService } from "../../../../../services/toast.service";
import { BlobStorageService } from "../../services/blob-storage.service";
import { ManagerButtonComponent } from "../../../../../shared/buttons/manager-button/manager-button.component";
import { FileUploadInputComponent } from "../../../../../shared/file-upload-input/file-upload-input.component";
import { UploadBlobFileRequest } from "../../models/UploadBlobFileRequest";
import { BlobUploadFile } from "../../models/BlobUploadFile";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { AxerpProgressBarComponent } from "../../../../../shared/axerp-progress-bar/axerp-progress-bar.component";


@Component({
  selector: 'app-upload-blob-files-dialog',
  standalone: true,
  imports: [
    ManagerButtonComponent, FileUploadInputComponent, ReactiveFormsModule, AxerpProgressBarComponent
],
  templateUrl: './upload-blob-files-dialog.component.html',
  styleUrl: './upload-blob-files-dialog.component.scss'
})
export class UploadBlobFilesDialogComponent {
  readonly dialogRef = inject(MatDialogRef<UploadBlobFilesDialogComponent>);

  readonly dialog = inject(MatDialog);

  files: File[] = []
  
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

  canClose: boolean = true
  canUpload: boolean = true

  fileCountError: boolean = false

  form: FormGroup = new FormGroup({
    folderName: new FormControl('import')
  })

  data = inject(MAT_DIALOG_DATA)

  constructor(private service: BlobStorageService,
    private snackService: ToastService) {
  }

  onFileSelected(files: FileList) {
    this.fileCountError = false
    if (files.length === 0)
      return

    if (files.length > 10) {
      this.fileCountError = true
      return
    }

      for (let i = 0; i < files.length; i++) {
        this.fileStatus[files[i].name] = { value: 0 }
      this.files.push(files[i])
    }
  }

  onUpload() {
    this.canUpload = false
    this.canClose = false
    try {
      for (const file of this.files) {
        var uploadFile = new BlobUploadFile(file.name, this.form.controls["folderName"].value, file)

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

                this.canClose = true
              }
            },
            error: (err: any) => {
              this.fileStatus[file.name].value = 0
              this.fileStatus[file.name].error = err
              this.fileStatus[file.name].done = true

              this.canClose = true
            }
          })
      }
    } catch(error) {
      this.snackService.openError(error)
      this.canUpload = false
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
