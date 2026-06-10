import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreazionePastoPage } from './creazione-pasto.page';

describe('CreazionePastoPage', () => {
  let component: CreazionePastoPage;
  let fixture: ComponentFixture<CreazionePastoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreazionePastoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
