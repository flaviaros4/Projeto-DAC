import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MelhoresClientes } from './melhores-clientes';

describe('MelhoresClientes', () => {
  let component: MelhoresClientes;
  let fixture: ComponentFixture<MelhoresClientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MelhoresClientes],
    }).compileComponents();

    fixture = TestBed.createComponent(MelhoresClientes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
