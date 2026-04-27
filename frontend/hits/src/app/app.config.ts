import { APP_INITIALIZER, ApplicationConfig, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara';

import { routes } from './app.routes';
import { AuthenticationService } from './services/AuthenticationService';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './AuthInterceptor';
import { provideAnimations } from '@angular/platform-browser/animations';


export const appConfig: ApplicationConfig = {
  providers: [
    AuthInterceptor,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    providePrimeNG({ theme: { preset: Lara } }),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: (auth: AuthenticationService) => () => auth.init(),
      multi: true,
      deps: [AuthenticationService]
    }
    ],
};
