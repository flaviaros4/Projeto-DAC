import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeGerente } from './home-gerente';

describe('HomeGerente', () => {
  let component: HomeGerente;
  let fixture: ComponentFixture<HomeGerente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeGerente],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeGerente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
