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
          (loginResponse: any) => {
            console.log('Login exitoso', loginResponse);
            this.authService.setTokenUser(loginResponse.accessToken); // Establecer el token al hacer login
            this.router.navigate(['/layout-publico/home']);
          },
          (loginError: any) => {
            console.error('Error en el login', loginError);
          }
        );
      },
      error: (clientError: any) => {
        console.error('Error al buscar cliente', clientError);
        // Intentar iniciar sesión como admin si no se encuentra el cliente
        this.authService.onLogin(this.loginObj).subscribe(
          (adminResponse: any) => {
            this.userAdmin = adminResponse;
            console.log('Login exitoso como admin', adminResponse);
            this.authService.setTokenUser(adminResponse.accessToken); // Establecer el token al hacer login como admin
            this.router.navigate(['/layout-admin/cliente']);
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