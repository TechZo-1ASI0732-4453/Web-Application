import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSuccessfulExchangeComponent } from './dialog-successful-exchange.component';

describe('DialogSuccessfulExchangeComponent', () => {
  let component: DialogSuccessfulExchangeComponent;
  let fixture: ComponentFixture<DialogSuccessfulExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSuccessfulExchangeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogSuccessfulExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
