import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCancelMembershipComponent } from './dialog-cancel-membership.component';

describe('DialogCancelMembershipComponent', () => {
  let component: DialogCancelMembershipComponent;
  let fixture: ComponentFixture<DialogCancelMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCancelMembershipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogCancelMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
