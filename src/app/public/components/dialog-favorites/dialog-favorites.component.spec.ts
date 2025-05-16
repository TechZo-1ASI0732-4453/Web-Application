import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFavoritesComponent } from './dialog-favorites.component';

describe('DialogFavoritesComponent', () => {
  let component: DialogFavoritesComponent;
  let fixture: ComponentFixture<DialogFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogFavoritesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
