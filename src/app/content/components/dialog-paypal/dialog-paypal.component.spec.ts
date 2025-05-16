import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPaypalComponent } from './dialog-paypal.component';

describe('DialogPaypalComponent', () => {
  let component: DialogPaypalComponent;
  let fixture: ComponentFixture<DialogPaypalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPaypalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogPaypalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
