import { Routes } from '@angular/router';
import { isLoggedGuard } from './core/guards/isLogged/is-logged.guard';
import { isLogoutGuard } from './core/guards/isLogout/is-logout.guard';
import { isAdminGuard } from './core/guards/Admin/is-admin.guard';

export const routes: Routes = [{
  path:'',
  redirectTo:'login',
  pathMatch:'full'
},{
  path:'login',
  loadComponent:()=>import('./pages/login/login.component').then((c)=>c.LoginComponent),
  canActivate:[isLogoutGuard]
},{
  path:'signup',
  loadComponent:()=>import('./pages/signup/signup.component').then((c)=>c.SignupComponent),
  canActivate:[isLogoutGuard]
},{
  path:'dashboard',
  loadComponent:()=>import('./pages/dashboard/dashboard.component').then((c)=>c.DashboardComponent),
  canActivate:[isLoggedGuard,isAdminGuard]
},{
  path:'profile',
  loadComponent:()=>import('./pages/profile/profile.component').then((c)=>c.ProfileComponent),
  canActivate:[isLoggedGuard]
}];
