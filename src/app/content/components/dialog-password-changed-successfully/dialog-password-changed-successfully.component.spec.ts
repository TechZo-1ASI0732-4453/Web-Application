import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPasswordChangedSuccessfullyComponent } from './dialog-password-changed-successfully.component';

describe('DialogPasswordChangedSuccessfullyComponent', () => {
  let component: DialogPasswordChangedSuccessfullyComponent;
  let fixture: ComponentFixture<DialogPasswordChangedSuccessfullyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPasswordChangedSuccessfullyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogPasswordChangedSuccessfullyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
