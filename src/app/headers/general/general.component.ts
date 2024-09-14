import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { RouterLink, RouterLinkActive} from '@angular/router';
import { ProductoService } from '../../services/producto-service';
import CarroComponent from "../../components/general/carro/carro.component";
import { CarroService } from '../../services/carro.service';
import UserComponent from '../../components/general/user/user.component';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [RouterLink, CommonModule, CarroComponent, UserComponent],
  templateUrl: './general.component.html',
  styleUrl: './general.component.css'
})
export default class GeneralComponent{

  title = 'general';

  viewCart: boolean = false;
  myCart$ = this._carroService.retornarCarrito();

  viewUser: boolean = false;

  constructor(private _carroService: CarroService) {}

  onToggleCart() {
    this.viewCart = !this.viewCart
  };

  offToggleCart(event: boolean) {
    this.viewCart = event; 
  }

  onToggleUser() {
    this.viewUser = !this.viewUser;
  }

  offToggleUser(event: boolean) {
    this.viewUser = event;
  }
}
