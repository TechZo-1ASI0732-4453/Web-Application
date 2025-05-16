import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegisterSuccessfullyComponent } from './dialog-register-successfully.component';

describe('DialogRegisterSuccessfullyComponent', () => {
  let component: DialogRegisterSuccessfullyComponent;
  let fixture: ComponentFixture<DialogRegisterSuccessfullyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogRegisterSuccessfullyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogRegisterSuccessfullyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
