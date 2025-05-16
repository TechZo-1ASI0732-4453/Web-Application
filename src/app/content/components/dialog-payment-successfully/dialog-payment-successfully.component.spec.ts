import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPaymentSuccessfullyComponent } from './dialog-payment-successfully.component';

describe('DialogPaymentSuccessfullyComponent', () => {
  let component: DialogPaymentSuccessfullyComponent;
  let fixture: ComponentFixture<DialogPaymentSuccessfullyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPaymentSuccessfullyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogPaymentSuccessfullyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
