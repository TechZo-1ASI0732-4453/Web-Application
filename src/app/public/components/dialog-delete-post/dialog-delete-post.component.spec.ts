import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeletePostComponent } from './dialog-delete-post.component';

describe('DialogDeletePostComponent', () => {
  let component: DialogDeletePostComponent;
  let fixture: ComponentFixture<DialogDeletePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDeletePostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDeletePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
