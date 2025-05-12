import { TestBed } from '@angular/core/testing';

import { GestionePastiService } from './gestione-pasti.service';

describe('GestionePastiService', () => {
  let service: GestionePastiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionePastiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
