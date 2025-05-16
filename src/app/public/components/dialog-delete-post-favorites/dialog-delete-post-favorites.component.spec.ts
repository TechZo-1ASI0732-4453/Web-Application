import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeletePostFavoritesComponent } from './dialog-delete-post-favorites.component';

describe('DialogDeletePostComponent', () => {
  let component: DialogDeletePostFavoritesComponent;
  let fixture: ComponentFixture<DialogDeletePostFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDeletePostFavoritesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDeletePostFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
