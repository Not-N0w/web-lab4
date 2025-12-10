import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthenticationService } from '../../services/AuthenticationService';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
    private authenticationService = inject(AuthenticationService);

    logout(): void {
        this.authenticationService.logout();
    }
    get isLoggedIn(): boolean {
        return this.authenticationService.isLoggedIn();
    }

    get username(): string | null {
        return this.authenticationService.userName;
    }
}   
