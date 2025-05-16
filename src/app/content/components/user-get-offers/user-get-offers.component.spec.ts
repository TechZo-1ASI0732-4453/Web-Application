import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGetOffersComponent } from './user-get-offers.component';

describe('UserGetOffersComponent', () => {
  let component: UserGetOffersComponent;
  let fixture: ComponentFixture<UserGetOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserGetOffersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserGetOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
