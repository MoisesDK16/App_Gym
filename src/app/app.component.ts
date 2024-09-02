import { Component, Input, OnInit } from '@angular/core';
import {  RouterLink, RouterOutlet } from '@angular/router';
import LayoutComponent from "./layouts/layout/layout.component";
import GeneralComponent from './headers/general/general.component';
import { AdminComponent } from './headers/admin/admin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent, GeneralComponent, AdminComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {

  constructor() {}
}