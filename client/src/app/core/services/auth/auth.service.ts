import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { AUTH_URL } from '../../constants/API_URLS';
import { AUTH } from '../../constants/interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpService:HttpService) { }

  signin(data:AUTH){
  return this.httpService.post(AUTH_URL.signin,data)
  }

  signup(data:AUTH){
   return this.httpService.post(AUTH_URL.signup,data)
  }
  refreshToken(){
    return this.httpService.get(AUTH_URL.refresh)
  }

}
