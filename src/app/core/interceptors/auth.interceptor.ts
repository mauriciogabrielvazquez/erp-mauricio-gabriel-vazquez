import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const groupId = localStorage.getItem('currentGroupId');
  const token = localStorage.getItem('erp_token');

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'x-group-id': groupId || '' 
      }
    });
    return next(clonedRequest);
  }
  return next(req);
};