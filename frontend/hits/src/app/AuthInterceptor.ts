import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthenticationService } from './services/AuthenticationService';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private authenticationService = inject(AuthenticationService);

  private getCookie(name: string): string | null {
    const matches = document.cookie.match(new RegExp(
      `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authenticationService.getToken() || this.getCookie('access_token');
    console.log(token);

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
