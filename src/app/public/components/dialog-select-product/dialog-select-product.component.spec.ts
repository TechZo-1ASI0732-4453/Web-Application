import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelectProductComponent } from './dialog-select-product.component';

describe('DialogSelectProductComponent', () => {
  let component: DialogSelectProductComponent;
  let fixture: ComponentFixture<DialogSelectProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSelectProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogSelectProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
