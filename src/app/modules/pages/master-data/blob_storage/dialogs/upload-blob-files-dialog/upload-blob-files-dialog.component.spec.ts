import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBlobFilesDialogComponent } from './upload-blob-files-dialog.component';

describe('UploadBlobFilesDialogComponent', () => {
  let component: UploadBlobFilesDialogComponent;
  let fixture: ComponentFixture<UploadBlobFilesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadBlobFilesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadBlobFilesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
