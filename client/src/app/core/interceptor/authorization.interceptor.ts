import { HttpErrorResponse, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { LocalstorageService } from '../services/localstorage/localstorage.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, BehaviorSubject } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {
  const localService = inject(LocalstorageService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = localService.getToken();

  let isRefreshing = false;  // Define it outside of the request context to ensure only one refresh is triggered per request

  let refreshTokenSubject = new BehaviorSubject<any>(null);

  let cloneReq = req;

  // If the access token exists, add it to the request
  if (accessToken) {
    cloneReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  // Handle the request
  return next(cloneReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {  // Token expired or unauthorized
        // If a refresh token request is already in progress, wait for it to complete
        if (isRefreshing) {
          return refreshTokenSubject.pipe(
            switchMap((response:any) => {
              return next(
                cloneReq.clone({
                  setHeaders: {
                    Authorization: `Bearer ${response.token}`,
                  },
                })
              );
            })
          );
        }

        // If no refresh token request is in progress, trigger a new refresh
        isRefreshing = true;

        // Call the refreshToken service to get a new access token
        return authService.refreshToken().pipe(
          switchMap((response: any) => {
            isRefreshing = false;
            const newToken = response.token;
            localService.setToken(newToken);

            // Notify all waiting requests with the new token
            refreshTokenSubject.next(newToken);

            // Retry the failed request with the new token
            return next(
              cloneReq.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              })
            );
          }),
          catchError((refreshError) => {
            if(refreshError.status==500){
            isRefreshing = false;
            localService.removeToken();
            router.navigate(['/login']); } // Redirect to login if refresh fails
            return throwError(() => refreshError);  // Pass the error forward
          })
        );
      }

      // If it's not a 401 error, just propagate the error
      return throwError(() => error);
    })
  );

  // // Subscribe to the refresh token subject to handle token refreshes
};

