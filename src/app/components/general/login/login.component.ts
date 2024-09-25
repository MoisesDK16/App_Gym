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
        localStorage.setItem('cliente', JSON.stringify(response));
        this.userCliente = response;
        this.authService.onLogin(this.loginObj).subscribe(
          (loginResponse: any) => {
            console.log('Login exitoso', loginResponse);
            localStorage.setItem('accessToken', loginResponse.accessToken);
            // localStorage.removeItem('accessToken');
            this.router.navigate(['/layout-publico/home']);
          },
          (loginError: any) => {
            console.error('Error en el login', loginError);
          }
        );
      },
      error: (clientError: any) => {
        console.error('Error al buscar cliente', clientError);
        this.authService.onLogin(this.loginObj).subscribe(
          (response: any) => {
            console.log('Login exitoso como admin', response);
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('admin', response.accessToken);
            this.router.navigate(['/layout-admin/cliente']);
            // localStorage.removeItem('accessTokenCliente');
          },
          (adminError: any) => {
            console.error('Error en el login admin', adminError);
          }
        );
      }
    });
  }
  

      // this.router.navigate(['/layout-admin/cliente']);
}