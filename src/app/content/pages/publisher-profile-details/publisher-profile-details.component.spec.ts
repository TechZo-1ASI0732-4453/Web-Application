import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherProfileDetailsComponent } from './publisher-profile-details.component';

describe('PublisherProfileDetailsComponent', () => {
  let component: PublisherProfileDetailsComponent;
  let fixture: ComponentFixture<PublisherProfileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublisherProfileDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublisherProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
