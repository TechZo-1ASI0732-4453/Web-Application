import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingExchangesComponent } from './pending-exchanges.component';

describe('PendingExchangesComponent', () => {
  let component: PendingExchangesComponent;
  let fixture: ComponentFixture<PendingExchangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingExchangesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PendingExchangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
