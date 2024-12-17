import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlobFilesViewComponent } from './blob-files-view.component';

describe('BlobFilesViewComponent', () => {
  let component: BlobFilesViewComponent;
  let fixture: ComponentFixture<BlobFilesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlobFilesViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlobFilesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
