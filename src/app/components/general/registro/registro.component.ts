import { Component } from '@angular/core';
import LoginComponent from '../login/login.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule,LoginComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export default class RegistroComponent {
  title = 'registro';
  constructor(private router: Router){}
  
}
