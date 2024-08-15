import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente-service';
import {ClienteResponse, Clientes}  from '../../models/Clientes';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [NgFor, FormsModule, MatTableModule, MatPaginatorModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css',
})
export class ClienteComponent implements OnInit, AfterViewInit {

  clientes: Clientes[] = [];
  cliente: Clientes = new Clientes ('', '', '', '', '', '', '', '', '');
  estado: string = "";
  displayedColumns: string[] = ['id_cliente', 'tipo_identificacion', 'nombre', 'primer_apellido', 'segundo_apellido', 'correo', 'clave', 'direccion', 'telefono', 'acciones'];
  dataSource!: MatTableDataSource<Clientes>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Variables para manejar la paginación
  pageSize = 10;
  currentPage = 0;
  totalItems = 0;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private clienteServicio: ClienteService){}

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
    this.clienteServicio.registrarCliente(this.cliente).subscribe((data: any) => {
      this.getClientes();
      this.closeModal();
    });
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




