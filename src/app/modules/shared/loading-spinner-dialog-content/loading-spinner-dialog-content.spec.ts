import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpinnerDialogContentComponent as LoadingSpinnerDialogContentComponent } from './loading-spinner-dialog-content';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerDialogContentComponent;
  let fixture: ComponentFixture<LoadingSpinnerDialogContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerDialogContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerDialogContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
