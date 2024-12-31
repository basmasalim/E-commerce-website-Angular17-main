import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificOrderComponent } from './specific-order.component';

describe('SpecificOrderComponent', () => {
  let component: SpecificOrderComponent;
  let fixture: ComponentFixture<SpecificOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecificOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecificOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
