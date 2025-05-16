import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPostReviewComponent } from './dialog-post-review.component';

describe('DialogPostReviewComponent', () => {
  let component: DialogPostReviewComponent;
  let fixture: ComponentFixture<DialogPostReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPostReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogPostReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
