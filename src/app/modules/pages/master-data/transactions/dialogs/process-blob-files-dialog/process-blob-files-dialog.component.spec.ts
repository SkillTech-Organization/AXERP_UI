import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessBlobFilesDialogComponent } from './process-blob-files-dialog.component';

describe('ProcessBlobFilesDialogComponent', () => {
  let component: ProcessBlobFilesDialogComponent;
  let fixture: ComponentFixture<ProcessBlobFilesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessBlobFilesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessBlobFilesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
