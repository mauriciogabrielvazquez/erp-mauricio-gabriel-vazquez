import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

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
  
  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        address: ['', [Validators.required, Validators.minLength(5)]],
        phone: ['', [
          Validators.required,
          Validators.pattern(/^\d+$/) // solo números
          // si quieres exactamente 10 dígitos, usa: Validators.pattern(/^\d{10}$/)
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

    // Aquí iría tu llamada a API. Si todo OK:
    this.router.navigate(['/auth/login']);
  }

  get f() { return this.form.controls; }
}