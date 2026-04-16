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
import { UserService } from '../../services/users/user.service'; 
import { TicketService } from '../../services/tickets/ticket.service';

type UserModel = {
  username: string;
  email: string;
  fullName: string;
  address: string;
  phone: string;
};

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
  currentUserId = localStorage.getItem('userId') || ''; 

  user: UserModel = {
    username: 'Cargando...',
    email: '',
    fullName: 'Cargando...',
    address: '',
    phone: ''
  };

  // Vaciamos los tickets estáticos (falsos) para reflejar la realidad
  assignedTickets: UserTicket[] = [];
  stats = { total: 0, pending: 0, inProgress: 0, done: 0 };

  form;

  constructor(
    private fb: FormBuilder, 
    private msg: MessageService,
    private userService: UserService,
    private ticketService: TicketService
  ) {
    this.form = this.fb.group({
      username: [''],
      email: [''],
      fullName: [''],
      address: [''],
      phone: ['']
    });
  }

  ngOnInit() {
    this.loadRealUserData();
    this.calculateStats();
    this.loadUserTickets();
  }

  loadRealUserData() {
    if (!this.currentUserId) return;

    this.userService.getUsers().subscribe({
      next: (res: any) => {
        // Buscamos al usuario en la lista devuelta por el servidor
        const usuarioReal = res.data.find((u: any) => u.id === this.currentUserId);

        if (usuarioReal) {
          this.user = {
            username: usuarioReal.username,
            email: usuarioReal.email,
            fullName: usuarioReal.nombre_completo,
            address: usuarioReal.direccion || 'Sin especificar',
            phone: usuarioReal.telefono || 'Sin especificar'
          };
          this.loadToForm();
        }
      },
      error: (err) => {
        console.error('Error al cargar el perfil:', err);
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la información del perfil.' });
      }
    });
  }

  loadUserTickets() {
    if (!this.currentUserId) return;

    this.ticketService.getTicketsByUser(this.currentUserId).subscribe({
      next: (res) => {
        this.assignedTickets = res.data.map((t: any) => ({
          id: t.id.substring(0, 8).toUpperCase(),
          title: t.titulo,
          status: t.estado,
          priority: t.prioridad
        }));
        
        this.calculateStats();
      },
      error: (err) => console.error('Error cargando los tickets del usuario', err)
    });
  }

  calculateStats() {
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

  // ⚡ ACTUALIZADO: Ahora guarda los datos en tu base de datos
  save() {
    if (this.form.invalid) return;

    // Preparamos los datos con los nombres de columnas de tu base de datos
    const updatedData = {
      nombre_completo: this.form.value.fullName,
      username: this.form.value.username,
      email: this.form.value.email,
      direccion: this.form.value.address,
      telefono: this.form.value.phone
    };

    this.userService.updateUser(this.currentUserId, updatedData).subscribe({
      next: () => {
        this.user = {
          username: updatedData.username ?? '',
          email: updatedData.email ?? '',
          fullName: updatedData.nombre_completo ?? '',
          address: updatedData.direccion ?? '',
          phone: updatedData.telefono ?? ''
        };
        this.editMode = false;
        
        localStorage.setItem('username', this.user.username);
        
        this.msg.add({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado correctamente en el sistema.' });
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron guardar los cambios.' });
      }
    });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Hecho': return 'success';
      case 'En Progreso': return 'info';
      case 'Pendiente': return 'warning';
      default: return 'info';
    }
  }
}