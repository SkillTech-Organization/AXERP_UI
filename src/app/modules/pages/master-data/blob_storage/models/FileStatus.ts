import { HttpEventType, HttpProgressEvent } from "@angular/common/http"

export class FileStatus {
  private _completed: boolean = false

  private _value: number = 0
  public get value(): number {
    return this._value
  }

  private _error: string = ''
  public get error(): string {
    return this._error
  }

  public get done(): boolean {
    return this._completed && (this._value >= 100 || this._error !== '')
  }

  public updateValue(event: HttpProgressEvent): void {
    if (event.type !== HttpEventType.UploadProgress) {
      throw new Error("Event type is not UploadProgress");
    }

    this._value = Math.round(100 * event.loaded / (event.total ?? event.loaded));
  }

  public setError(error: string): void {
    this._error = error;
    this._value = 0;
  }
  
  public complete(): void {
    this._completed = true;
  }
}
