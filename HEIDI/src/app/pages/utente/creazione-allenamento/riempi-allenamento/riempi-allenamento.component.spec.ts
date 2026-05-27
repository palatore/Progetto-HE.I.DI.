import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { RiempiAllenamentoComponent } from "./riempi-allenamento.component";

describe('RiempiAllenamentoComponent', () => {
    let component: RiempiAllenamentoComponent;
    let fixture: ComponentFixture<RiempiAllenamentoComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RiempiAllenamentoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RiempiAllenamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});