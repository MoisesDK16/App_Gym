import { Routes } from '@angular/router';
import { ClienteComponent } from './components/cliente/cliente.component';
import { ProductosComponent } from './components/productos/productos.component';
import { CatalogoProductosComponent } from './components/catalogo-productos/catalogo-productos.component';
import { CatalogoPlanesComponent } from './components/catalogo-planes/catalogo-planes.component';
import { PlanesComponent } from './components/planes/planes.component';
import { FacturacionCajaComponent } from './components/facturacion-caja/facturacion-caja.component';
import { ServiciosComponent } from './components/servicio/servicio.component';
import { FacturasComponent } from './components/facturas/facturas.component';
import { PersonalComponent } from './components/personal/personal.component';

export const routes: Routes = [
    {path: 'cliente' , component: ClienteComponent}, 
    {path: 'productos' , component: ProductosComponent},
    {path: 'planes' , component: PlanesComponent},
    {path: 'catalogo_productos', component: CatalogoProductosComponent},
    {path: 'catalogo-planes', component: CatalogoPlanesComponent},
    {path: 'facturacion-caja', component: FacturacionCajaComponent},
    {path: 'servicios', component: ServiciosComponent},
    {path: 'facturas', component: FacturasComponent},
    {path: 'personal', component: PersonalComponent}
];
