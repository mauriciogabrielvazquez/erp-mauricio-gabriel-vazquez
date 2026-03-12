import { Component } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RouterModule, RouterLink } from '@angular/router';

import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { HasPermissionDirective } from '../../directives/has-permission.directive';

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

  closeCallback(event: Event) {
    this.sidebarVisible = false;
  }
}