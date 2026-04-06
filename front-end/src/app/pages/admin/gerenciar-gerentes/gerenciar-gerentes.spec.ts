import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarGerentes } from './gerenciar-gerentes';

describe('GerenciarGerentes', () => {
  let component: GerenciarGerentes;
  let fixture: ComponentFixture<GerenciarGerentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarGerentes],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarGerentes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
