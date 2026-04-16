import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://apigateway-hjup.onrender.com/users';

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  
  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${userId}`, userData);
  }

  getUserPermissions(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}/permissions`);
  }

  updateUserPermissions(userId: string, permissions: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${userId}/permissions`, { permisos: permissions });
  }
}