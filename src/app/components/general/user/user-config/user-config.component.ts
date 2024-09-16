import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../../services/cliente-service';
import { Clientes } from '../../../../models/Clientes';

@Component({
  selector: 'app-user-config',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-config.component.html',
  styleUrl: './user-config.component.css',
})
export default class UserConfigComponent {
  cliente: Clientes;

  constructor(
    private _authService: AuthService,
    private _clienteService: ClienteService
  ) {}

  ngOnInit() {
    this.getDatosUser();
  }

  getDatosUser() {
    this._clienteService.unoCliente('2350918856').subscribe((data) => {
      console.log("cliente", data);
      this.cliente = data;
    });
  }

  onSubmit() {
    this.actualizarDatos();
  }

  actualizarDatos() {
    this._clienteService.actualizarCliente(this.cliente).subscribe((data) => {
      console.log("cliente actualizado", data);
      this.cliente = data;
      this.getDatosUser();
    });
  }
}
