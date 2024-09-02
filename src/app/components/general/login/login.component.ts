import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import RegistroComponent from '../registro/registro.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, RegistroComponent, RouterLink],
})
export default class LoginComponent {

  constructor(private authService: AuthService, private router: Router) {}

  invocarRegistro() {
    console.log('Invocando Registro');
    this.router.navigate(['/layout-publico/registro']);
  }

  login() {
    console.log('Login event emitted:', true);
    this.router.navigate(['/layout-admin/cliente']);
  }
}