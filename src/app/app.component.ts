import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductosComponent } from './components/productos/productos.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ClienteComponent } from './components/cliente/cliente.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ProductosComponent, ClienteComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'App_Gym';
}
