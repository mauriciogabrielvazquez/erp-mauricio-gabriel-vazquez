import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs'; 

import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

import { GroupService } from '../../services/groups/group.service';
import { TicketService } from '../../services/tickets/ticket.service';

type TicketStatus = 'Pendiente' | 'En Progreso' | 'Revisión' | 'Hecho' | 'To-Do';

interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  assignee: string;
  date: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    TableModule,
    TagModule,
    ButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  tickets: Ticket[] = [];
  recentTickets: Ticket[] = [];
  
  totalTickets = 0;
  pending = 0;
  inProgress = 0;
  done = 0;
  review = 0; // Cambiado de blocked a review

  chartData: any;
  chartOptions: any;

  groups: any[] = []; 

  constructor(
    private router: Router,
    private groupService: GroupService,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.groupService.getGroups().subscribe({
      next: (resGroups) => {
        this.groups = resGroups.data.map((g: any) => ({
          id: g.id,
          name: g.nombre,
          members: 'Varios',
          tickets: 0 
        }));

        if (this.groups.length === 0) return;

        const ticketRequests = this.groups.map(g => this.ticketService.getTicketsByGroup(g.id));

        forkJoin(ticketRequests).subscribe({
          next: (responses: any[]) => {
            let allTickets: Ticket[] = [];

            responses.forEach((res, index) => {
              const ticketsDelGrupo = res.data;
              this.groups[index].tickets = ticketsDelGrupo.length;

              const mappedTickets = ticketsDelGrupo.map((t: any) => ({
                id: t.id.substring(0, 8),
                title: t.titulo,
                status: t.estado as TicketStatus,
                assignee: t.asignado?.nombre_completo || 'Sin asignar',
                date: new Date(t.creado_en)
              }));

              allTickets = [...allTickets, ...mappedTickets];
            });

            this.tickets = allTickets;
            this.processTicketsData();
          }
        });
      }
    });
  }

  processTicketsData() {
    this.recentTickets = [...this.tickets]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);

    this.totalTickets = this.tickets.length;
    this.pending = this.tickets.filter(t => t.status === 'Pendiente' || t.status === 'To-Do').length;
    this.inProgress = this.tickets.filter(t => t.status === 'En Progreso').length;
    this.done = this.tickets.filter(t => t.status === 'Hecho').length;
    this.review = this.tickets.filter(t => t.status === 'Revisión').length; // Conteo corregido

    this.initChart();
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    
    this.chartData = {
      labels: ['Pendiente', 'En Progreso', 'Hecho', 'En Revisión'],
      datasets: [
        {
          data: [this.pending, this.inProgress, this.done, this.review],
          backgroundColor: [
            '#f97316', // Orange
            '#3b82f6', // Blue
            '#22c55e', // Green
            '#94a3b8'  // Slate/Secondary para Revisión
          ]
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: { labels: { usePointStyle: true } }
      }
    };
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Hecho': return 'success';
      case 'En Progreso': return 'info';
      case 'Pendiente': case 'To-Do': return 'warning';
      case 'Revisión': return 'secondary'; // Severidad corregida
      default: return 'info';
    }
  }
  
  goToTickets(groupId: string) {
    this.router.navigate(['/home/groups-tickets', groupId]);
  }
}