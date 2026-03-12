import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

type TicketStatus = 'Pendiente' | 'En Progreso' | 'Revisión' | 'Hecho' | 'Bloqueado';

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
  blocked = 0;

  chartData: any;
  chartOptions: any;

  groups = [
    { id: 'G-001', name: 'Mathematics 101', members: '3', tickets: '5' },
    { id: 'G-002', name: 'Physics Lab', members: '1', tickets: '2' },
    { id: 'G-003', name: 'English Club', members: '0', tickets: '9' },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.initMockData();
    this.calculateStats();
    this.initChart();
  }

  initMockData() {
    this.tickets = [
      { id: 'TK-001', title: 'Diseñar UI del sistema', status: 'Hecho', assignee: 'Luis Abraham', date: new Date('2026-03-01') },
      { id: 'TK-002', title: 'Crear diagrama C4', status: 'En Progreso', assignee: 'Josué Arreola', date: new Date('2026-03-05') },
      { id: 'TK-003', title: 'Desarrollo de API REST', status: 'Pendiente', assignee: 'Bruno Lopez', date: new Date('2026-03-10') },
      { id: 'TK-004', title: 'Compra de sensores', status: 'Bloqueado', assignee: 'Santiago Alberto', date: new Date('2026-03-02') },
      { id: 'TK-005', title: 'Actualizar base de datos', status: 'Hecho', assignee: 'Mauricio Gabriel', date: new Date('2026-03-08') },
      { id: 'TK-006', title: 'Despliegue en servidor', status: 'Pendiente', assignee: 'Luis Abraham', date: new Date('2026-03-11') },
      { id: 'TK-007', title: 'Revisión de accesibilidad', status: 'En Progreso', assignee: 'Luis Abraham', date: new Date('2026-03-09') },
    ];

    this.recentTickets = [...this.tickets]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }

  calculateStats() {
    this.totalTickets = this.tickets.length;
    this.pending = this.tickets.filter(t => t.status === 'Pendiente').length;
    this.inProgress = this.tickets.filter(t => t.status === 'En Progreso').length;
    this.done = this.tickets.filter(t => t.status === 'Hecho').length;
    this.blocked = this.tickets.filter(t => t.status === 'Bloqueado').length;
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';

    this.chartData = {
      labels: ['Pendiente', 'En Progreso', 'Hecho', 'Bloqueado'],
      datasets: [
        {
          data: [this.pending, this.inProgress, this.done, this.blocked],
          backgroundColor: [
            documentStyle.getPropertyValue('--orange-500') || '#f97316', 
            documentStyle.getPropertyValue('--blue-500') || '#3b82f6',   
            documentStyle.getPropertyValue('--green-500') || '#22c55e',  
            documentStyle.getPropertyValue('--red-500') || '#ef4444'     
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--orange-400') || '#fb923c',
            documentStyle.getPropertyValue('--blue-400') || '#60a5fa',
            documentStyle.getPropertyValue('--green-400') || '#4ade80',
            documentStyle.getPropertyValue('--red-400') || '#f87171'
          ]
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: { labels: { usePointStyle: true, color: textColor } }
      }
    };
  }

  getSeverity(status: TicketStatus) {
    switch (status) {
      case 'Hecho': return 'success';
      case 'En Progreso': return 'info';
      case 'Pendiente': return 'warning';
      case 'Bloqueado': return 'danger';
      default: return 'info';
    }
  }
  
  goToTickets(groupId: string) {
    this.router.navigate(['/home/groups-tickets']);
  }
}