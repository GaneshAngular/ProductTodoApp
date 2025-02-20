























import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMPLOYEE } from '../../core/constants/constant';
import { EmployeeService } from '../../core/services/employee/employee.service';
import { Employee } from '../../core/constants/interface';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  departments=['HR','ENGINEERING','MARKETING','FINANCE']
 
  employeeService=inject(EmployeeService)

  toggleEmployeeForm=false

  addForm=new FormGroup({
    name:new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z\s]{2,}$/)]),
    email:new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    ]),
    department: new FormControl('', [Validators.required,Validators.minLength(2)]),
    dob: new FormControl('', [Validators.required]),
    position: new FormControl('', Validators.required),
    salary: new FormControl(0, [Validators.required,Validators.pattern(/^[0-9]{2,}$/)]),
    role: new FormControl(EMPLOYEE)
  })

  toggleFormModal(){
    this.toggleEmployeeForm =!this.toggleEmployeeForm;
  }

  checkInvalidFields(field:'name'|'email'|'password'|'salary'|'department'|'dob'|'position'){
    const addForm=this.addForm.controls[field]
         if(addForm.invalid && addForm.touched){
          return true
  }
  return false
}

addEmployee(){
  if(this.addForm.invalid)return alert("please fill details")
      
    const employee:Employee={name:this.addForm.value.name||'',
          email:this.addForm.value.email||'',
          password:this.addForm.value.password||'',
          department:this.addForm.value.department||'',
          dob:this.addForm.value.dob ||'',
          position:this.addForm.value.position?.toUpperCase()||'',
          salary:this.addForm.value.salary||0,
          role:this.addForm.value.role ||'',
    }

    this.employeeService.addEmployee(employee).subscribe((res:any)=>{
            alert(res.message)
            this.addForm.reset()
            this.toggleEmployeeForm=false
    })

}

}
