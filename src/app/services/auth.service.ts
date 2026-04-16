import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/auth';

  private permisosGlobales = signal<string[]>([]);
  private permisosPorGrupo = signal<any>({});
  private currentGroupId = signal<string>(localStorage.getItem('currentGroupId') || '');

  constructor() {
    this.hydratePermissions();
  }

  private hydratePermissions() {
    const savedGlobal = localStorage.getItem('erp_permisos');
    const savedGroups = localStorage.getItem('erp_permisos_grupos');
    
    if (savedGlobal) this.permisosGlobales.set(JSON.parse(savedGlobal));
    if (savedGroups) this.permisosPorGrupo.set(JSON.parse(savedGroups));
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        if (res.data && res.data.token) {
          localStorage.setItem('erp_token', res.data.token);
          
          const payload = JSON.parse(atob(res.data.token.split('.')[1]));
          
          const globales = payload.permisos || [];
          const grupos = payload.permisosPorGrupo || {};

          this.permisosGlobales.set(globales);
          this.permisosPorGrupo.set(grupos);
          
          localStorage.setItem('erp_permisos', JSON.stringify(globales));
          localStorage.setItem('erp_permisos_grupos', JSON.stringify(grupos));
          localStorage.setItem('userId', payload.userId);
          localStorage.setItem('username', payload.username || '');
        }
      })
    );
  }

  setCurrentGroup(id: string) {
    this.currentGroupId.set(id);
    localStorage.setItem('currentGroupId', id);
  }

  hasPermission(permission: string): boolean {
    const tieneGlobal = this.permisosGlobales().includes(permission);
    if (tieneGlobal) return true;

    const groupId = this.currentGroupId();
    if (groupId && this.permisosPorGrupo()[groupId]) {
      return this.permisosPorGrupo()[groupId].includes(permission);
    }

    return false;
  }

  logout(): void {
    localStorage.clear();
    this.permisosGlobales.set([]);
    this.permisosPorGrupo.set({});
    this.currentGroupId.set('');
  }
}