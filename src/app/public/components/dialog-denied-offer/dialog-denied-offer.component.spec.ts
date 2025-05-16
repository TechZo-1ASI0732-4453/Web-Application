import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeniedOfferComponent } from './dialog-denied-offer.component';

describe('DialogDeniedOfferComponent', () => {
  let component: DialogDeniedOfferComponent;
  let fixture: ComponentFixture<DialogDeniedOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDeniedOfferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDeniedOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
