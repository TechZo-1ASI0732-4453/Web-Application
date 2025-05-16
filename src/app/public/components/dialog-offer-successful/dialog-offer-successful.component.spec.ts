import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOfferSuccessfulComponent } from './dialog-offer-successful.component';

describe('DialogOfferSuccessfulComponent', () => {
  let component: DialogOfferSuccessfulComponent;
  let fixture: ComponentFixture<DialogOfferSuccessfulComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogOfferSuccessfulComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogOfferSuccessfulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
