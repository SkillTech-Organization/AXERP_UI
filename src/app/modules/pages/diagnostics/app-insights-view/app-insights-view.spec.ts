import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppInsightsViewComponent } from './app-insights-view.component';

describe('PocManagerComponent', () => {
  let component: AppInsightsViewComponent;
  let fixture: ComponentFixture<AppInsightsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppInsightsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppInsightsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
