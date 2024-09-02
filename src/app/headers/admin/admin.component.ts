import { CommonModule } from '@angular/common';
import { Component, Input, OnInit} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})

export class AdminComponent {
  private _isLogin: boolean = false;

  ngOnInit(): void {
    console.log('AdminComponent initialized');
  }
}
