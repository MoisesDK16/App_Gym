import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [

    {
        path: 'layout-publico',
        loadComponent: () => import('./layouts/layout/layout.component'),
        children: [
            {
                path: 'home',
                loadComponent: () => import('./components/general/home/home.component')
            },
            {
                path: 'catalogo-productos',
                loadComponent: () => import('./components/general/catalogo-productos/catalogo-productos.component')   
            },
            {
                path: 'catalogo-planes',
                loadComponent: () => import('./components/general/catalogo-planes/catalogo-planes.component')
            },
            {
                path: 'login',
                loadComponent: () => import('./components/general/login/login.component')
            },
            {
                path: 'registro',
                loadComponent: () => import('./components/general/registro/registro.component')
            },
        ]
    },

    {
        path: 'layout-admin',
        loadComponent: () => import('./layouts/layout-admin/layout-admin.component'),
        children: [
            {
                path: 'cliente',
                loadComponent: () => import('./components/admin/cliente/cliente.component')
            },
            {
                path: 'facturacion-caja',
                loadComponent: () => import('./components/admin/facturacion-caja/facturacion-caja.component')
            },
            {
                path: 'facturas',
                loadComponent: () => import('./components/admin/facturas/facturas.component')

            },
            {
                path: 'personal',
                loadComponent: () => import('./components/admin/personal/personal.component')
            },
            {
                path: 'planes',
                loadComponent: () => import('./components/admin/planes/planes.component')
            },
            {
                path: 'productos',
                loadComponent: () => import('./components/admin/productos/productos.component')
            },
            {
                path: 'servicios',
                loadComponent: () => import('./components/admin/servicios/servicios.component')
            },
            {
                path: 'membresias',
                loadComponent: () => import('./components/admin/membresias/membresias.component')
            }   
            
        ]	
    },

    {
        path: 'checkout',
        loadComponent: () => import('./components/general/checkout/checkout.component')
    },
    
    { path: '', redirectTo: '/layout-publico/home', pathMatch: 'full' },
    // { path: '**', redirectTo: '/layout-publico/home' }
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }