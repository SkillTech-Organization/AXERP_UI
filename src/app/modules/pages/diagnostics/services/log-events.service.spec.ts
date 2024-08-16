import { TestBed } from '@angular/core/testing';

import { LogEventsService } from './log-events.service';

describe('AppInsightsService', () => {
  let service: LogEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
