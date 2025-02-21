import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../constants/API_URLS';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http:HttpClient) { }

  get(url:string,params?:HttpParams){
   return this.http.get(SERVER_URL+url,{params, withCredentials: true}, )
  }

  post(url:string,data:any){
    return this.http.post(SERVER_URL+url,data,{withCredentials: true})
  }

  put(url:string,data:any,params?:HttpParams){
    return this.http.put(SERVER_URL+url,data,{params, withCredentials: true})
  }

  delete(url:string,params?:HttpParams){
    return this.http.delete(SERVER_URL+url,{params, withCredentials: true})
  }

}
