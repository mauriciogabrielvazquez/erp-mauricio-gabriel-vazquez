import { Component } from '@angular/core';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css',
    standalone: true,
    imports: [FormsModule, DatePicker, ButtonModule, RouterModule, SidebarComponent]
})
export class LandingPageComponent {
    date: Date | undefined;
}