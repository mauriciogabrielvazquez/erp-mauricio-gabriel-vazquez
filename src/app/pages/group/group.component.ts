import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tag, TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { AvatarModule } from 'primeng/avatar';

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
    AvatarModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css',
})
export class GroupComponent {
  groups: GroupModel[] = [
    {
      id: 'G-001',
      name: 'Mathematics 101',
      category: 'Academic',
      level: 'Beginner',
      author: 'Prof. Rivera',
      members: '3',
      tickets: '5',
      imageUrl: 'https://picsum.photos/seed/group1/800/400',
      memberList: [
        { id: 'u1', username: 'Josué Arreola Salinas' },
        { id: 'u2', username: 'Bruno Lopez de la Cruz' },
        { id: 'u3', username: 'Santiago Alberto' }
      ]
    },
    {
      id: 'G-002',
      name: 'Physics Lab',
      category: 'Science',
      level: 'Intermediate',
      author: 'Dr. López',
      members: '1',
      tickets: '2',
      imageUrl: 'https://picsum.photos/seed/group2/800/400',
      memberList: [
        { id: 'u4', username: 'Mauricio Gabriel Vazquez' }
      ]
    },
    {
      id: 'G-003',
      name: 'English Club',
      category: 'Language',
      level: 'All levels',
      author: 'Ms. Parker',
      members: '0',
      tickets: '9',
      imageUrl: 'https://picsum.photos/seed/group3/800/400',
      memberList: []
    },
  ];

  formVisible = false;
  editMode = false;
  draft: GroupModel = this.emptyGroup();

  managementVisible = false;
  selectedGroup: GroupModel | null = null;
  newUserInput = '';

  constructor(
    private msg: MessageService,
    private confirm: ConfirmationService
  ) {}

  emptyGroup(): GroupModel {
    return { id: '', name: '', category: '', level: '', author: '', members: '0', tickets: '0', imageUrl: 'https://picsum.photos/seed/defaultgroup/800/400', memberList: [] };
  }

  startCreate() { this.editMode = false; this.draft = this.emptyGroup(); this.formVisible = true; }
  startEdit(g: GroupModel) { this.editMode = true; this.draft = { ...g }; this.formVisible = true; }
  cancel() { this.formVisible = false; this.editMode = false; this.draft = this.emptyGroup(); }

  save() {
    if (!this.draft.id.trim() || !this.draft.name.trim()) return;
    if (this.editMode) {
      const idx = this.groups.findIndex(x => x.id === this.draft.id);
      if (idx >= 0) {
        this.draft.memberList = this.groups[idx].memberList;
        this.groups[idx] = { ...this.draft };
      }
    } else {
      this.groups = [{ ...this.draft }, ...this.groups];
    }
    this.cancel();
  }

  confirmDelete(g: GroupModel) {
    this.groups = this.groups.filter(x => x.id !== g.id);
  }

  openManagement(group: GroupModel) { this.selectedGroup = group; this.managementVisible = true; }
  
  addMember() {
    if (!this.newUserInput) return; 
    const newMember: MemberModel = { id: 'usr-' + new Date().getTime(), username: this.newUserInput };
    if (this.selectedGroup) {
      this.selectedGroup.memberList.push(newMember);
      this.selectedGroup.members = this.selectedGroup.memberList.length.toString();
    }
    this.newUserInput = ''; 
  }

  removeMember(memberId: string) {
    if (this.selectedGroup) {
      this.selectedGroup.memberList = this.selectedGroup.memberList.filter(m => m.id !== memberId);
      this.selectedGroup.members = this.selectedGroup.memberList.length.toString();
    }
  }
}