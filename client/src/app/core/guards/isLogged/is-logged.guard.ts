import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LocalstorageService } from '../../services/localstorage/localstorage.service';

export const isLoggedGuard: CanActivateFn = (route, state) => {
    const localService=inject(LocalstorageService)
    const accessToken=localService.getToken()
          if(accessToken)
            return true
  return false;
};
