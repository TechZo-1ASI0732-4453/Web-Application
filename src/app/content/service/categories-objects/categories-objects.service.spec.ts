import { TestBed } from '@angular/core/testing';

import { CategoriesObjectsService } from './categories-objects.service';

describe('CategoriesObjectsService', () => {
  let service: CategoriesObjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesObjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
