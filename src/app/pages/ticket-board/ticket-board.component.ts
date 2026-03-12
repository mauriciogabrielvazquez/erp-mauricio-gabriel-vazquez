import { Component, OnInit } from '@angular/core';
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
import { TableModule } from 'primeng/table';         // <-- Para la vista de tabla
import { SelectButtonModule } from 'primeng/selectbutton'; // <-- Para el toggle

type TicketStatus = 'Pendiente' | 'En Progreso' | 'Revisión' | 'Hecho';
type Priority = 'Urgente' | 'Alta' | 'Media' | 'Baja';

interface CommentItem { user: string; text: string; date: string; }
interface HistoryItem { action: string; date: string; }

interface Ticket {
  id: string; title: string; description: string;
  status: TicketStatus; creator: string; assignee: string;
  priority: Priority; creationDate: string; dueDate: string;
  comments: CommentItem[]; history: HistoryItem[];
}

@Component({
  selector: 'app-ticket-board',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CardModule, DragDropModule, TagModule,
    DialogModule, ButtonModule, InputTextModule, DropdownModule,
    InputTextarea, TooltipModule, TableModule, SelectButtonModule
  ],
  templateUrl: './ticket-board.component.html',
  styleUrl: './ticket-board.component.css'
})
export class TicketBoardComponent implements OnInit {
  currentUser = 'Luis Abraham';

  // --- Toggle de Vistas ---
  viewOptions: any[] = [
    { icon: 'pi pi-objects-column', value: 'kanban', justify: 'Center' },
    { icon: 'pi pi-list', value: 'table', justify: 'Center' }
  ];
  currentView: string = 'kanban';

  // --- Datos y Filtros ---
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = []; // La lista que realmente se dibuja en pantalla
  activeFilter: string = 'todos';

  statuses: TicketStatus[] = ['Pendiente', 'En Progreso', 'Revisión', 'Hecho'];
  priorityOptions = ['Urgente', 'Alta', 'Media', 'Baja'];
  statusOptions = ['Pendiente', 'En Progreso', 'Revisión', 'Hecho'];

  // --- Variables Drag&Drop y Modales ---
  draggedTicket: Ticket | null = null;
  displayModal = false;
  selectedTicket: Ticket | null = null;
  originalTicketCopy: Ticket | null = null;
  newCommentText = '';
  displayCreateModal = false;
  draftTicket: Partial<Ticket> = {};

  ngOnInit() {
    this.tickets = [
      { id: 'T-1', title: 'Diseñar UI del respirador', description: 'Crear vistas', status: 'En Progreso', creator: 'Luis Abraham', assignee: 'Josué Arreola', priority: 'Alta', creationDate: '2026-03-01', dueDate: '2026-03-15', comments: [], history: [] },
      { id: 'T-2', title: 'Script de base de datos', description: 'Estructurar tablas', status: 'Revisión', creator: 'Prof. Rivera', assignee: 'Luis Abraham', priority: 'Media', creationDate: '2026-03-05', dueDate: '2026-03-18', comments: [], history: [] },
      { id: 'T-3', title: 'Diagrama C4 en Structurizr', description: 'Actualizar', status: 'Pendiente', creator: 'Santiago Alberto', assignee: 'Bruno Lopez', priority: 'Urgente', creationDate: '2026-03-08', dueDate: '2026-03-20', comments: [], history: [] },
      { id: 'T-4', title: 'Documentar requerimientos', description: 'Hacer el PDF', status: 'Pendiente', creator: 'Luis Abraham', assignee: '', priority: 'Baja', creationDate: '2026-03-12', dueDate: '2026-03-25', comments: [], history: [] } // Ticket sin asignar para probar el filtro
    ];
    this.applyFilter('todos'); // Inicializar la lista filtrada
  }

  // --- LÓGICA DE FILTROS RÁPIDOS ---
  applyFilter(filterType: string) {
    this.activeFilter = filterType;
    
    switch(filterType) {
      case 'mis_tickets':
        this.filteredTickets = this.tickets.filter(t => t.assignee === this.currentUser);
        break;
      case 'sin_asignar':
        this.filteredTickets = this.tickets.filter(t => !t.assignee || t.assignee.trim() === '');
        break;
      case 'prioridad_alta':
        this.filteredTickets = this.tickets.filter(t => t.priority === 'Alta' || t.priority === 'Urgente');
        break;
      default:
        this.filteredTickets = [...this.tickets];
        break;
    }
  }

  // Ahora el Kanban lee de la lista filtrada, no de la original
  getTicketsByStatus(status: TicketStatus): Ticket[] {
    return this.filteredTickets.filter(t => t.status === status);
  }

  // --- Drag & Drop ---
  dragStart(ticket: Ticket) { this.draggedTicket = ticket; }

  drop(newStatus: TicketStatus) {
    if (this.draggedTicket && this.draggedTicket.status !== newStatus) {
      this.draggedTicket.history.unshift({ action: `Movió a "${newStatus}"`, date: new Date().toLocaleString() });
      this.draggedTicket.status = newStatus;
      this.draggedTicket = null;
      this.applyFilter(this.activeFilter); // Refrescar filtros por si acaso
    }
  }

  dragEnd() { this.draggedTicket = null; }

  // --- Modales (Crear, Editar, Comentar) ---
  openCreate() {
    this.draftTicket = { title: '', description: '', status: 'Pendiente', assignee: '', priority: 'Media' };
    this.displayCreateModal = true;
  }

  assignToMe() { this.draftTicket.assignee = this.currentUser; }

  createTicket() {
    if (!this.draftTicket.title?.trim()) return;
    const newId = 'T-' + (this.tickets.length + 1);
    const today = new Date().toISOString().split('T')[0];

    const newTicket: Ticket = {
      id: newId, title: this.draftTicket.title, description: this.draftTicket.description || '',
      status: this.draftTicket.status as TicketStatus, creator: this.currentUser, assignee: this.draftTicket.assignee || '',
      priority: this.draftTicket.priority as Priority, creationDate: today, dueDate: '',
      comments: [], history: [{ action: 'Ticket creado', date: new Date().toLocaleString() }]
    };

    this.tickets.push(newTicket);
    this.applyFilter(this.activeFilter); // Actualizar vista
    this.displayCreateModal = false;
  }

  openDetail(ticket: Ticket) {
    this.selectedTicket = JSON.parse(JSON.stringify(ticket)); 
    this.originalTicketCopy = JSON.parse(JSON.stringify(ticket));
    this.newCommentText = '';
    this.displayModal = true;
  }

  addComment() {
    if (this.newCommentText.trim() && this.selectedTicket) {
      this.selectedTicket.comments.unshift({ user: this.currentUser, text: this.newCommentText.trim(), date: new Date().toLocaleString() });
      this.newCommentText = '';
    }
  }

  saveTicket() {
    if (this.selectedTicket && this.originalTicketCopy) {
      const index = this.tickets.findIndex(t => t.id === this.selectedTicket!.id);
      if (index !== -1) {
        this.tickets[index] = { ...this.selectedTicket };
      }
      this.applyFilter(this.activeFilter); // Refrescar listas
      this.displayModal = false;
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