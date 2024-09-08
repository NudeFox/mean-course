import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SnackBarService } from '../services/snackbar.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbarService = inject(SnackBarService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';
      let statusCode = error.status;
      console.log('error', error);

      // Determine the error type
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client-side error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = error.error.message || 'Server-side error occurred!';
      }

      // Call Snackbar service to show the error
      snackbarService.error(`Code ${statusCode}: ${errorMessage}`);

      // Rethrow the error
      return throwError(() => new Error(errorMessage));
    }),
  );
};
