import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class CookiestorageService {

  constructor(private cookie: CookieService){ }


  getToken(){
          const accessToken=this.cookie.get('accessToken');
          console.log(accessToken)
  }
}
