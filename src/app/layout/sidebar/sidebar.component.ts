import { Component, inject } from '@angular/core';
import { Router } from '@angular/router'; // Importamos el Router
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RouterModule, RouterLink } from '@angular/router';

import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SidebarModule, 
    ButtonModule, 
    RouterModule, 
    RippleModule, 
    AvatarModule, 
    StyleClassModule, 
    Sidebar, 
    RouterLink,
    HasPermissionDirective
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  sidebarVisible = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  closeCallback(event: Event) {
    this.sidebarVisible = false;
  }

  logout() {
    this.authService.logout(); // Limpia el Token y los permisos
    this.sidebarVisible = false; // Cierra el menú visualmente
    this.router.navigate(['/auth/login']); // Lo manda de regreso al Login
  }
}