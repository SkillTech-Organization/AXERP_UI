import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ManagerButtonComponent } from '../buttons/manager-button/manager-button.component';

@Component({
  selector: 'app-file-upload-input',
  standalone: true,
  imports: [
    ManagerButtonComponent
  ],
  templateUrl: './file-upload-input.component.html',
  styleUrl: './file-upload-input.component.scss'
})
export class FileUploadInputComponent {
  @Input() placeholderText: string = "No selected file(s)" // "Please select a file to upload"
  @Input() showFileName: boolean = false
  @Input() disabled: boolean = false

  get selectedText(): string | undefined {
    if (this.file) {
      if (this.showFileName) {
        return this.file?.name
      } else {
        return "File(s) selected"
      }
    }
    return undefined
  }

  @Output() fileSelected: EventEmitter<FileList> = new EventEmitter<FileList>()
  file: File | null = null
  files: FileList | null = null

  onChange(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (!input || !input.files) {
      this.file = null;
      this.files = null;
      return;
    }

    const files: FileList = input.files;
    const file: File | null = files && files.length > 0 ? files[0] : null;

    if (file) {
      this.file = file;
      this.files = files;
      this.fileSelected.emit(this.files)
    }
  }
}
