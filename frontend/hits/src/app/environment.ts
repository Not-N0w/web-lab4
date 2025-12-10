export const environment = {
    production: false,
    keycloak: {
        url: 'http://localhost:8080',
        redirectUri: 'http://localhost:4200/home',
        postLogoutRedirectUri: 'http://localhost:4200/auth',
        realm: 'lab4',
        clientId: 'angular-client',
    },
    apiBaseUrl: 'http://localhost:12030/lab4-1.0-SNAPSHOT',
    wsUrl: 'http://localhost:12030/lab4-1.0-SNAPSHOT/ws'
};