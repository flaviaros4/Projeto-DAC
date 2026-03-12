import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CurrencyMaskModule } from "ng2-currency-mask";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxMaskDirective, CurrencyMaskModule],
  providers: [provideNgxMask()],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-end');
}
