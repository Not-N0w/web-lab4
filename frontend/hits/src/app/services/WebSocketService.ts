import { Injectable } from "@angular/core";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { environment } from "../environment";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class WebSocketService {
    private client: Client | null = null;
    private connected = false;
    private syncRequest$ = new Subject<void>();

    onSyncRecieved$ = this.syncRequest$.asObservable();

    connect(accessToken: string) {
        if (this.client?.active) return;

        this.client = new Client({
            webSocketFactory: () => new SockJS(environment.wsUrl),
            reconnectDelay: 3000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            connectHeaders: { token: accessToken },
            onConnect: () => {
                this.connected = true;
                setTimeout(() => {
                    this.client!.subscribe('/user/queue/updates', () => {
                        this.syncRequest$.next();
                    });
                }, 100);
            },
            onWebSocketClose: () => {
                this.connected = false;
            }
        });

        this.client.activate();
    }

    disconnect() {
        if (!this.client) return;
        this.client.deactivate();
        this.client = null;
        this.connected = false;
    }

    send(destination: string, body: any) {
        if (!this.client || !this.client.active || !this.connected) return;

        this.client.publish({
            destination,
            body: typeof body === "string" ? body : JSON.stringify(body)
        });
    }

    sync() {
        this.client?.publish({
            destination: '/app/hit',
            body: "need_sync"
        });
    }
}
