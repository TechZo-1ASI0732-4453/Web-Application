import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLimitReachedComponent } from './dialog-limit-reached.component';

describe('DialogLimitReachedComponent', () => {
  let component: DialogLimitReachedComponent;
  let fixture: ComponentFixture<DialogLimitReachedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogLimitReachedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogLimitReachedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
