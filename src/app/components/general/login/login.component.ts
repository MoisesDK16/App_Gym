import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import RegistroComponent from '../registro/registro.component';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../services/cliente-service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, RegistroComponent, RouterLink, FormsModule],
})
export default class LoginComponent {

  loginObj = {
    username: '',
    password: '',
  };

  userCliente: any;
  userAdmin: any;

  constructor(private authService: AuthService, private router: Router, private clienteService: ClienteService) {}

  invocarRegistro() {
    this.router.navigate(['/layout-publico/registro']);
  }

  async login() {

    this.clienteService.unoClienteCorreo(this.loginObj.username).subscribe({
      next: (response: any) => {
        console.log('Cliente encontrado', response);
        this.userCliente = response;
        this.authService.onLogin(this.loginObj).subscribe(
          (response: any) => {
            console.log('Login exitoso', response);
            this.router.navigate(['/layout-publico/home']);
          },
          (error: any) => {
            console.error('Error en el login', error);
          });
      },
      error: (error: any) => {
        console.error('Error al buscar cliente', error);
        this.authService.onLogin(this.loginObj).subscribe(
          (response: any) => {
            this.userAdmin = response;
            console.log('Login exitoso', response);
            this.router.navigate(['/layout-admin/cliente']);
          },
          (error: any) => {
            console.error('Error en el login admin', error);
          });
      }
    });
  }

      // this.router.navigate(['/layout-admin/cliente']);
}