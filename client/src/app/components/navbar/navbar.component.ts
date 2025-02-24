import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { LocalstorageService } from '../../core/services/localstorage/localstorage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  localService = inject(LocalstorageService);

  isUser = false;
  darkTheme!: boolean;
  ngOnInit(): void {
    this.authService.getUserActive().subscribe((user) => (this.isUser = user));
    this.authService.getUserActive().subscribe((res: any) => {
      this.isUser = res;
    });
    if (!localStorage.getItem('darkTheme')) {

      this.darkTheme = window.matchMedia('(prefers-color-scheme:dark)').matches
        ? true
        : false;
       
    } else {
      console.log("Using stored theme")
      this.darkTheme =
        localStorage.getItem('darkTheme') == 'dark' ? true : false;
    }
    this.toggleTheme();
  }
  logOut() {
    if (confirm('Are you sure to logout?'))
      this.authService.logout().subscribe((res: any) => {
        alert(res.message);
        this.localService.removeToken();
        window.location.href = '/login';
      });
  }
  changeTheme() {
    this.toggleTheme();
    this.darkTheme = !this.darkTheme;
  }
  toggleTheme() {
    if (this.darkTheme) {
      document
        .querySelector('html')
        ?.classList.add('!bg-black', '!text-white');
      localStorage.setItem('darkTheme', 'dark');
    } else {
      document
        .querySelector('html')
        ?.classList.remove('!bg-black', '!text-white');
      localStorage.setItem('darkTheme', 'white');
    }
  }
}
