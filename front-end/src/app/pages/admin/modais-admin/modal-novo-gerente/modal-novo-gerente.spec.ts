import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNovoGerente } from './modal-novo-gerente';

describe('ModalNovoGerente', () => {
  let component: ModalNovoGerente;
  let fixture: ComponentFixture<ModalNovoGerente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNovoGerente],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalNovoGerente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
