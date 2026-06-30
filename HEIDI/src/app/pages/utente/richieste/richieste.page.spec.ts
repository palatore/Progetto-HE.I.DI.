import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RichiestePage } from './richieste.page';

describe('RichiestePage', () => {
  let component: RichiestePage;
  let fixture: ComponentFixture<RichiestePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RichiestePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
