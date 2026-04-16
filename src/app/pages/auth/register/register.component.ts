import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthService } from  '../../../services/auth.service';

const SPECIALS = `!@#$%^&*()_+-=[]{};':"\\|,.<>/?`;

function hasSpecialChar(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '');
  const specialsRegex = new RegExp('[' + SPECIALS.replace(/[\\\]\-\[]/g, '\\$&') + ']');
  return specialsRegex.test(value) ? null : { specialChar: true };
}

function matchPasswords(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value ?? '';
  const confirm = group.get('confirmPassword')?.value ?? '';
  return password && confirm && password !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  readonly specials = SPECIALS;
  form;
  
  // 2. AQUÍ ES DONDE SE INYECTA REALMENTE EL SERVICIO
  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private authService: AuthService
  ) {
    this.form = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        address: ['', [Validators.required, Validators.minLength(5)]],
        phone: ['', [
          Validators.required,
          Validators.pattern(/^\d+$/)
        ]],
        password: ['', [
          Validators.required,
          Validators.minLength(10),
          hasSpecialChar
        ]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: [matchPasswords] }
    );
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const val = this.form.value;
    const payload = {
      nombre_completo: val.fullName,
      username: val.username,
      email: val.email,
      password: val.password,
      direccion: val.address, 
      telefono: val.phone     
    };

    this.authService.register(payload).subscribe({
      next: (response) => {
        console.log('Registro exitoso en Supabase:', response);
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        alert(err.error?.data?.message || 'Error al conectar con el servidor');
      }
    });
  }

  get f() { return this.form.controls; }
}