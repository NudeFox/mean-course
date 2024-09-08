import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatAnchor, MatButton } from '@angular/material/button';
import { AuthService } from '../auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbar, RouterLinkActive, MatAnchor, RouterLink, MatButton],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  isAuthenticated: boolean = false;

  ngOnInit() {
    this.authService
      .getAuthStatusListener()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  logout() {
    this.authService.logout();
  }
}
