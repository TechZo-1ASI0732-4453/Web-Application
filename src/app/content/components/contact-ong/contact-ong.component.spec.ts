import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactOngComponent } from './contact-ong.component';

describe('ContactOngComponent', () => {
  let component: ContactOngComponent;
  let fixture: ComponentFixture<ContactOngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactOngComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactOngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
