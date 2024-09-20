import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../services/cliente-service';
import {ClienteResponse, Clientes}  from '../../../models/Clientes';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { AdminComponent } from '../../../headers/admin/admin.component';
import {validarCedula} from '../../../../resources/validations/validar-cedula';
import { validarRuc } from '../../../../resources/validations/validar-ruc';
import { validarCorreoGmail } from '../../../../resources/validations/validar-correo';
import { validarContraseñaSegura } from '../../../../resources/validations/validar-pass';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [NgFor,NgIf , FormsModule, MatTableModule, MatPaginatorModule, AdminComponent],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css',
})
export default class ClienteComponent implements OnInit, AfterViewInit {

  clientes: Clientes[] = [];
  cliente: Clientes = new Clientes ('', '', '', '', '', '', '', '', '');
  estado: string = "";
  displayedColumns: string[] = ['id_cliente', 'tipo_identificacion', 'nombre', 'primer_apellido', 'segundo_apellido', 'correo', 'clave', 'direccion', 'telefono', 'acciones'];
  dataSource!: MatTableDataSource<Clientes>;

  /*Variables de plantilla */
  avisoIdentificacion: boolean = false;
  avisoCorreo: boolean = false;
  avisoContrasenia: boolean = false;

  incompleto: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Variables para manejar la paginación
  pageSize = 10;
  currentPage = 0;
  totalItems = 0;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private clienteServicio: ClienteService, private router: Router){}

  ngOnInit(): void {
    this.getClientes();
  }

  resetEstado(){
    this.estado = "";
    this.cliente = new Clientes ('', '', '', '', '', '', '', '', '');
  }

  // Método para obtener clientes basado en la página y tamaño actuales
  getClientes(): void {
    this.clienteServicio.getClientes(this.currentPage, this.pageSize).subscribe((data: ClienteResponse) => {
      this.clientes = data.content;
      this.dataSource = new MatTableDataSource<Clientes>(this.clientes);
      this.totalItems = data.totalElements;
      // Configura el paginador solo si está disponible
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    }, error => {
      console.error("Error al obtener clientes:", error);
      // Aquí podrías manejar el error o mostrar un mensaje al usuario
    });
  }

  registrarCliente(): void {

    if(this.incompleto == false){
      if (
        this.validarID() &&
        this.validarCorreo() &&
        this.validarContrasenia() 
      ) {
        console.log('Cliente a registrar', this.cliente);
        this.clienteServicio.registrarCliente(this.cliente).subscribe((data) => {
          console.log('Cliente creado', data);
          this.getClientes();
          this.closeModal();
        });
      } else {
        console.log('Datos inválidos');
        alert('Ingrese Datos validos');
      }
    }
  }
  
  registrarCliente2(): void{
    if(this.validarID() && this.incompleto==true){
      this.clienteServicio.registrarCliente(this.cliente).subscribe(data => {
        console.log('Cliente creado', data);
        this.getClientes();
        this.closeModal();
      });
    }
  }

  verificarCamposIncompletos(): void {

    const correoInput = document.getElementById('correo') as HTMLInputElement;
    let correoValue = correoInput.value;
    const claveInput = document.getElementById('clave') as HTMLInputElement;
    let claveValue = claveInput.value;

    if(correoValue === '' && claveValue === ''){
      this.incompleto = true;
    }

    console.log("incompleto?: ", this.incompleto);
  }

  actualizarCliente(): void {
    this.clienteServicio.actualizarCliente(this.cliente).subscribe((data: any) => {
      this.getClientes();
      this.closeModal();
      this.resetEstado();
    });
  }

  unoCliente(id_cliente: string):void{
    this.clienteServicio.unoCliente(id_cliente).subscribe((data: Clientes) => {
      this.openModal();
      this.cliente = data;
      this.estado = "actualizar";
      console.log(this.cliente);
      console.log(this.estado);
    });
  }

  eliminarCliente(id_cliente: string): void {
    this.clienteServicio.eliminarCliente(id_cliente).subscribe((data: any) => {
      this.getClientes();
    });
  }


  // Método que se ejecuta cuando cambia la paginación
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getClientes();
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


  openModal(): void {
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) {
      modalDiv.classList.add('show');
      modalDiv.style.display = 'block';
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.classList.add('modal-backdrop', 'fade', 'show');
      document.body.appendChild(backdrop);
      console.log(this.estado);
    }
  }

  closeModal(): void {
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) {
      this.resetEstado();
      modalDiv.classList.remove('show');
      modalDiv.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    }
  }
}




