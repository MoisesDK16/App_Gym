import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Planes } from '../../../models/Planes';
import { PlanService } from '../../../services/plan-service';
import { CommonModule, NgFor } from '@angular/common';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AdminComponent } from '../../../headers/admin/admin.component';
import { ServicioService } from '../../../services/servicio.service';
import { Servicios } from '../../../models/Servicios';
import { Router, RouterLink } from '@angular/router';
import { CheckoutService } from '../../../services/checkout.service';
import CheckoutComponent from "../checkout/checkout.component";
import { AuthService } from '../../../services/auth.service';
import { MembresiaService } from '../../../services/membresia.service';

@Component({
  selector: 'app-catalogo-planes',
  standalone: true,
  imports: [NgFor, MatTableModule, MatPaginatorModule, AdminComponent, RouterLink, CommonModule, CheckoutComponent],
  templateUrl: './catalogo-planes.component.html',
  styleUrl: './catalogo-planes.component.css'
})
export default class CatalogoPlanesComponent implements OnInit{

  planes: Planes[] = [];
  servicios: Servicios[] = [];
  plan: any;
  cliente: any;
  membresia: any;
  @Input() id_plan: number;

  displayedColumns: string[] = ['id_plan', 'nombre', 'precio', 'duracion','imagen', 'acciones'];
  dataSource!: MatTableDataSource<Planes>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10;
  currentPage = 0;
  totalItems = 0;


  ngOnInit(): void {
    this.getPlanes();
    this.getServicios();
    this.getClienteToken();
    this.getMembresia();
  }

  constructor(private planService: PlanService, private servicioService: ServicioService, 
    private checkoutService: CheckoutService , private router: Router,
    private _authService: AuthService,
    private _MembresiaService: MembresiaService){}

  getPlanes(): void {
    this.planService.listarPlanes(this.currentPage, this.pageSize).subscribe((data: any) => {
      this.planes = data.content;
      this.dataSource = new MatTableDataSource<Planes>(this.planes);
      this.totalItems = data.totalElements;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      console.log(this.planes);
    });
  }

  enviarPlan(id: number): void {

    if(this.membresia ){
      alert("Ya tiene una membresia activa");
      return;
    }

    console.log("Enviando id:", id);
    localStorage.setItem('id_plan', id.toString());  
    const url = this.router.serializeUrl(this.router.createUrlTree(['/checkout']));
    window.open(url, '_blank');  
  }

  
  getClienteToken() {
    this.cliente = this._authService.getCliente();
    console.log("Cliente activo: ", this.cliente);
    return this._authService.getCliente(); 
  }

  async getMembresia(){
    this._MembresiaService.getMembresiaByCliente(this.cliente.id_cliente).subscribe((data)=> {
      this.membresia = data;
      console.log("Membresia cliente activo: ", this.membresia);
    });
  }

  // openCheckout() {
  //   this.router.navigate(['/checkout']);  
  // }

  getServicios(): void {
    this.servicioService.listarServicios().subscribe((data: any) => {
      this.servicios = data;
      console.log(this.servicios);
    });
  }

  
}
