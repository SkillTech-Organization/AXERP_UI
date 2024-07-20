import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportStatisticsSnackbarComponent } from './import-statistics-snackbar.component';

describe('ImportStatisticsSnackbarComponent', () => {
  let component: ImportStatisticsSnackbarComponent;
  let fixture: ComponentFixture<ImportStatisticsSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportStatisticsSnackbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportStatisticsSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
