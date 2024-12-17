import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasTransactionsManagerComponent } from './gas-transactions-manager.component';

describe('PocManagerComponent', () => {
  let component: GasTransactionsManagerComponent;
  let fixture: ComponentFixture<GasTransactionsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GasTransactionsManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GasTransactionsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
