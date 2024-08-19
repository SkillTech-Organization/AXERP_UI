import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBlobFilesDialogComponent } from './delete-blob-files-dialog.component';

describe('DeleteBlobFilesDialogComponent', () => {
  let component: DeleteBlobFilesDialogComponent;
  let fixture: ComponentFixture<DeleteBlobFilesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteBlobFilesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteBlobFilesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
