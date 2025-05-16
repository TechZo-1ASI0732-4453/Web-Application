import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEmailCodeComponent } from './dialog-email-code.component';

describe('DialogEmailCodeComponent', () => {
  let component: DialogEmailCodeComponent;
  let fixture: ComponentFixture<DialogEmailCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEmailCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogEmailCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
