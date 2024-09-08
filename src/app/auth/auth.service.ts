import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = `${environment.apiUrl}/user`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private token!: string | null;
  private userId!: string | null;
  private authStatusListener = new BehaviorSubject<boolean>(false);

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.authStatusListener.next(true);
    }
  }

  createUser(email: string, password: string) {
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        `${BACKEND_URL}/signup`,
        {
          email,
          password,
        },
      )
      .subscribe({
        next: (response) => {
          this.loginUser(response);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  login(email: string, password: string) {
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        `${BACKEND_URL}/login`,
        {
          email,
          password,
        },
      )
      .subscribe((response) => {
        this.loginUser(response);
      });
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/'], { onSameUrlNavigation: 'ignore' });
  }

  private loginUser(data: {
    token: string;
    expiresIn: number;
    userId: string;
  }) {
    this.token = data.token;
    this.userId = data.userId;
    this.authStatusListener.next(true);
    this.saveAuthData(
      this.token,
      new Date(Date.now() + data.expiresIn * 1000),
      data.userId,
    );
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
    };
  }
}
