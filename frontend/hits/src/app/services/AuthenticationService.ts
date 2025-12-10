import { inject, Injectable } from "@angular/core";
import Keycloak from 'keycloak-js';
import { environment } from "../environment";
import { TabSyncService } from "./TabSyncService";
import { SyncMessage } from "../types/syncMessage";
import { WebSocketService } from "./WebSocketService";
import Cookies from 'js-cookie';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private keycloak: Keycloak;
    private refreshInterval: any;
    private tabSync = inject(TabSyncService);
    private ws = inject(WebSocketService);
    private loading = false;

    constructor() {
        this.keycloak = new Keycloak({
            url: environment.keycloak.url,
            realm: environment.keycloak.realm,
            clientId: environment.keycloak.clientId,
        });
        this.tabSync.onMessage(msg => this.handleSyncMessage(msg));
    }

    get isLoading(): boolean {
        return this.loading;
    }

    private handleSyncMessage(msg: SyncMessage) {
        switch (msg.type) {
            case 'login':
                this.handleRemoteLogin(msg.token);
                break;
            case 'logout':
                this.handleRemoteLogout();
                break;
            case 'token':
                this.handleRemoteTokenRefresh(msg.token);
                break
        }
    }

    private handleRemoteLogout() {
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        this.deleteCookie('access_token');
        this.ws.disconnect();
        this.keycloak.logout({
            redirectUri: environment.keycloak.postLogoutRedirectUri
        });
    }

    private handleRemoteLogin(token: string) {
        this.keycloak.token = token;
        this.ws.connect(token);
        this.setCookie('access_token', token);
        this.startRefreshLoop();
    }

    private handleRemoteTokenRefresh(token: string) {
        this.keycloak.token = token;
        this.setCookie('access_token', token);
    }


    init(): Promise<boolean> {
        this.loading = true;
        return this.keycloak.init({
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
            checkLoginIframe: false,
        }).then(auth => {
            if (auth && this.keycloak.token) {
                this.loading = false;
                this.setCookie('access_token', this.keycloak.token);
                this.ws.connect(this.keycloak.token);
                this.startRefreshLoop();
            }
            return auth;
        });
    }

    private startRefreshLoop() {
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        this.refreshInterval = setInterval(() => {
            this.keycloak.updateToken(60)
                .then(refreshed => {
                    if (refreshed && this.keycloak.token) {
                        const newToken = this.keycloak.token;
                        this.setCookie('access_token', newToken);
                        this.tabSync.send({
                            type: 'token',
                            token: newToken,
                        });
                    }
                })
                .catch(() => this.logout());
        }, 30000);
    }

    private getCookie(name: string) {
        return Cookies.get(name) || null;
    }

    private setCookie(name: string, value: string) {
        Cookies.set(name, value, { secure: true, sameSite: 'strict', path: '/' });
    }

    private deleteCookie(name: string) {
        Cookies.remove(name, { path: '/' });
    }

    get userName(): string {
        return this.keycloak.tokenParsed?.["preferred_username"] || '';
    }

    isLoggedIn(): boolean {
        return !!this.keycloak.token;
    }


    logout(): void {
        this.tabSync.send({ type: 'logout' });
        this.ws.disconnect();

        this.deleteCookie('access_token');
        this.keycloak.logout({
            redirectUri: environment.keycloak.postLogoutRedirectUri
        });
    }

    async login(): Promise<void> {
        await this.keycloak.login({ redirectUri: environment.keycloak.redirectUri });

        if (this.keycloak.token) {
            const token = this.keycloak.token;
            this.ws.connect(token);
            this.setCookie('access_token', token);

            this.tabSync.send({
                type: 'login',
                token
            });
        }
    }

    redirectToAuthPage(): void {
        this.keycloak.login({ redirectUri: window.location.href });
    }

    getToken(): string | null {
        return this.keycloak.token || this.getCookie('access_token');
    }
}