import { App } from './app';
import { of, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { DeadLineService } from './dead-line-service';

describe('App', () => {
  let app: App;
  let mockService: jasmine.SpyObj<DeadLineService>;
  let scheduler: TestScheduler;

  beforeEach(() => {
    mockService = jasmine.createSpyObj('DeadLineService', ['getDeadLine']);
    app = new App(mockService);

    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should emit [3, 2, 1, 0] for secondsLeft = 3', () => {
    mockService.getDeadLine.and.returnValue(of({ secondsLeft: 3 }));

    scheduler.run(({ expectObservable }) => {
      const result$ = app.getDeadLineAndStartTimer(scheduler);
      const expected = 'a 999ms b 999ms c 999ms (d|)';
      const values = { a: 3, b: 2, c: 1, d: 0 };
      expectObservable(result$).toBe(expected, values);
    });
  });

  it('should emit [0] if deadline already reached', () => {
    mockService.getDeadLine.and.returnValue(of({ secondsLeft: 0 }));

    scheduler.run(({ expectObservable }) => {
      const result$ = app.getDeadLineAndStartTimer(scheduler);
      const expected = '(a|)';
      const values = { a: 0 };
      expectObservable(result$).toBe(expected, values);
    });
  });

  it('should emit [0] if service throws error', () => {
    mockService.getDeadLine.and.returnValue(throwError(() => new Error('fail')));

    scheduler.run(({ expectObservable }) => {
      const result$ = app.getDeadLineAndStartTimer(scheduler);
      const expected = '(a|)';
      const values = { a: 0 };
      expectObservable(result$).toBe(expected, values);
    });
  });

  it('should emit [2, 1, 0] and complete when secondsLeft = 2', () => {
    mockService.getDeadLine.and.returnValue(of({ secondsLeft: 2 }));

    scheduler.run(({ expectObservable }) => {
      const result$ = app.getDeadLineAndStartTimer(scheduler);
      const expected = 'a 999ms b 999ms (c|)';
      const values = { a: 2, b: 1, c: 0 };
      expectObservable(result$).toBe(expected, values);
    });
  });
});
