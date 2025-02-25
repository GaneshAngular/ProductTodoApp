import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user/user.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../core/services/employee/employee.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user:any

userService=inject(UserService)
toggleUpdateform=false
employeeService=inject(EmployeeService)
updateProfileForm=new FormGroup({
  name: new FormControl('',[Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,20}$/)]),
  email: new FormControl('',[Validators.required,Validators.email]),
})
ngOnInit(){
   this.loadUser()
}

  loadUser(){
   this.userService.getUser().subscribe((res:any)=>{
    console.log(res)
        this.user = res
   })
  }
  toggleUpdate(){
    this.toggleUpdateform =!this.toggleUpdateform;
    if(this.toggleUpdateform) this.updateProfileForm.patchValue(this.user)

    if(!this.toggleUpdateform) this.updateProfileForm.reset()

  }

  checkInvalidFields(field:'name'|'email'){
    const addForm=this.updateProfileForm.controls[field]
         if(addForm.invalid && addForm.touched){
          return true
  }
  return false
}

updateDetails(){
    if(this.updateProfileForm.invalid)return alert("plese fill details")

      this.employeeService.updateProfile(this.updateProfileForm.value).subscribe((res:any)=>{
         alert(res.message)
         this.userService.setUser(res?.data)
         this.toggleUpdate()
         this.updateProfileForm.reset()
      })

}
}
