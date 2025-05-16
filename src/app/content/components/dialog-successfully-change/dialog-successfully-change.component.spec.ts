import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSuccessfullyChangeComponent } from './dialog-successfully-change.component';

describe('DialogSuccessfullyChangeComponent', () => {
  let component: DialogSuccessfullyChangeComponent;
  let fixture: ComponentFixture<DialogSuccessfullyChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSuccessfullyChangeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogSuccessfullyChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
