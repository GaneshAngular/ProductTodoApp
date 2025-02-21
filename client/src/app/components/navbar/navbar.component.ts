import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { LocalstorageService } from '../../core/services/localstorage/localstorage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  authService=inject(AuthService)
  localService=inject(LocalstorageService)
  isUser=this.localService.getToken()

  ngOnInit(): void {
    this.authService.getUserActive().subscribe((res:any)=>{
      this.isUser=res
      console.log(this.isUser)
    })
  }
  logOut(){
     confirm("Are you sure to logout?")
      this.authService.logout().subscribe((res:any)=>{
          alert(res.message);
       this.localService.removeToken()
       window.location.href="/login"
      })
  }
}
