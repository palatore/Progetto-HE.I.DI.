import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PastiUtentePage } from './pasti-utente.page';

describe('PastiUtentePage', () => {
  let component: PastiUtentePage;
  let fixture: ComponentFixture<PastiUtentePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PastiUtentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
