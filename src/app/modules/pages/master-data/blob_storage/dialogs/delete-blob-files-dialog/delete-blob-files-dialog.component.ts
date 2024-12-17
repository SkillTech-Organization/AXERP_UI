import { Component, OnInit, inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastService } from "../../../../../services/toast.service";
import { LoadingSpinnerDialogContentComponent } from "../../../../../shared/loading-spinner-dialog-content/loading-spinner-dialog-content";
import { BlobStorageService } from "../../services/blob-storage.service";


//TODO: make generic delete dialog
@Component({
  selector: 'app-delete-blob-files-dialog',
  standalone: true,
  imports: [
    LoadingSpinnerDialogContentComponent
  ],
  templateUrl: './delete-blob-files-dialog.component.html',
  styleUrl: './delete-blob-files-dialog.component.scss'
})
export class DeleteBlobFilesDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DeleteBlobFilesDialogComponent>);

  loading: boolean = true

  data = inject(MAT_DIALOG_DATA)

  constructor(private service: BlobStorageService,
    private snackService: ToastService) {

  }

  async ngOnInit(): Promise<void> {
    const response = await this.service.DeleteBlobFiles(this.data)
    if (response?.Value) {
      const importResponse = response?.Value

      if (!importResponse.IsSuccess) {
        this.snackService.openError(importResponse.RequestError ?? "Delete failed! Internal Server Error")
      } else {
        this.snackService.openInfo('Delete was successful!')
      }
    }
    this.loading = false
    this.dialogRef.close(true);
  }
}
