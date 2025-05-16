import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNoProductsComponent } from './dialog-no-products.component';

describe('DialogNoProductsComponent', () => {
  let component: DialogNoProductsComponent;
  let fixture: ComponentFixture<DialogNoProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogNoProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogNoProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
