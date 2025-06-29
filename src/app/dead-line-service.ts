import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DeadLineService {
  private printerStatus$: Observable<any> | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Fetches the deadline from a JSON file and returns an Observable.
   * The Observable emits the remaining seconds until the deadline.
   * @returns An Observable containing the seconds left until the deadline, which is cached for performance.
   */
  getDeadLine(): Observable<{ secondsLeft: number }> {
    if (!this.printerStatus$) {
      this.printerStatus$ = this.http.get<{ secondsLeft: number }>(
        'assets/data/data.json'
      ).pipe(shareReplay(1));
    }
    return this.printerStatus$;
  }

  /**
   * Resets the cached deadline so the next call fetches fresh data.
   */
  resetDeadlineCache(): void {
    this.printerStatus$ = null;
  }
}
