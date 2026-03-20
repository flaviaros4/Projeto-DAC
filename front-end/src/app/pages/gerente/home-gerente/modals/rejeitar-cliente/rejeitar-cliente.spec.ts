import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejeitarCliente } from './rejeitar-cliente';

describe('RejeitarCliente', () => {
  let component: RejeitarCliente;
  let fixture: ComponentFixture<RejeitarCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejeitarCliente],
    }).compileComponents();

    fixture = TestBed.createComponent(RejeitarCliente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
