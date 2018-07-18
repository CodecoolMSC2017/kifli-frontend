import { TestBed, inject } from '@angular/core/testing';

import { AdServiceService } from './product.service';

describe('AdServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdServiceService]
    });
  });

  it('should be created', inject([AdServiceService], (service: AdServiceService) => {
    expect(service).toBeTruthy();
  }));
});
