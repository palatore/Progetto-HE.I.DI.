import { TestBed } from "@angular/core/testing";

import { GestioneAllenamentiService } from './gestione-allenamenti.service';

describe('GestioneAllenamentiService', () => {
    let service: GestioneAllenamentiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GestioneAllenamentiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
})