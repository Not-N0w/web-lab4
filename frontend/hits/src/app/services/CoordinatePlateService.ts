import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HitFormData } from "../models/hitFormData";
import { HitService } from "./HitService";
import { Hit } from "../models/hit";

@Injectable({ providedIn: 'root' })
export class CoordinatePlateService {
  private value$ = new BehaviorSubject<HitFormData>({ x: 0, y: 0, r: 1 });

  hitService = inject(HitService);

  setValue(v: HitFormData) {
    this.value$.next(v);
  }

  getValue(): Observable<HitFormData> {
    return this.value$.asObservable();
  }

  getHits(): Observable<Hit[]> {
    return this.hitService.hits();
  }


  sendPoint(x: number, y: number, r: number) {
    const data: HitFormData = { x, y, r };
    const resp = this.hitService.hit(data).subscribe();

    this.hitService.refreshHits();
    return resp;
  }
}
