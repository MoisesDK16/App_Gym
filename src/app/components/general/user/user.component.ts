import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export default class UserComponent {

  @Output() opened = new EventEmitter<boolean>();

  constructor(private router: Router) { }


  cerrarUser() {
    this.opened.emit(false);
  }

  abrirUserMembresia(){
    const url = this.router.serializeUrl(this.router.createUrlTree(['/user-membresia']));
    window.open(url, '_blank');  
  }

}
