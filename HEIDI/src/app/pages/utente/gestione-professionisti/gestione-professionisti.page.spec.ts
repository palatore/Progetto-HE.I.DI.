import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestioneProfessionistiPage } from './gestione-professionisti.page';

describe('GestioneProfessionistiPage', () => {
  let component: GestioneProfessionistiPage;
  let fixture: ComponentFixture<GestioneProfessionistiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestioneProfessionistiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
