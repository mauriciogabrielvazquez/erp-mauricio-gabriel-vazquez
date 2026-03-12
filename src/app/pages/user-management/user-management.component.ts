  import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { HasPermissionDirective } from '../../directives/has-permission.directive'; // <-- Ajusta la ruta

interface SystemUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  status: 'Activo' | 'Inactivo';
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ToolbarModule,
    TagModule,
    HasPermissionDirective
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: SystemUser[] = [];
  
  userDialog = false;
  user: Partial<SystemUser> = {};
  selectedUsers: SystemUser[] | null = null;
  submitted = false;
  editMode = false;

  constructor(
    private messageService: MessageService, 
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    // Datos estáticos simulados
    this.users = [
      { id: 'U-101', username: 'luis_abraham', fullName: 'Luis Abraham', email: 'luis@erp.com', phone: '4421112233', address: 'Centro, Qro.', status: 'Activo' },
      { id: 'U-102', username: 'josue_arreola', fullName: 'Josué Arreola', email: 'josue@erp.com', phone: '4424445566', address: 'Juriquilla, Qro.', status: 'Activo' },
      { id: 'U-103', username: 'bruno_lopez', fullName: 'Bruno Lopez', email: 'bruno@erp.com', phone: '4427778899', address: 'El Marqués, Qro.', status: 'Activo' },
      { id: 'U-104', username: 'santiago_alberto', fullName: 'Santiago Alberto', email: 'santiago@erp.com', phone: '4420001122', address: 'Corregidora, Qro.', status: 'Inactivo' },
      { id: 'U-105', username: 'mauricio_gv', fullName: 'Mauricio Gabriel', email: 'mauricio@erp.com', phone: '4429990011', address: 'Centro Sur, Qro.', status: 'Activo' }
    ];
  }

  openNew() {
    this.user = { status: 'Activo' }; // Valores por defecto
    this.submitted = false;
    this.editMode = false;
    this.userDialog = true;
  }

  editUser(user: SystemUser) {
    this.user = { ...user };
    this.editMode = true;
    this.userDialog = true;
  }

  deleteUser(user: SystemUser) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar al usuario ' + user.fullName + '?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.users = this.users.filter((val) => val.id !== user.id);
        this.user = {};
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;

    if (this.user.fullName?.trim() && this.user.username?.trim()) {
      if (this.editMode) {
        // Modo Edición
        const index = this.users.findIndex(u => u.id === this.user.id);
        if (index !== -1) {
          this.users[index] = this.user as SystemUser;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado', life: 3000 });
        }
      } else {
        // Modo Creación
        this.user.id = 'U-' + Math.floor(Math.random() * 1000);
        this.users.push(this.user as SystemUser);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado', life: 3000 });
      }

      this.users = [...this.users];
      this.userDialog = false;
      this.user = {};
    }
  }

  getSeverity(status: string) {
    return status === 'Activo' ? 'success' : 'danger';
  }
  
  toggleStatus(user: SystemUser) {
    user.status = user.status === 'Activo' ? 'Inactivo' : 'Activo';
    this.messageService.add({ severity: 'info', summary: 'Actualizado', detail: `Estado cambiado a ${user.status}`, life: 3000 });
  }
}