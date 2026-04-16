import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private http = inject(HttpClient);
  private apiUrl = 'https://apigateway-hjup.onrender.com/groups'; 

  getGroups(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  createGroup(groupData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, groupData);
  }

  updateGroup(id: string, groupData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, groupData);
  }

  deleteGroup(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getGroupMembers(groupId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${groupId}/members`);
  }

  addMemberToGroup(groupId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${groupId}/members`, { usuario_id: userId });
  }

  removeMemberFromGroup(groupId: string, userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${groupId}/members/${userId}`);
  }
}