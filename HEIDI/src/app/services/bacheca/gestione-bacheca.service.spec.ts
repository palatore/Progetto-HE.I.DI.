import { TestBed } from '@angular/core/testing';

import { GestioneBachecaService } from './gestione-bacheca.service';

describe('GestioneBachecaService', () => {
  let service: GestioneBachecaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestioneBachecaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
