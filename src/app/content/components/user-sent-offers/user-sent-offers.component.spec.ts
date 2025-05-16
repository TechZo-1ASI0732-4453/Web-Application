import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSentOffersComponent } from './user-sent-offers.component';

describe('UserSentOffersComponent', () => {
  let component: UserSentOffersComponent;
  let fixture: ComponentFixture<UserSentOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSentOffersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserSentOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
