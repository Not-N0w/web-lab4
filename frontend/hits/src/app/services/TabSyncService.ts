import { Injectable } from "@angular/core";
import { SyncMessage } from "../types/syncMessage";

@Injectable({ providedIn: 'root' })
export class TabSyncService {
    private channel = new BroadcastChannel('tab-sync');
    private handlers: Array<(msg: SyncMessage) => void> = [];

    constructor() {
        this.channel.onmessage = (ev) => {
            this.handlers.forEach(h => h(ev.data));
        };
    }

    send(message: SyncMessage) {
        this.channel.postMessage(message);
    }

    onMessage(handler: (msg: SyncMessage) => void) {
        this.handlers.push(handler);
    }
}