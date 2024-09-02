import { Component } from '@angular/core';
import { AdminComponent } from "../../headers/admin/admin.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [AdminComponent, RouterOutlet],
  templateUrl: './layout-admin.component.html',
  styleUrl: './layout-admin.component.css'
})
export default class LayoutAdminComponent {

}
