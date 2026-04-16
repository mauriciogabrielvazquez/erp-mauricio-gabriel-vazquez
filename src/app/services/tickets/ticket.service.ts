import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/tickets';

  getTicketsByGroup(groupId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/group/${groupId}`);
  }

  createTicket(ticketData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ticketData);
  }

  updateTicket(id: string, updates: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, updates);
  }

  deleteTicket(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  
  getGroupMembers(groupId: string) {
    return this.http.get<any>(`http://localhost:3000/groups/${groupId}/members`);
  }

  getTicketsByUser(userId: string) {
    return this.http.get<any>(`http://localhost:3000/tickets/user/${userId}`);
  }
}