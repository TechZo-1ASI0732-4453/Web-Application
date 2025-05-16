import { TestBed } from '@angular/core/testing';

import { CustomValidators } from './validators.service';

describe('ValidatorsService', () => {
  let service: CustomValidators;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomValidators);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
