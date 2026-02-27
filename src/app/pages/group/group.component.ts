import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-group',
  imports: [CardModule, CommonModule, SidebarComponent],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css'
})
export class GroupComponent {

}
