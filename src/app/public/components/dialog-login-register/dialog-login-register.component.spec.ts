import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLoginRegisterComponent } from './dialog-login-register.component';

describe('DialogLoginRegisterComponent', () => {
  let component: DialogLoginRegisterComponent;
  let fixture: ComponentFixture<DialogLoginRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogLoginRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogLoginRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
