import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeDietologoPage } from './home-dietologo.page';

describe('HomeDietologoPage', () => {
  let component: HomeDietologoPage;
  let fixture: ComponentFixture<HomeDietologoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDietologoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
