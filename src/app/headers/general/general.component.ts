import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { RouterLink, RouterLinkActive} from '@angular/router';
import { ProductoService } from '../../services/producto-service';
import CarroComponent from "../../components/general/carro/carro.component";

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [RouterLink, CommonModule, CarroComponent],
  templateUrl: './general.component.html',
  styleUrl: './general.component.css'
})
export default class GeneralComponent{

  title = 'general';

  viewCart: boolean = false;
  myCart$ = this._productoService.recogerItems();

  constructor(private _productoService: ProductoService) {}

  onToggleCart() {
    this.viewCart = !this.viewCart
  };

  offToggleCart(event: boolean) {
    this.viewCart = event; 
  }

}
