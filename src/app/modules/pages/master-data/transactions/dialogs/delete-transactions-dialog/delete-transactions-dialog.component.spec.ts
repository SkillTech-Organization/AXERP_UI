import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTransactionsDialogComponent } from './delete-transactions-dialog.component';

describe('DeleteTransactionsDialogComponent', () => {
  let component: DeleteTransactionsDialogComponent;
  let fixture: ComponentFixture<DeleteTransactionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTransactionsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTransactionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
