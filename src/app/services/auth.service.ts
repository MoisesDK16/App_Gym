import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Clientes } from '../models/Clientes';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoginSubject = new BehaviorSubject<boolean>(false);
  isLogin$ = this.isLoginSubject.asObservable();

  private userCliente = new Clientes('2350918856', 'Cédula', 'Moises', 'Loor', 'Vasquez','moisesloor12@gmail.com', '1234', 'pepe', '019182728');

  constructor() {}

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
}
