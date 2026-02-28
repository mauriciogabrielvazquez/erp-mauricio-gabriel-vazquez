import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css',
    standalone: true,
    imports: [ButtonModule, RouterModule, ToolbarModule, CardModule]
})
export class LandingPageComponent {
    date: Date | undefined;
}