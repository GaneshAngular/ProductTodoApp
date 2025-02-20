import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { LocalstorageService } from '../services/localstorage/localstorage.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ADMIN } from '../constants/constant';
import { tap } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const authorizationInterceptor: HttpInterceptorFn = (req, next,) => {
  const localService=inject(LocalstorageService)
   const authService=inject(AuthService)
     const accessToken=localService.getToken()
           if(accessToken){
                const cloneReq=req.clone({
                  headers: req.headers.set('authorization',accessToken),
                })

             return next(cloneReq).pipe(tap((event) => {
              if (event.type === HttpEventType.Response) {
                     if(event.status==401){
                            authService.refreshToken().subscribe((res:any)=>{
                              if(res.token){
                                localService.setToken(res.token)
                                 next(cloneReq)
                              }

                            })
                     }
              }
            }));
           }

  return next(req);
};
