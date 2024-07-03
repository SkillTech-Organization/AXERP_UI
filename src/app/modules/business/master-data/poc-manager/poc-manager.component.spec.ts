import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PocManagerComponent } from './poc-manager.component';

describe('PocManagerComponent', () => {
  let component: PocManagerComponent;
  let fixture: ComponentFixture<PocManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PocManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PocManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
