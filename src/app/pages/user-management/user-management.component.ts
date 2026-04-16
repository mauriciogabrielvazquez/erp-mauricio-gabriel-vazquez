import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs'; 
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown'; 
import { MessageService, ConfirmationService } from 'primeng/api';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { UserService } from '../../services/users/user.service'; 

interface SystemUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  status: 'Activo' | 'Inactivo';
  permissions: string[];
}

interface PermissionModule {
  name: string;
  actions: { label: string; value: string }[]; 
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ToolbarModule,
    TagModule,
    CheckboxModule,
    TabViewModule,
    DropdownModule, // <-- Agregado a los imports
    HasPermissionDirective
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: SystemUser[] = [];
  
  userDialog = false;
  user: Partial<SystemUser> = { permissions: [] };
  selectedUsers: SystemUser[] | null = null;
  submitted = false;
  editMode = false;

  // ⚡ Variables nuevas para la gestión por grupos
  availableGroups: any[] = [];
  selectedGroupId: string | null = null;
  groupSpecificPermissions: string[] = [];

  permissionModules: PermissionModule[] = [
    {
      name: 'Dashboard',
      actions: [
        { label: 'Ver', value: 'read-dashboard' }
      ]
    },
    {
      name: 'Grupos',
      actions: [
        { label: 'Ver', value: 'read-group' },
        { label: 'Crear', value: 'add-group' },
        { label: 'Editar', value: 'edit-group' },
        { label: 'Eliminar', value: 'delete-group' }
      ]
    },
    {
      name: 'Tickets',
      actions: [
        { label: 'Ver', value: 'read-ticket' },
        { label: 'Crear', value: 'add-ticket' },
        { label: 'Editar', value: 'edit-ticket' },
        { label: 'Eliminar', value: 'delete-ticket' }
      ]
    },
    {
      name: 'Usuarios',
      actions: [
        { label: 'Ver', value: 'read-user' },
        { label: 'Crear', value: 'add-user' },
        { label: 'Editar', value: 'edit-user' },
        { label: 'Eliminar', value: 'delete-user' }
      ]
    }
  ];

  constructor(
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private http: HttpClient // <-- Inyectado para llamar a las rutas de grupos
  ) {}

  ngOnInit() {
    this.cargarUsuariosReales();
    this.loadAvailableGroups(); // <-- Cargamos los grupos al iniciar la pantalla
  }

  cargarUsuariosReales() {
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response.data.map((u: any) => ({
          id: u.id,
          username: u.username,
          fullName: u.nombre_completo,
          email: u.email,
          phone: u.telefono || 'N/A',
          address: u.direccion || 'N/A',
          status: 'Activo', 
          permissions: [] 
        }));
      },
      error: (err: any) => {
        console.error('Error al traer usuarios:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios de la base de datos' });
      }
    });
  }

  // ⚡ Método nuevo para obtener la lista de grupos
  loadAvailableGroups() {
    this.http.get<any>('http://localhost:3000/groups').subscribe({
      next: (res) => this.availableGroups = res.data,
      error: (err) => console.error('Error al cargar la lista de grupos:', err)
    });
  }

  openNew() {
    this.user = { status: 'Activo', permissions: [] };
    this.submitted = false;
    this.editMode = false;
    this.selectedGroupId = null; // Reiniciamos el selector
    this.groupSpecificPermissions = []; // Limpiamos las casillas
    this.userDialog = true;
  }

  editUser(user: SystemUser) {
    this.user = { ...user, permissions: [] };
    this.editMode = true;
    this.selectedGroupId = null; // Reiniciamos el selector para que elija uno
    this.groupSpecificPermissions = []; // Limpiamos las casillas
    
    this.userService.getUserPermissions(user.id).subscribe({
      next: (res: any) => {
        this.user.permissions = res.data || []; 
        this.userDialog = true; 
      },
      error: (err: any) => {
        console.error('Error al cargar permisos:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los permisos del usuario' });
        this.userDialog = true; 
      }
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;

    if (this.user.fullName?.trim() && this.user.username?.trim()) {
      if (this.editMode && this.user.id) {
        
        const updateData = {
          nombre_completo: this.user.fullName,
          username: this.user.username,
          email: this.user.email
        };

        const updateRequest = this.userService.updateUser(this.user.id, updateData);
        const permissionsRequest = this.userService.updateUserPermissions(this.user.id, this.user.permissions || []);

        forkJoin([updateRequest, permissionsRequest]).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Información general y permisos globales actualizados', life: 3000 });
            this.cargarUsuariosReales(); 
            this.userDialog = false;
          },
          error: (err) => {
            console.error('Error actualizando usuario o permisos:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al guardar los cambios' });
          }
        });

      } else {
        this.messageService.add({ severity: 'info', summary: 'Aviso', detail: 'Por ahora, los usuarios nuevos deben registrarse desde la pantalla de Login', life: 4000 });
        this.userDialog = false;
      }
    }
  }

  // ⚡ Método actualizado: Se dispara al elegir un grupo en el Dropdown
  loadGroupPermissionsForUser() {
    this.groupSpecificPermissions = []; 
    if (!this.selectedGroupId || !this.user.id) return;

    // Vamos al backend a preguntar qué permisos tiene ya guardados
    this.http.get<any>(`http://localhost:3000/groups/${this.selectedGroupId}/permissions/${this.user.id}`)
      .subscribe({
        next: (res) => {
          // Marcamos las casillas automáticamente con los datos reales
          this.groupSpecificPermissions = res.data || [];
          this.messageService.add({ severity: 'info', summary: 'Grupo Cargado', detail: 'Modifica los permisos y presiona Guardar', life: 2000 });
        },
        error: (err) => console.error('Error al cargar permisos del grupo', err)
      });
  }

  // ⚡ Método actualizado: Guarda los permisos mandando todo el arreglo de un golpe
  saveGroupPermissions() {
    if (!this.selectedGroupId || !this.user.id) return;

    const payload = {
      usuario_id: this.user.id,
      permisos: this.groupSpecificPermissions // Mandamos el arreglo completo
    };

    this.http.post(`http://localhost:3000/groups/${this.selectedGroupId}/permissions`, payload)
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Grupo Actualizado', detail: 'Los permisos fueron guardados correctamente.', life: 4000 });
        },
        error: (err) => {
          console.error('Error asignando permisos de grupo', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al asignar los permisos' });
        }
      });
  }

  deleteUser(user: SystemUser) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar al usuario ' + user.fullName + '?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Aviso', detail: 'Endpoint de eliminación pendiente de implementar', life: 3000 });
      }
    });
  }

  getSeverity(status: string) {
    return status === 'Activo' ? 'success' : 'danger';
  }
  
  toggleStatus(user: SystemUser) {
    user.status = user.status === 'Activo' ? 'Inactivo' : 'Activo';
    this.messageService.add({ severity: 'info', summary: 'Actualizado', detail: `Estado cambiado a ${user.status}`, life: 3000 });
  }
}