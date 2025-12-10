import { Routes } from '@angular/router';
import { MainPage } from './pages/main-page/main-page';
import { AuthGuard } from './AuthGuard';

export const routes: Routes = [
  { path: "home", component: MainPage, canActivate: [AuthGuard] },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  { path: '**', redirectTo: 'home' }
];
