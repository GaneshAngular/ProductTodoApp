import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';
import { AUTH } from '../../core/constants/interface';


@Component({
  selector: 'app-signup',
  imports: [RouterLink,ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {



  constructor(private authService:AuthService){

  }

  signupForm=new FormGroup({
     name:new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z\s]{2,}$/)]),
     email:new FormControl('',[Validators.required,Validators.email]),
     password:new FormControl('',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)])
  })


  checkInvalidFields(field:'email'|'name'|'password'):boolean{
    const control=this.signupForm.controls[field]
      if(control?.errors &&  control.touched  ){
           return true
      }
      return false
  }

  onSignup(){
        if(this.signupForm.invalid)return alert('Invalid details')

          const user:AUTH={
             name:this.signupForm.value.name ||'',
             email:this.signupForm.value.email ||'',
             password:this.signupForm.value.password ||'',
             role:'admin'
          }
  this.authService.signup(user).subscribe((res:any)=>{
         alert(res.message)
  })

  }
}
