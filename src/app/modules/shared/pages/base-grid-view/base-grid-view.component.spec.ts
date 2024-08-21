import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseGridViewComponent } from './base-grid-view.component';

describe('BaseGridViewComponent', () => {
  let component: BaseGridViewComponent;
  let fixture: ComponentFixture<BaseGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseGridViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
