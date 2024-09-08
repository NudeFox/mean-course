import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../core/snackbar/snackbar.component';

export type TDuration = number | 'infinite';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  duration = 7000;

  constructor(public snackBar: MatSnackBar) {}

  // Please don't forget to dismiss MatSnackBar from the component
  // where it's used if duration is set to infinite
  success(message: string, duration?: TDuration) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message,
        icon: 'check',
        status: 'success',
      },
      panelClass: ['my-snackbar', 'success'],
      duration: this.checkTimings(duration),
    });
  }

  warning(message: string, duration?: TDuration) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message,
        icon: 'warning',
        status: 'warning',
      },
      panelClass: ['my-snackbar', 'warning'],
      duration: this.checkTimings(duration),
    });
  }

  error(message: string, duration?: TDuration) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message,
        icon: 'error',
        status: 'error',
      },
      panelClass: ['my-snackbar', 'error'],
      duration: this.checkTimings(duration),
    });
  }

  private checkTimings(duration?: TDuration): number | undefined {
    let notifyTime;
    if (!duration) {
      notifyTime = this.duration;
    } else {
      notifyTime = duration === 'infinite' ? undefined : duration;
    }
    return notifyTime;
  }
}
