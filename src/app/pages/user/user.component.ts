import { Component } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-user',
  imports: [SidebarComponent, CommonModule, InputTextModule, PasswordModule, ButtonModule, CardModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

}
