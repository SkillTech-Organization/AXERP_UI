import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportGasTransactionsDialogComponent } from './import-gas-transactions-dialog.component';

describe('ImportGasTransactionsDialogComponent', () => {
  let component: ImportGasTransactionsDialogComponent;
  let fixture: ComponentFixture<ImportGasTransactionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportGasTransactionsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportGasTransactionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
