import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTransferencia } from './modal-transferencia';

describe('ModalTransferencia', () => {
  let component: ModalTransferencia;
  let fixture: ComponentFixture<ModalTransferencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTransferencia],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalTransferencia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
