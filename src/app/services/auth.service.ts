import { Injectable } from '@angular/core';

export type Permission = 
  | 'read-dashboard'
  | 'read-group' | 'add-group' | 'edit-group' | 'delete-group'
  | 'read-ticket' | 'add-ticket' | 'edit-ticket' | 'delete-ticket'
  | 'read-user' | 'add-user' | 'edit-user' | 'delete-user';

const PROFILES = {
  superAdmin: [
    'read-dashboard',
    'read-group', 'add-group', 'edit-group', 'delete-group',
    'read-ticket', 'add-ticket', 'edit-ticket', 'delete-ticket',
    'read-user', 'add-user', 'edit-user', 'delete-user'
  ] as Permission[],

  lider_proyecto: [
    'read-dashboard',
    'read-group', 'add-group', 'edit-group', 'delete-group',
    'read-ticket', 'add-ticket', 'edit-ticket', 'delete-ticket',
    'read-user'
  ] as Permission[],

  empleado_basico: [
    'read-dashboard',
    'read-group',
    'read-ticket', 'add-ticket', 'edit-ticket'
  ] as Permission[]
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private activeProfile = 'superAdmin'; 
  
  private currentPermissions: Permission[] = PROFILES[this.activeProfile as keyof typeof PROFILES];

  constructor() { }

  hasPermission(permission: Permission): boolean {
    return this.currentPermissions.includes(permission);
  }
}