import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerButtonComponent } from './manager-button.component';

describe('ManagerButtonComponent', () => {
  let component: ManagerButtonComponent;
  let fixture: ComponentFixture<ManagerButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
