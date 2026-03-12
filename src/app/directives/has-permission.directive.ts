import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService, Permission } from '../services/auth.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private currentPermission: Permission | undefined;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input() set hasPermission(permission: Permission) {
    this.currentPermission = permission;
    this.updateView();
  }

  private updateView() {
    this.viewContainer.clear();
    
    if (this.currentPermission && this.authService.hasPermission(this.currentPermission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}