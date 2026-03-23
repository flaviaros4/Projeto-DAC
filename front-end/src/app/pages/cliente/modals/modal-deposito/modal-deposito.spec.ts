import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeposito } from './modal-deposito';

describe('ModalDeposito', () => {
  let component: ModalDeposito;
  let fixture: ComponentFixture<ModalDeposito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDeposito],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDeposito);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
