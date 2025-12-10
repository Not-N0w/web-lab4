import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { HitFormData } from "../models/hitFormData";
import { Hit } from "../models/hit";
import { HttpClient } from "@angular/common/http";
import { environment } from '../environment';
import { TabSyncService } from "./TabSyncService";
import { SyncMessage } from "../types/syncMessage";
import { WebSocketService } from "./WebSocketService";

@Injectable({ providedIn: 'root' })
export class HitService {
    private hits$ = new BehaviorSubject<Hit[]>([]);
    private baseUrl = environment.apiBaseUrl;
    private tabSync = inject(TabSyncService);
    private http = inject(HttpClient);
    private wsService = inject(WebSocketService);

    constructor() {
        this.tabSync.onMessage(msg => this.handleSyncMessage(msg));
        this.wsService.onSyncRecieved$.subscribe(() => {
            this.refreshHits();
        });
    }
    private handleSyncMessage(msg: SyncMessage) {
        switch (msg.type) {
            case 'update-hits':
                this.handleRemoteNewHit(msg.hits);
                break;
        }
    }
    private handleRemoteNewHit(hits: Hit[]) {
        this.hits$.next(hits ?? []);
    }

    public hits(): Observable<Hit[]> {
        return this.hits$.asObservable().pipe(
            map(hits => hits ?? [])
        );
    }

    public refreshHits() {
        this.http.get<Hit[]>(`${this.baseUrl}/hits/all`)
            .subscribe(hits => {
                this.hits$.next(hits ?? []);
                this.tabSync.send({
                    type: 'update-hits',
                    hits: this.hits$.getValue()
                });
            });
    }
    public hit(hitData: HitFormData) {
        return this.http.post<void>(`${this.baseUrl}/hits/hit`, hitData).pipe(
            tap(() => {
                this.refreshHits();
                this.wsService.sync();
            })
        );
    }

    public clearHits() {
        return this.http.delete<void>(`${this.baseUrl}/hits/clear`).pipe(
            tap(() => {
                this.refreshHits();
                this.wsService.sync();
            })
        );
    }

    public addHit(hit: Hit) {
        const currentHits = this.hits$.getValue() ?? [];
        this.hits$.next([...currentHits, hit]);
    }
}
