import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSuccessfulProductEditionComponent } from './dialog-successful-product-edition.component';

describe('DialogSuccessfulProductEditionComponent', () => {
  let component: DialogSuccessfulProductEditionComponent;
  let fixture: ComponentFixture<DialogSuccessfulProductEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSuccessfulProductEditionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogSuccessfulProductEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
