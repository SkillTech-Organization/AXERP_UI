import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AxerpProgressBarComponent } from './axerp-progress-bar.component';

describe('AxerpProgressBarComponent', () => {
  let component: AxerpProgressBarComponent;
  let fixture: ComponentFixture<AxerpProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AxerpProgressBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AxerpProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
