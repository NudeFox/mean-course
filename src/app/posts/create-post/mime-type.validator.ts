import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeTypeValidator = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (!control.value || !(control.value instanceof File)) {
    return of(null); // If there's no file, or it's not of type `File`, no error.
  }

  const file = control.value as File;
  const fileReader = new FileReader();

  return new Observable((observer: Observer<ValidationErrors | null>) => {
    fileReader.addEventListener('loadend', () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(
        0,
        4,
      );
      let header = '';
      let isValid = false;

      for (const byte of arr) {
        header += byte.toString(16);
      }

      switch (header) {
        case '89504e47':
          isValid = true;
          break;
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          isValid = true;
          break;
        default:
          isValid = false;
          break;
      }

      if (isValid) {
        observer.next(null);
      } else {
        observer.next({ invalidMimeType: true });
      }

      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });
};
