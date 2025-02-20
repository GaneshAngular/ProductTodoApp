import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '../../services/localstorage/localstorage.service';
import { inject } from '@angular/core';
import {jwtDecode} from 'jwt-decode'
import { ADMIN } from '../../constants/constant';

export const isLogoutGuard: CanActivateFn = (route, state) => {
  const localService=inject(LocalstorageService)
  const router=inject(Router)
     const accessToken=localService.getToken()
           if(accessToken){
                 const data:any=jwtDecode(accessToken)
                 if(data && data.role==ADMIN)
                     router.navigate(['/dashboard'])
                 else
                 router.navigate(['/profile'])

             return false
           }
   return true;
};
