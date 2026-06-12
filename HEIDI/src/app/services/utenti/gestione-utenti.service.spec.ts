import { TestBed } from '@angular/core/testing';

import { GestioneUtentiService } from './gestione-utenti.service';

describe('GestioneUtentiService', () => {
  let service: GestioneUtentiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestioneUtentiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
