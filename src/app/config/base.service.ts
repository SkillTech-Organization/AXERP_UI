import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { ToastService } from '../modules/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(protected snackService: ToastService) { }

  protected handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      this.snackService.openError('An error occurred: ' + error.error)
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
      this.snackService.openError(`Backend returned code ${error.status}, body was: ` + error.error)
    }
    // Return an observable with a user-facing error message.
    this.snackService.openError('Unkown error.')
    return throwError(() => new Error('Unkown error.'));
  }
}
