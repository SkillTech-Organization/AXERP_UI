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
import { LoadingSpinnerDialogComponent } from "../../../../../shared/dialogs/loading-spinner-dialog/loading-spinner-dialog.component";


@Component({
  selector: 'app-upload-blob-files-dialog',
  standalone: true,
  imports: [
    LoadingSpinnerDialogContentComponent, ManagerButtonComponent, FileUploadInputComponent,
    MatFormField, MatInput, MatLabel, ReactiveFormsModule
  ],
  templateUrl: './upload-blob-files-dialog.component.html',
  styleUrl: './upload-blob-files-dialog.component.scss'
})
export class UploadBlobFilesDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<UploadBlobFilesDialogComponent>);

  readonly dialog = inject(MatDialog);

  file: File | null = null;

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
    const file: File = event;

    if (file) {
      this.file = file;
    }
  }

  async onUpload() {
    this.uploading = true
    try {
      var spinnerRef = this.dialog.open(LoadingSpinnerDialogComponent, { data: "Uploading file..." })
      const response = await this.service.UploadBlobFile(new UploadBlobFileRequest(
        new BlobUploadFile(this.file!.name, this.form.controls["folderName"].value, this.file!)
      ))
      spinnerRef.close()
      if (response?.Value) {
        const importResponse = response?.Value

        if (!importResponse.IsSuccess) {
          this.snackService.openError(importResponse.RequestError ?? "Upload failed! Internal Server Error")
        } else {
          this.snackService.openInfo('Upload was successful!')
          this.dialogRef.close(true);
        }
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
