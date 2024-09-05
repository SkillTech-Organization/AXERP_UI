import { Injectable } from '@angular/core';
import { LoginUser } from '../../util/models/LoginUser';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  get isLoggedIn() { return this.user !== null; }

  get user(): LoginUser | null {
    const userJson = window.sessionStorage.getItem(USER_KEY);
    //console.log("get user: ", userJson);
    if (userJson !== null && userJson !== undefined) {
      return JSON.parse(userJson) as LoginUser;
    }
    return userJson;
  }

  set user(newUser: LoginUser | null) {
    console.log("set user: ", newUser);
    if (newUser !== undefined && newUser !== null) {
      window.sessionStorage.removeItem(USER_KEY);
      window.sessionStorage.setItem(USER_KEY, newUser !== null && newUser !== undefined ? JSON.stringify(newUser) : newUser);
    }
  }

  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  getValue(key: string): string {
    if (key !== USER_KEY) {
      return window.sessionStorage.getItem(key) ?? ''
    }
    return ''
  }

  setValue(key: string, value: number | string): void {
    if (key !== USER_KEY) {
      window.sessionStorage.removeItem(key);
      window.sessionStorage.setItem(key, value + '');
    }
  }
}
