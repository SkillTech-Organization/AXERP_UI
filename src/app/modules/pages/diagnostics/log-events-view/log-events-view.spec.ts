import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLogViewComponent } from './log-events-view.component';

describe('PocManagerComponent', () => {
  let component: EventLogViewComponent;
  let fixture: ComponentFixture<EventLogViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventLogViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventLogViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
