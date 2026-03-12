import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';

type UserModel = {
  username: string;
  email: string;
  fullName: string;
  address: string;
  phone: string;
};

// Interfaz para la lista de tareas del usuario
interface UserTicket {
  id: string;
  title: string;
  status: string;
  priority: string;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    CardModule, 
    InputTextModule, 
    ButtonModule, 
    ToastModule, 
    TableModule, 
    TagModule
  ],
  providers: [MessageService],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  editMode = false;

  user: UserModel = {
    username: 'mauricio_gv',
    email: 'mauricio@gmail.com',
    fullName: 'Mauricio Gabriel Vázquez',
    address: 'Av. Siempre Viva 742, Qro.',
    phone: '4421234567'
  };

  assignedTickets: UserTicket[] = [];
  stats = { total: 0, pending: 0, inProgress: 0, done: 0 };

  form;

  constructor(private fb: FormBuilder, private msg: MessageService) {
    // Formulario reactivo limpio
    this.form = this.fb.group({
      username: [''],
      email: [''],
      fullName: [''],
      address: [''],
      phone: ['']
    });
  }

  ngOnInit() {
    this.loadToForm();
    this.loadTickets();
  }

  loadTickets() {
    // Simulando los tickets asignados al usuario para mostrar la carga de trabajo
    this.assignedTickets = [
      { id: 'TK-010', title: 'Revisar logs de servidor', status: 'Pendiente', priority: 'Alta' },
      { id: 'TK-011', title: 'Actualizar dependencias en Angular', status: 'En Progreso', priority: 'Media' },
      { id: 'TK-012', title: 'Corregir bug visual en menú', status: 'Hecho', priority: 'Baja' }
    ];

    // Calculando el resumen para las tarjetas
    this.stats = {
      total: this.assignedTickets.length,
      pending: this.assignedTickets.filter(t => t.status === 'Pendiente').length,
      inProgress: this.assignedTickets.filter(t => t.status === 'En Progreso').length,
      done: this.assignedTickets.filter(t => t.status === 'Hecho').length,
    };
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
    // Al guardar, tomamos los valores sin restricciones
    this.user = {
      username: this.form.value.username ?? '',
      email: this.form.value.email ?? '',
      fullName: this.form.value.fullName ?? '',
      address: this.form.value.address ?? '',
      phone: this.form.value.phone ?? '',
    };

    this.editMode = false;
    this.msg.add({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado correctamente.' });
  }

  // Método para el color de los tags en la tabla
  getSeverity(status: string) {
    switch (status) {
      case 'Hecho': return 'success';
      case 'En Progreso': return 'info';
      case 'Pendiente': return 'warning';
      default: return 'info';
    }
  }
}