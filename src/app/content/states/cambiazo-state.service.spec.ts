import { TestBed } from '@angular/core/testing';

import { CambiazoStateService } from './cambiazo-state.service';

describe('CambiazoStateService', () => {
  let service: CambiazoStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CambiazoStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
