import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { EMPLOYEE_URL } from '../../constants/API_URLS';
import { Employee } from '../../constants/interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private httpService:HttpService) { }

  addEmployee(data:Employee){
  return this.httpService.post(EMPLOYEE_URL.employee,data)
  }

  getProfile(){
    return this.httpService.get(EMPLOYEE_URL.self)
  }
  updateProfile(data:any){
    return this.httpService.put(EMPLOYEE_URL.self,data)
  }

  getEmployees(params?:HttpParams){
   return this.httpService.get(EMPLOYEE_URL.employee,params)
  }

  updateEmployee(data:Employee,params?:HttpParams){
    return this.httpService.put(EMPLOYEE_URL.employee,data,params)

  }

  deleteEmployee(params?:HttpParams){
    return this.httpService.delete(EMPLOYEE_URL.employee,params)

  }
}
