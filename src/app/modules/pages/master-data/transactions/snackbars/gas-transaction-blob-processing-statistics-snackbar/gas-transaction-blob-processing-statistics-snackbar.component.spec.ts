import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasTransactionBlobProcessingStatisticsSnackbarComponent } from './gas-transaction-blob-processing-statistics-snackbar.component';

describe('GasTransactionBlobProcessingStatisticsSnackbarComponent', () => {
  let component: GasTransactionBlobProcessingStatisticsSnackbarComponent;
  let fixture: ComponentFixture<GasTransactionBlobProcessingStatisticsSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GasTransactionBlobProcessingStatisticsSnackbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GasTransactionBlobProcessingStatisticsSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
