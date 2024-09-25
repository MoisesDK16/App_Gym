import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService, private router: Router) {
    console.log('AuthInterceptor inicializado');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokenUser = this._authService.getTokenUser();
    console.log('Token obtenido del servicio:', tokenUser);
    
    const token = tokenUser ? `Bearer ${tokenUser}` : null;

    const headersClone = token 
      ? req.clone({ headers: req.headers.set('Authorization', token) })
      : req;

    return next.handle(headersClone).pipe(
      catchError((err) => {
        console.error('Error en el interceptor:', err);
        if ([401, 403].includes(err.status)) {
          this.router.navigate(['/layout-publico/home']);
        }
        return throwError(err);
      })
    );
  }
}





