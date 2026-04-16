import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth.service';
import { Password } from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    Password
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  error = '';
  form;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    this.error = '';
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const email = (this.form.value.email ?? '').trim();
    const password = String(this.form.value.password ?? '');

    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('¡Login exitoso! Pase VIP recibido.', response);
        this.router.navigate(['/home/group']);
      },
      error: (err) => {
        console.error('Error de autenticación:', err);
        this.error = err.error?.data?.message || 'Correo o contraseña incorrectos.';
      }
    });
  }

  get f() { return this.form.controls; }
}