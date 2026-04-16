import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DragDropModule } from 'primeng/dragdrop';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextarea } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { TicketService } from '../../services/tickets/ticket.service';
import { AuthService } from '../../services/auth.service';

type TicketStatus = 'Pendiente' | 'En Progreso' | 'Revisión' | 'Hecho';
type Priority = 'Urgente' | 'Alta' | 'Media' | 'Baja';

interface CommentItem { user: string; text: string; date: string; }
interface HistoryItem { action: string; date: string; }

interface Ticket {
  id: string; title: string; description: string;
  status: TicketStatus; creator: string; assignee: string;
  assigneeId: string | null;
  priority: Priority; creationDate: string; dueDate: string;
  comments: CommentItem[]; history: HistoryItem[];
}

@Component({
  selector: 'app-ticket-board',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CardModule, DragDropModule, TagModule,
    DialogModule, ButtonModule, InputTextModule, DropdownModule,
    InputTextarea, TooltipModule, TableModule, SelectButtonModule,
    ToastModule, HasPermissionDirective
  ],
  providers: [MessageService],
  templateUrl: './ticket-board.component.html',
  styleUrl: './ticket-board.component.css'
})
export class TicketBoardComponent implements OnInit, OnDestroy {
  currentUser = localStorage.getItem('username') || 'Usuario';
  currentUserId = localStorage.getItem('userId') || '';
  currentGroupId: string = '';

  private routeSub?: Subscription;

  viewOptions: any[] = [
    { icon: 'pi pi-table', value: 'kanban', justify: 'Center' },
    { icon: 'pi pi-list', value: 'table', justify: 'Center' }
  ];
  currentView: string = 'kanban';

  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  activeFilter: string = 'todos';

  statuses: TicketStatus[] = ['Pendiente', 'En Progreso', 'Revisión', 'Hecho'];
  priorityOptions = ['Urgente', 'Alta', 'Media', 'Baja'];
  statusOptions = ['Pendiente', 'En Progreso', 'Revisión', 'Hecho'];

  draggedTicket: Ticket | null = null;
  displayModal = false;
  selectedTicket: Ticket | null = null;
  originalTicketCopy: Ticket | null = null;
  newCommentText = '';
  displayCreateModal = false;
  draftTicket: Partial<Ticket> = {};
  memberOptions: any[] = [];

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.currentGroupId = params.get('id') || '';
      if (this.currentGroupId) {
        this.authService.setCurrentGroup(this.currentGroupId);
        this.loadGroupMembers();
        this.loadTickets();
      }
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  loadGroupMembers() {
    this.ticketService.getGroupMembers(this.currentGroupId).subscribe({
      next: (res) => {
        this.memberOptions = res.data.map((m: any) => ({
          label: m.nombre_completo,
          value: m.id
        }));
        this.memberOptions.unshift({ label: 'Sin asignar', value: null });
      },
      error: (err) => console.error('Error cargando miembros:', err)
    });
  }

  loadTickets() {
    this.ticketService.getTicketsByGroup(this.currentGroupId).subscribe({
      next: (res) => {
        this.tickets = res.data.map((t: any) => ({
          id: t.id,
          title: t.titulo,
          description: t.descripcion || '',
          status: t.estado as TicketStatus,
          creator: t.autor?.nombre_completo || 'Desconocido',
          assignee: t.asignado?.nombre_completo || '',
          assigneeId: t.asignado?.id || null,
          priority: t.prioridad as Priority,
          creationDate: new Date(t.creado_en).toISOString().split('T')[0],
          dueDate: t.fecha_final ? new Date(t.fecha_final).toISOString().split('T')[0] : '',
          comments: Array.isArray(t.comentarios) ? t.comentarios : [],
          history: Array.isArray(t.historial) ? t.historial : []
        }));
        this.applyFilter(this.activeFilter);
      },
      error: (err) => console.error('Error cargando tickets:', err)
    });
  }

  applyFilter(filterType: string) {
    this.activeFilter = filterType;
    switch(filterType) {
      case 'mis_tickets':
        this.filteredTickets = this.tickets.filter(t => t.assigneeId === this.currentUserId);
        break;
      case 'sin_asignar':
        this.filteredTickets = this.tickets.filter(t => !t.assigneeId);
        break;
      case 'prioridad_alta':
        this.filteredTickets = this.tickets.filter(t => t.priority === 'Alta' || t.priority === 'Urgente');
        break;
      default:
        this.filteredTickets = [...this.tickets];
        break;
    }
  }

  getTicketsByStatus(status: TicketStatus): Ticket[] {
    return this.filteredTickets.filter(t => t.status === status);
  }

  dragStart(ticket: Ticket) { this.draggedTicket = ticket; }

  drop(newStatus: TicketStatus) {
    /*if (!this.draggedTicket || this.draggedTicket.status === newStatus) {
      this.draggedTicket = null;
      return;
    }*/

    if (!this.draggedTicket || this.draggedTicket.status === newStatus) return;

    // 🔥 REGLA DE NEGOCIO: Bloqueo de arrastre si no eres el asignado
    if (this.draggedTicket.assigneeId !== this.currentUserId) {
       // ... código del toast de error ...
       return; 
    }

    if (this.draggedTicket.assigneeId !== this.currentUserId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Acceso Denegado',
        detail: 'Solo el usuario asignado puede mover este ticket.',
        life: 4000
      });
      this.draggedTicket = null;
      return;
    }

    const historyItem = { action: `Movió a "${newStatus}"`, date: new Date().toLocaleString() };
    const newHistory = [historyItem, ...this.draggedTicket.history];
    const payload = { estado: newStatus, historial: newHistory };

    this.ticketService.updateTicket(this.draggedTicket.id, payload).subscribe({
      next: () => {
        this.loadTickets();
        this.draggedTicket = null;
      },
      error: (err) => {
        console.error('Error actualizando estado', err);
        this.draggedTicket = null;
        if (err.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error de Permisos',
            detail: 'No tienes autorización para realizar este cambio.'
          });
        }
      }
    });
  }

  dragEnd() { this.draggedTicket = null; }

  openCreate() {
    this.draftTicket = { title: '', description: '', status: 'Pendiente', assigneeId: null, priority: 'Media' };
    this.displayCreateModal = true;
  }

  assignToMe() {
    if (this.displayCreateModal) {
      this.draftTicket.assigneeId = this.currentUserId;
    }
    if (this.displayModal && this.selectedTicket) {
      this.selectedTicket.assigneeId = this.currentUserId;
    }
  }

  createTicket() {
    if (!this.draftTicket.title?.trim()) return;

    const payload = {
      titulo: this.draftTicket.title,
      descripcion: this.draftTicket.description,
      estado: this.draftTicket.status,
      prioridad: this.draftTicket.priority,
      grupo_id: this.currentGroupId,
      asignado_id: this.draftTicket.assigneeId ?? null,
      historial: [{ action: 'Ticket creado', date: new Date().toLocaleString() }]
    };

    this.ticketService.createTicket(payload).subscribe({
      next: () => {
        this.displayCreateModal = false;
        this.loadTickets();
      },
      error: (err) => console.error('Error creando ticket', err)
    });
  }

  openDetail(ticket: Ticket) {
    this.selectedTicket = JSON.parse(JSON.stringify(ticket));
    this.originalTicketCopy = JSON.parse(JSON.stringify(ticket));
    this.newCommentText = '';
    this.displayModal = true;
  }

  addComment() {
    if (this.newCommentText.trim() && this.selectedTicket) {
      this.selectedTicket.comments.unshift({
        user: this.currentUser,
        text: this.newCommentText.trim(),
        date: new Date().toLocaleString()
      });
      this.newCommentText = '';
    }
  }

  saveTicket() {
    if (this.selectedTicket && this.originalTicketCopy) {
      const payload = {
        titulo: this.selectedTicket.title,
        descripcion: this.selectedTicket.description,
        estado: this.selectedTicket.status,
        prioridad: this.selectedTicket.priority,
        fecha_final: this.selectedTicket.dueDate || null,
        comentarios: this.selectedTicket.comments,
        asignado_id: this.selectedTicket.assigneeId ?? null
      };

      this.ticketService.updateTicket(this.selectedTicket.id, payload).subscribe({
        next: () => {
          this.displayModal = false;
          this.loadTickets();
        },
        error: (err) => {
          console.error('Error guardando cambios', err);
          if (err.status === 403) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No tienes permisos para modificar el estado de este ticket.'
            });
          }
        }
      });
    }
  }

  getPrioritySeverity(priority: Priority) {
    switch(priority) {
      case 'Urgente': return 'danger';
      case 'Alta': return 'warning';
      case 'Media': return 'info';
      case 'Baja': return 'success';
      default: return 'info';
    }
  }

  getStatusSeverity(status: TicketStatus) {
    switch(status) {
      case 'Hecho': return 'success';
      case 'En Progreso': return 'info';
      case 'Pendiente': return 'warning';
      case 'Revisión': return 'secondary';
      default: return 'info';
    }
  }
}