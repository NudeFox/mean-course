import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [MatIcon, NgClass],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent {
  data = inject(MAT_SNACK_BAR_DATA);
}
