import { ComponentFixture } from "@angular/core/testing";
import { CreazioneAllenamentoPage } from './creazione-allenamento.page';

describe('CreazioneAllenamentoPage', () => {
    let component: CreazioneAllenamentoPage;
    let fixture: ComponentFixture<CreazioneAllenamentoPage>;

    beforeEach(() => {
        fixture = TestBed.createComponent(CreazioneAllenamentoPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
