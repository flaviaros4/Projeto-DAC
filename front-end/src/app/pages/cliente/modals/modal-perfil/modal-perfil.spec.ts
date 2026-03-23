import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPerfil } from './modal-perfil';

describe('ModalPerfil', () => {
  let component: ModalPerfil;
  let fixture: ComponentFixture<ModalPerfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPerfil],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalPerfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
