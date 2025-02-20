import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { AUTH } from '../../core/constants/interface';

import { LocalstorageService } from '../../core/services/localstorage/localstorage.service';
import { CookiestorageService } from '../../core/services/cookie/cookiestorage.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private localService: LocalstorageService
  ) {}
  // cookieServie = inject(CookiestorageService);
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    ]),
  });

  checkInvalidFields(field: 'email' | 'password'): boolean {
    const control = this.loginForm.controls[field];
    if (control?.errors && control.touched) {
      return true;
    }
    return false;
  }

  onLogin() {
    if (this.loginForm.invalid) return alert('Invalid details');
    const login: AUTH = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.password || '',
    };
    this.authService.signin(login).subscribe((res: any) => {
      console.log(res.token);
      alert(res.message);
      this.localService.setToken(res.token);
      this.loginForm.reset();
      // this.cookieServie.getToken();
    });
  }
}
