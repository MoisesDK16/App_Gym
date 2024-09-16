import { Component } from '@angular/core';
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

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, LoginComponent, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export default class RegistroComponent {
  avisoIdentificacion: boolean = false;
  avisoCorreo: boolean = false;
  avisoContrasenia: boolean = false;

  cliente: Clientes = new Clientes('', '', '', '', '', '', '', '', '');
  title = 'registro';

  constructor(
    private router: Router,
    private _clienteServide: ClienteService
  ) {}

  registrarCliente(): void {
    if (
      this.validarID() &&
      this.validarCorreo() &&
      this.validarContrasenia()
    ) {
      console.log('Cliente a registrar', this.cliente);
      this._clienteServide.registrarCliente(this.cliente).subscribe((data) => {
        console.log('Cliente creado', data);
        this.router.navigate(['/login']);
      });
    } else {
      console.log('Datos inválidos');
      alert('Ingrese Datos validos');
    }
  }

  validarIdentificacion(): boolean {
    let valido = false;

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
      if (validarCedula(this.cliente.id_cliente)) {
        console.log('Cédula válida');
        valido = true;
      } else {
        console.log('Cédula inválida');
        valido = false; 
      }
    }

    if (this.cliente.id_cliente.length === 13) {
      if (validarRuc(this.cliente.id_cliente)) {
        console.log('RUC válido');
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
