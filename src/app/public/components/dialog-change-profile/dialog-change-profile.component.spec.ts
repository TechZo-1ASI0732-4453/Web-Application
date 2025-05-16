import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChangeProfileComponent } from './dialog-change-profile.component';

describe('DialogChangeProfileComponent', () => {
  let component: DialogChangeProfileComponent;
  let fixture: ComponentFixture<DialogChangeProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogChangeProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogChangeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
