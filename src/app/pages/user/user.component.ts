import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

type UserModel = {
  username: string;
  email: string;
  fullName: string;
  address: string;
  phone: string;
  role: string;
};

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  editMode = false;

  user: UserModel = {
    username: 'mauricio_gv',
    email: 'mauricio@gmail.com',
    fullName: 'Mauricio Gabriel Vázquez',
    address: 'Av. Siempre Viva 742, Qro.',
    phone: '4421234567',
    role: 'Administrator',
  };

  form;

  constructor(private fb: FormBuilder, private msg: MessageService) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      role: ['', Validators.required],
    });

    this.loadToForm();
  }

  loadToForm() {
    this.form.patchValue({ ...this.user });
  }

  startEdit() {
    this.loadToForm();
    this.editMode = true;
  }

  cancel() {
    this.editMode = false;
    this.loadToForm();
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.user = {
      username: this.form.value.username ?? '',
      email: this.form.value.email ?? '',
      fullName: this.form.value.fullName ?? '',
      address: this.form.value.address ?? '',
      phone: this.form.value.phone ?? '',
      role: this.form.value.role ?? '',
    };

    this.editMode = false;

    this.msg.add({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully.' });
  }

  get f() {
    return this.form.controls;
  }
}