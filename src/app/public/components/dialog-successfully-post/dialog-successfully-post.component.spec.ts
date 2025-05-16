import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSuccessfullyPostComponent } from './dialog-successfully-post.component';

describe('DialogSuccessfullyPostComponent', () => {
  let component: DialogSuccessfullyPostComponent;
  let fixture: ComponentFixture<DialogSuccessfullyPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSuccessfullyPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogSuccessfullyPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
