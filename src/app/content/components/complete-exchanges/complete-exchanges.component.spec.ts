import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteExchangesComponent } from './complete-exchanges.component';

describe('CompleteExchangesComponent', () => {
  let component: CompleteExchangesComponent;
  let fixture: ComponentFixture<CompleteExchangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteExchangesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompleteExchangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
