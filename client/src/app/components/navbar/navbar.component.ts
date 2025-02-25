import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { LocalstorageService } from '../../core/services/localstorage/localstorage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme/theme.service';
import { UserService } from '../../core/services/user/user.service';
import { EmployeeService } from '../../core/services/employee/employee.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  localService = inject(LocalstorageService);
 employeeService=inject(EmployeeService)
 userService=inject(UserService)
  isUser = false;
  toggleMenu=false
  darkTheme!: boolean;
  ngOnInit(): void {
    this.authService.getUserActive().subscribe((user) => (this.isUser = user));
   this.loadTheme()
   if(this.isUser)
   this.loadUser()
  }



  toggleMenus(){
    this.toggleMenu =!this.toggleMenu;
  }

  loadTheme(){
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
    this.darkTheme = !this.darkTheme;
    this.toggleTheme();
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

  loadUser(){
   this.employeeService.getProfile().subscribe((res:any)=>{

        this.userService.setUser(res.data)
   })
  }

}
