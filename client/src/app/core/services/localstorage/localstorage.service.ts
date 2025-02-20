import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

   getToken(){
      return localStorage.getItem('accessToken') ||''
   }

   removeToken(){
    return localStorage.removeItem('accessToken')
   }

   setToken(token:string){
    return localStorage.setItem('accessToken',token)

   }
}
