import { TestBed } from '@angular/core/testing';

import { GasTransactionService } from './gas-transaction.service';

describe('GasTransactionService', () => {
  let service: GasTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GasTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
