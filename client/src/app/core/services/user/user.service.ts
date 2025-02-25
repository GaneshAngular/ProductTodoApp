import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
  user=new BehaviorSubject<any>(null)
  $userData=this.user.asObservable()

  setUser(user:any){
    this.user.next(user)
  }

  getUser(){
    return this.$userData
  }


}
