import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AuthService);

  private permissionSignal = signal<string>('');

  constructor() {
    effect(() => {
      const perm = this.permissionSignal();
      this.viewContainer.clear();

      if (perm && this.authService.hasPermission(perm)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }

  @Input() set hasPermission(permission: string) {
    this.permissionSignal.set(permission);
  }
}