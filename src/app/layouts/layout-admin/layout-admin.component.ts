import { Component, OnInit } from '@angular/core';
import { AdminComponent } from "../../headers/admin/admin.component";
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [AdminComponent, RouterOutlet],
  templateUrl: './layout-admin.component.html',
  styleUrl: './layout-admin.component.css'
})
export default class LayoutAdminComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
    this.getAdmin();
  }

  getAdmin(): void {
    const admin = this.authService.getAdmin(); // Obtiene el admin desde el servicio
    if (admin) {
      console.log('Admin:', admin); // Muestra el admin sin parsear
    } else {
      this.router.navigate(['/layout-publico/home']); // Redirige si no hay admin
    }
  }
}
