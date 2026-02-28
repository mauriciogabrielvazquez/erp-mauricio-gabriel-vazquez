import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

type GroupModel = {
  id: string;
  name: string;
  category: string;
  level: string;
  author: string;
  members: string;
  tickets: string;
  imageUrl: string;
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
      members: '32',
      tickets: '5',
      imageUrl: 'https://picsum.photos/seed/group1/800/400',
    },
    {
      id: 'G-002',
      name: 'Physics Lab',
      category: 'Science',
      level: 'Intermediate',
      author: 'Dr. López',
      members: '18',
      tickets: '2',
      imageUrl: 'https://picsum.photos/seed/group2/800/400',
    },
    {
      id: 'G-003',
      name: 'English Club',
      category: 'Language',
      level: 'All levels',
      author: 'Ms. Parker',
      members: '45',
      tickets: '9',
      imageUrl: 'https://picsum.photos/seed/group3/800/400',
    },
  ];

  formVisible = false;
  editMode = false;

  draft: GroupModel = this.emptyGroup();

  constructor(
    private msg: MessageService,
    private confirm: ConfirmationService
  ) {}

  emptyGroup(): GroupModel {
    return {
      id: '',
      name: '',
      category: '',
      level: '',
      author: '',
      members: '',
      tickets: '',
      imageUrl: 'https://picsum.photos/seed/defaultgroup/800/400',
    };
  }

  startCreate() {
    this.editMode = false;
    this.draft = this.emptyGroup();
    this.formVisible = true;
  }

  startEdit(g: GroupModel) {
    this.editMode = true;
    this.draft = { ...g };
    this.formVisible = true;
  }

  cancel() {
    this.formVisible = false;
    this.editMode = false;
    this.draft = this.emptyGroup();
  }

  save() {
    if (!this.draft.id.trim() || !this.draft.name.trim()) {
      this.msg.add({
        severity: 'warn',
        summary: 'Missing data',
        detail: 'Id and Name are required.',
      });
      return;
    }

    if (this.editMode) {
      const idx = this.groups.findIndex(x => x.id === this.draft.id);
      if (idx >= 0) this.groups[idx] = { ...this.draft };

      this.msg.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Group updated.',
      });
    } else {
      const exists = this.groups.some(x => x.id === this.draft.id);
      if (exists) {
        this.msg.add({
          severity: 'error',
          summary: 'Error',
          detail: 'That Id already exists.',
        });
        return;
      }

      this.groups = [{ ...this.draft }, ...this.groups];

      this.msg.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Group created.',
      });
    }

    this.cancel();
  }

  confirmDelete(g: GroupModel) {
    this.confirm.confirm({
      header: 'Confirm',
      message: `Delete "${g.name}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.groups = this.groups.filter(x => x.id !== g.id);
        this.msg.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Group deleted.',
        });
      },
    });
  }
}