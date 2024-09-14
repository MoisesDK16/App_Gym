import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export default class UserComponent {

  @Output() opened = new EventEmitter<boolean>();


  cerrarUser() {
    this.opened.emit(false);
  }

}
