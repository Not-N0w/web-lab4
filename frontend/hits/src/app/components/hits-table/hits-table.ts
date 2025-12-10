import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Hit } from '../../models/hit';
import { HitService } from '../../services/HitService';
import { ButtonModule } from 'primeng/button';
import { ShortNumberPipe } from '../../pipes/ShortNumberPipe';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-hits-table',
  imports: [TableModule, ButtonModule, ShortNumberPipe, AsyncPipe],
  templateUrl: './hits-table.html',
  styleUrls: ['./hits-table.scss'],
})
export class HitsTable implements OnInit {
  private hitService = inject(HitService);
  loading = false;

  hits$ = this.hitService.hits().pipe(
    map(hits => hits ?? []),
    map(hits => [...hits].reverse())
  );

  ngOnInit() {
    this.hitService.refreshHits();
  }

  clearHits() {
    this.loading = true;
    this.hitService.clearHits().subscribe({
      next: () => this.loading = false,
      error: () => this.loading = false
    });
  }
}
