import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, CardModule]
})
export class LandingPageComponent { }