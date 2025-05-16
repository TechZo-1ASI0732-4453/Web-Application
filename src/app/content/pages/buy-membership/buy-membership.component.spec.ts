import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyMembershipComponent } from './buy-membership.component';

describe('BuyMembershipComponent', () => {
  let component: BuyMembershipComponent;
  let fixture: ComponentFixture<BuyMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyMembershipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuyMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
