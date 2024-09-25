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

  setTokenUser(token: string): void {
    if (token) {
      localStorage.setItem('accessToken', token); 
      console.log('Token seteado: ', localStorage.getItem('accessToken'));
    } else {
      console.error('Intento de guardar un token nulo o indefinido');
    }
  }
  

  getTokenUser(): string | null {
    const token = localStorage.getItem('accessToken');
    console.log("Token desde el servicio: ", token);
    return token; 
  }
  

  setUserCliente(){
    localStorage.setItem('userCliente', JSON.stringify(this.userCliente));
  }

  getUserCliente(): any{
      const userCliente = localStorage.getItem('userCliente');
      return userCliente ? JSON.parse(userCliente) : null;
  }

  setTokenCliente(token: string): void {
    localStorage.setItem('accessTokenCliente', token); 
    console.log('Token seteado: ', localStorage.getItem('accessTokenCliente'));
    console.error('Intento de guardar un token nulo o indefinido');
  }

  getTokenCliente(): string | null {
    const token = localStorage.getItem('accessTokenCliente');
    console.log("Token desde el servicio: ", token);
    return token; 
  }

  setCliente(cliente: Clientes){
    localStorage.setItem('cliente', JSON.stringify(cliente));
  }

  getCliente(): any{
    const cliente = localStorage.getItem('cliente');
    return cliente ? JSON.parse(cliente) : null;
  }

  onLogin(obj:any): Observable<any> {
    return this.http.post(`${this.urlLogin}/login`, obj);
  }

  OnRegister(obj:any): Observable<any> {
    return this.http.post(`${this.urlLogin}/me/registerCliente`, obj);
  }
}
