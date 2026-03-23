import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExtrato } from './modal-extrato';

describe('ModalExtrato', () => {
  let component: ModalExtrato;
  let fixture: ComponentFixture<ModalExtrato>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalExtrato],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalExtrato);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
