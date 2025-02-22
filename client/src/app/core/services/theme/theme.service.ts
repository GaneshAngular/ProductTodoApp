import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  darkTheme=signal(localStorage.getItem('darkTheme')=='dark'?true:false)
  constructor() {
    const theme=localStorage.getItem('darkTheme')
    console.log(theme)
    if(theme==='dark')
      this.darkTheme.set(true)
    else if(theme==='white')
      this.darkTheme.set(false)
   }

  toggleTheme(){
    const theme=!this.darkTheme()
    this.darkTheme.set(theme)

  }
  getTheme(){
    return this.darkTheme()
  }
}
