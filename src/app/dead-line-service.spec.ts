import { TestBed } from '@angular/core/testing';

import { DeadLineService } from './dead-line-service';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

describe('DeadLineService', () => {
  let service: DeadLineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideZonelessChangeDetection(),
      ]
    });
    service = TestBed.inject(DeadLineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
