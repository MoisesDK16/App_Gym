import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import GeneralComponent from '../../headers/general/general.component';
import { AdminComponent } from "../../headers/admin/admin.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, GeneralComponent, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export default class LayoutComponent implements OnInit {
  constructor() {}
  
  ngOnInit() {
    localStorage.removeItem('accessToken');
  }

}
