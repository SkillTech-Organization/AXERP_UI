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
  @Input() placeholderText: string = "No selected file" // "Please select a file to upload"
  @Input() showFileName: boolean = false
  @Input() disabled: boolean = false
  // @Input() showUploadButtonAfterSelect: boolean = false
  // @Input() showInfo: boolean = false

  get selectedText(): string | undefined {
    if (this.file) {
      if (this.showFileName) {
        return this.file?.name
      } else {
        return "File selected"
      }
    }
    return undefined
  }

  @Output() fileSelected: EventEmitter<File> = new EventEmitter<File>()
  file: File | null = null

  onChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.file = file;
      this.fileSelected.emit(this.file)
    }
  }
}
