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
import { FileStatus } from "../../models/FileStatus";

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
  
  fileStatuses: Map<string, FileStatus> = new Map<string, FileStatus>();
  get uploadFinished(): boolean {
    return [...this.fileStatuses.values()].every(status => status.done);
  }

  get hasErrors(): boolean {
    return [...this.fileStatuses.values()].some(status => status.error !== '');
  }

  get finalMessage(): string {
    if (this.files.length === 0)
      return ''

    return this.hasErrors
      ? "Some files failed to upload. Please check the errors above."
      : "All files have been uploaded successfully."
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
      this.fileStatuses.set(files[i].name, new FileStatus())
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
            next: (event) => {
              if (event.type === HttpEventType.UploadProgress) {
                const status = this.fileStatuses.get(file.name)
                status?.updateValue(event)
              } else if (event instanceof HttpResponse) {
                const status = this.fileStatuses.get(file.name)
                if (event.body?.Value?.RequestError) {
                  status?.setError(event.body.Value.RequestError)
                } else {
                  status?.complete();
                }

                this.canClose = true
              }
            },
            error: (err) => {
              const status = this.fileStatuses.get(file.name)
              status?.setError(err)

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
