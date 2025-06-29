import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DeadLineService } from './dead-line-service';
import { catchError, of, switchMap, timer, map, takeWhile, Observable} from 'rxjs';
import { CommonModule } from '@angular/common';
import { SchedulerLike, asyncScheduler } from 'rxjs';

@Component({
  selector: 'app-root',
  providers: [DeadLineService],
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected title = 'timerApp';
  protected description = 'A simple timer application';
  protected author = 'Rishabh Shukla';
  public countdown$!: Observable<number>;

  constructor(private deadLineService: DeadLineService) {}

  ngOnInit() {
    this.getDeadLineAndStartTimer(asyncScheduler);
  }

  /**
   * Fetches the deadline from the service and starts a timer that updates every second.
   * The timer emits the remaining seconds until the deadline.
   * If the deadline is reached, the timer stops.
   * If there's an error fetching the deadline, it defaults to 0 seconds left.
   * The business logic ie... the timer code is placed here, rather than in the service itself.
   * This is to keep the service focused on data fetching and caching only.
   */
  getDeadLineAndStartTimer(scheduler: SchedulerLike): Observable<number> {
    return this.countdown$ = this.deadLineService.getDeadLine().pipe(
      catchError(() => of({ secondsLeft: 0 })),
      switchMap(({ secondsLeft }) =>
        timer(0, 1000, scheduler).pipe(
          map((elapsed) => secondsLeft - elapsed),
          takeWhile((seconds) => seconds > 0, true) // <-- complete on last true value
        )
      )
    );
  }

  /**
   * Resets the deadline by clearing the cached deadline status in the service
   * and fetching the deadline again to start a new timer.
   */
  resetDeadLine() {
    this.deadLineService.resetDeadlineCache();
    this.getDeadLineAndStartTimer(asyncScheduler);
  }
}

