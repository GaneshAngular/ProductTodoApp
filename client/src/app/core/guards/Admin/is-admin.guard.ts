import { CanActivateFn } from '@angular/router';
import { LocalstorageService } from '../../services/localstorage/localstorage.service';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ADMIN } from '../../constants/constant';

export const isAdminGuard: CanActivateFn = (route, state) => {
   const localService=inject(LocalstorageService)

       const accessToken=localService.getToken()
             if(accessToken){
                   const data:any=jwtDecode(accessToken)
                   if(data && data.role==ADMIN)
               return true
             }
     return false;
};
