
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMPLOYEE } from '../../core/constants/constant';
import { EmployeeService } from '../../core/services/employee/employee.service';
import { Employee } from '../../core/constants/interface';
import { HttpParams } from '@angular/common/http';
import { PaginationComponent } from "../../components/pagination/pagination.component";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, PaginationComponent,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  departments=['HR','ENGINEERING','MARKETING','FINANCE']
   employees:any
  employeeService=inject(EmployeeService)
   id:any
   order=false
   totalPages = signal<number>(0)
   page=1
   sortBy='name'
   searchQuery=""
   limit=5
  toggleEmployeeForm=false
  today=new Date()
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

  ngOnInit(): void {
    this.loadEmployees()
  }
  toggleFormModal(){
    this.addForm.reset()
    this.toggleEmployeeForm =!this.toggleEmployeeForm;
  }

  loadEmployees(){
    console.log(this.order)
    let params=new HttpParams().set('page',this.page).set('limit',this.limit).set('order',this.order?'desc':'asc').set('sort',this.sortBy)
    if(this.searchQuery)
       params=params.set('search',this.searchQuery)
     this.employeeService.getEmployees(params).subscribe((res:any)=>{
       this.employees=res.data
       this.totalPages.set(res.totalPages)
     })
  }

  checkInvalidFields(field:'name'|'email'|'password'|'salary'|'department'|'dob'|'position'){
    const addForm=this.addForm.controls[field]
         if(addForm.invalid && addForm.touched){
          return true
  }
  return false
}
changePage(event:any){
   this.page=event
   this.loadEmployees()
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
          role:EMPLOYEE,
    }

    this.employeeService.addEmployee(employee).subscribe((res:any)=>{
            alert(res.message)
            this.addForm.reset()
            this.toggleEmployeeForm=false
            this.loadEmployees()
    })

}

updateFormToggle(index:number){
  const employee = this.employees[index]
  this.addForm.patchValue(employee)
    this.id=employee._id
    this.toggleEmployeeForm=true
}

updateEmployee(){
  if(this.addForm.invalid)return alert("please fill details")

    const params=new HttpParams().set('id',this.id)
    const employee:Employee={name:this.addForm.value.name||'',
      email:this.addForm.value.email||'',
      password:this.addForm.value.password||'',
      department:this.addForm.value.department||'',
      dob:this.addForm.value.dob ||'',
      position:this.addForm.value.position?.toUpperCase()||'',
      salary:this.addForm.value.salary||0,
      role:this.addForm.value.role ||'',
}
  this.employeeService.updateEmployee(employee,params).subscribe((res:any)=>{
    alert(res.message)
    this.addForm.reset()
    this.toggleEmployeeForm=false
    this.loadEmployees()
  })
}

deleteEmployee(id:string){
    const params=new HttpParams().set('id',id)
    if(confirm("Are you sure"))
    this.employeeService.deleteEmployee(params).subscribe((res:any)=>{
      alert(res.message)
      this.loadEmployees()
    })
}

}
