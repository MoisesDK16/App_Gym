import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Clientes } from '../models/Clientes';
import { HttpClient } from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoginSubject = new BehaviorSubject<boolean>(false);
  isLogin$ = this.isLoginSubject.asObservable();
  urlLogin: string = '/users';

  private userCliente: any;

  constructor(private http: HttpClient) {}

  setLoginStatus(status: boolean) {
    this.isLoginSubject.next(status);
  }

  // setUserCliente(){
  //   localStorage.setItem('userCliente', JSON.stringify(this.userCliente));
  // }

  getUserCliente(): any {
    const token = localStorage.getItem('accessToken');
    if (token) {
        try {
            this.userCliente = jwtDecode(token); 
            console.log('Cliente cargado:', this.userCliente);
            return this.userCliente;
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            return null;
        }
    }
    return null;
}

  getCliente(): any{ 
    const cliente = localStorage.getItem('cliente');
    if(cliente){
      console.log(JSON.parse(cliente));
      return JSON.parse(cliente);
    }
    return null;  
  }

  getAdmin(): any {
    const adminToken = localStorage.getItem('admin'); 
    if (adminToken) {
        try {
            const admin = jwtDecode(adminToken); 
            console.log('Admin cargado:', admin);
            return admin; 
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            return null;
        }
    }
    return null;  
}


  onLogin(obj:any): Observable<any> {
    return this.http.post(`${this.urlLogin}/login`, obj);
  }

  OnRegister(obj:any): Observable<any> {
    return this.http.post(`${this.urlLogin}/me/registerCliente`, obj);
  }
}
