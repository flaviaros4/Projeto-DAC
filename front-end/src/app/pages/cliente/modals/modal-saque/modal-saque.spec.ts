import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSaque } from './modal-saque';

describe('ModalSaque', () => {
  let component: ModalSaque;
  let fixture: ComponentFixture<ModalSaque>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSaque],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalSaque);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
