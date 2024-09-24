import { Component, OnInit } from '@angular/core';
import LoginComponent from '../login/login.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Clientes } from '../../../models/Clientes';
import { validarCedula } from '../../../../resources/validations/validar-cedula';
import { validarRuc } from '../../../../resources/validations/validar-ruc';
import { validarCorreoGmail } from '../../../../resources/validations/validar-correo';
import { validarContraseñaSegura } from '../../../../resources/validations/validar-pass';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../services/cliente-service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, LoginComponent, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export default class RegistroComponent implements OnInit {
  avisoIdentificacion: boolean = false;
  avisoCorreo: boolean = false;
  avisoContrasenia: boolean = false;

  loginObj = {
    username: 'justin',
    password: 'Justin123!',
  };


  cliente: Clientes = new Clientes('', '', '', '', '', '', '', '', '');
  title = 'registro';

  constructor(
    private router: Router,
    private _clienteServide: ClienteService,
    private _authServise: AuthService
  ) {}

  ngOnInit(): void {
    this.login();
  }

  login() {
    this._authServise.onLogin(this.loginObj).subscribe(
      (response: any) => {
        console.log('Login exitoso', response);
        localStorage.setItem('authToken', response.token);
      },
      (error: any) => {
        console.error('Error en el login', error);
      }
    );
  }

  resetCliente(): void {
    this.cliente = new Clientes('', '', '', '', '', '', '', '', '');
  }

  registrarCliente(): void {
    if (this.validarID() && this.validarCorreo() && this.validarContrasenia()) {
      console.log('Cliente a registrar', this.cliente);
      this._clienteServide.registrarCliente(this.cliente).subscribe(async (data) => {
        console.log('Cliente creado', data);
        alert('Registro exitoso');
        await this.registrarClientelikeUser();
        this.resetCliente();
      });
    } else {
      console.log('Datos inválidos');
      alert('Ingrese Datos validos');
    }
  }


  async registrarClientelikeUser(): Promise<void> {
    const userObj = {
      name: this.cliente.nombre,
      lastName: this.cliente.primer_apellido,
      username: this.cliente.correo,
      password: this.cliente.clave,
    }

      this._authServise.OnRegister(userObj).subscribe((data) => {
        console.log('Usuario Cliente creado', data);
        // this.router.navigate(['/login']);
      });
  }
  

  validarIdentificacion(): boolean {
    let valido = false;
    const tipo_identificacion = document.getElementById('tipo_identificacion') as HTMLSelectElement;
  
    if (this.cliente.id_cliente.trim() === '') {
      valido = false;
    }
  
    if (
      this.cliente.id_cliente.length < 10 ||
      this.cliente.id_cliente.length > 13
    ) {
      console.log('La identificación debe tener entre 10 y 13 caracteres.');
      valido = false;
    }
  
    if (this.cliente.id_cliente.length === 10) {
      console.log('Cédula: ', this.cliente.id_cliente.toString());
      if (validarCedula(this.cliente.id_cliente)) {
        console.log('Cédula válida');
        if (tipo_identificacion) {
          tipo_identificacion.innerHTML = ''; // Limpia los options anteriores
          const option = document.createElement('option');
          option.value = 'cedula';
          option.textContent = 'cedula';
          tipo_identificacion.appendChild(option);
        }
        this.cliente.tipo_identificacion = 'cedula';
        valido = true;
      } else {
        console.log('Cédula inválida');
        valido = false;
      }
    }
  
    if (this.cliente.id_cliente.length === 13) {
      if (validarRuc(this.cliente.id_cliente)) {
        console.log('RUC válido');
        if (tipo_identificacion) {
          tipo_identificacion.innerHTML = ''; // Limpia los options anteriores
          const option = document.createElement('option');
          option.value = 'RUC';
          option.textContent = 'RUC';
          tipo_identificacion.appendChild(option);
        }
        this.cliente.tipo_identificacion = 'RUC';
        valido = true;
      } else {
        console.log('RUC inválido');
        valido = false;
      }
    }
  
    return valido;
  }
  

  validarCorreo(): boolean {
    let campoValido = false;

    if (!validarCorreoGmail(this.cliente.correo)) {
      this.avisoCorreo = true;
      campoValido = false;
    } else {
      this.avisoCorreo = false;
      campoValido = true;
    }
    return campoValido;
  }

  validarContrasenia(): boolean {
    let campoValido = false;

    if (!validarContraseñaSegura(this.cliente.clave)) {
      this.avisoContrasenia = true;
      campoValido = false;
    } else {
      this.avisoContrasenia = false;
      campoValido = true;
    }

    return campoValido;
  }

  validarID(): boolean {
    let campoValido = true;

    if (!this.validarIdentificacion()) {
      campoValido = false;
      this.avisoIdentificacion = true;
    } else {
      this.avisoIdentificacion = false;
      campoValido = true;
    }
    return campoValido;
  }
}
