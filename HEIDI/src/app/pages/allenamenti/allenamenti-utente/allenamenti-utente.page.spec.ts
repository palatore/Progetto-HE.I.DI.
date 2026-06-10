import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllenamentiUtentePage } from './allenamenti-utente.page';

describe('PastiUtentePage', () => {
  let component: AllenamentiUtentePage;
  let fixture: ComponentFixture<AllenamentiUtentePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllenamentiUtentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});