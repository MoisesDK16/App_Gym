import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Clientes } from '../models/Clientes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoginSubject = new BehaviorSubject<boolean>(false);
  isLogin$ = this.isLoginSubject.asObservable();
  urlLogin: string = '/users';

  private userCliente = new Clientes('2350918856', 'Cédula', 'Moises', 'Loor', 'Vasquez','moisesloor12@gmail.com', '1234', 'pepe', '019182728');

  constructor(private http: HttpClient) {}

  setLoginStatus(status: boolean) {
    this.isLoginSubject.next(status);
  }

  setUserCliente(){
    localStorage.setItem('userCliente', JSON.stringify(this.userCliente));
  }

  getUserCliente(): any{
      const userCliente = localStorage.getItem('userCliente');
      return userCliente ? JSON.parse(userCliente) : null;
  }

  onLogin(obj:any): Observable<any> {
    return this.http.post(`${this.urlLogin}/login`, obj);
  }

  OnRegister(obj:any): Observable<any> {
    return this.http.post(`${this.urlLogin}/registerCliente`, obj);
  }
}
