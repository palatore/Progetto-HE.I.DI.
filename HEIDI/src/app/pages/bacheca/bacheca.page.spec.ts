import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BachecaPage } from './bacheca.page';

describe('BachecaPage', () => {
  let component: BachecaPage;
  let fixture: ComponentFixture<BachecaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BachecaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
