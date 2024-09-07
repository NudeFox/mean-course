import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private token!: string;

  getToken() {
    return this.token;
  }

  createUser(email: string, password: string) {
    this.http
      .post('http://localhost:3000/api/user/signup', {
        email,
        password,
      })
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    this.http
      .post<{ token: string }>('http://localhost:3000/api/user/login', {
        email,
        password,
      })
      .subscribe((response) => {
        this.token = response.token;
      });
  }
}
