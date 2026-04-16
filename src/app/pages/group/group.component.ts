import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown'; // Necesitas importar esto
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { GroupService } from '../../services/groups/group.service';
import { UserService } from '../../services/users/user.service';

export type MemberModel = {
  id: string;
  username: string;
};

type GroupModel = {
  id: string;
  name: string;
  category: string;
  level: string;
  author: string;
  members: string;
  tickets: string;
  imageUrl: string;
  memberList: MemberModel[];
};

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    HasPermissionDirective,
    TagModule,
    AvatarModule,
    DropdownModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css',
})
export class GroupComponent implements OnInit {
  groups: GroupModel[] = [];
  allUsers: any[] = [];
  selectedUserId: string | null = null; 
  
  formVisible = false;
  editMode = false;
  draft: GroupModel = this.emptyGroup();
  managementVisible = false;
  selectedGroup: GroupModel | null = null;

  constructor(
    private msg: MessageService,
    private confirm: ConfirmationService,
    private groupService: GroupService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadGroups();
    this.loadAllUsers();
  }

  loadGroups() {
    this.groupService.getGroups().subscribe({
      next: (response) => {
        this.groups = response.data.map((g: any) => ({
          id: g.id,
          name: g.nombre,
          category: g.categoria || 'General',
          level: g.nivel || 'Básico',
          author: g.profesor || 'Sin asignar',
          members: g.miembros_count ? g.miembros_count.toString() : '0',
          tickets: g.tickets_count ? g.tickets_count.toString() : '0',
          imageUrl: g.imagen_url || 'https://picsum.photos/seed/defaultgroup/800/400',
          memberList: []
        }));
      }
    });
  }

  loadAllUsers() {
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.allUsers = res.data.map((u: any) => ({
          label: u.nombre_completo,
          value: u.id
        }));
      }
    });
  }

  openManagement(group: GroupModel) {
    this.selectedGroup = group;
    this.managementVisible = true;
    this.loadCurrentMembers(group.id);
  }

  loadCurrentMembers(groupId: string) {
    this.groupService.getGroupMembers(groupId).subscribe({
      next: (res) => {
        if (this.selectedGroup) {
          this.selectedGroup.memberList = res.data.map((m: any) => ({
            id: m.id,
            username: m.nombre_completo
          }));
          this.selectedGroup.members = this.selectedGroup.memberList.length.toString();
        }
      }
    });
  }

  addMember() {
    if (!this.selectedUserId || !this.selectedGroup) return;

    this.groupService.addMemberToGroup(this.selectedGroup.id, this.selectedUserId).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Éxito', detail: 'Alumno añadido al grupo' });
        this.loadCurrentMembers(this.selectedGroup!.id);
        this.selectedUserId = null;
      },
      error: (err) => {
        this.msg.add({ severity: 'error', summary: 'Error', detail: err.error?.data?.message || 'Error al añadir' });
      }
    });
  }

  removeMember(memberId: string) {
    if (!this.selectedGroup) return;

    this.groupService.removeMemberFromGroup(this.selectedGroup.id, memberId).subscribe({
      next: () => {
        this.msg.add({ severity: 'info', summary: 'Actualizado', detail: 'Alumno removido' });
        this.loadCurrentMembers(this.selectedGroup!.id);
      }
    });
  }

  emptyGroup(): GroupModel {
    return { id: '', name: '', category: '', level: '', author: '', members: '0', tickets: '0', imageUrl: 'https://picsum.photos/seed/defaultgroup/800/400', memberList: [] };
  }

  startCreate() { this.editMode = false; this.draft = this.emptyGroup(); this.formVisible = true; }
  startEdit(g: GroupModel) { this.editMode = true; this.draft = { ...g }; this.formVisible = true; }
  cancel() { this.formVisible = false; this.editMode = false; this.draft = this.emptyGroup(); }

  save() {
    if (!this.draft.name.trim()) return;
    const payload = {
      nombre: this.draft.name,
      categoria: this.draft.category,
      nivel: this.draft.level,
      profesor: this.draft.author,
      imagen_url: this.draft.imageUrl
    };

    const action = this.editMode 
      ? this.groupService.updateGroup(this.draft.id, payload)
      : this.groupService.createGroup(payload);

    action.subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Éxito', detail: 'Grupo guardado' });
        this.loadGroups();
        this.cancel();
      }
    });
  }

  confirmDelete(g: GroupModel) {
    this.confirm.confirm({
      message: `¿Borrar grupo ${g.name}?`,
      accept: () => {
        this.groupService.deleteGroup(g.id).subscribe({
          next: () => { this.loadGroups(); this.msg.add({ severity: 'success', detail: 'Eliminado' }); }
        });
      }
    });
  }
}