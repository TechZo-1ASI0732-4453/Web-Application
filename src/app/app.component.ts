import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FooterContentComponent} from "./public/footer-content/footer-content.component";
import {HeaderContentComponent} from "./public/header-content/header-content.component";
import { Router, NavigationEnd } from '@angular/router';
import {NgIf} from "@angular/common";
import {CambiazoStateService} from "./content/states/cambiazo-state.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterContentComponent, HeaderContentComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Cambiazo';

  showNavFooter: boolean = true;
  scrollToTop() {
    window.scrollTo({
      top: 0,
    });
  }


  constructor(private router: Router, private cambiazoState: CambiazoStateService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavFooter = !(event.url === '/login'|| event.url === '/register'|| event.url.startsWith('/admin')|| event.url.startsWith('/memberships/')|| event.url === '/verify-email' || event.url === '/change-password'|| event.url === '/buy-membership');

        if (event.url === '/login') {
          localStorage.removeItem('id-temporal');
        }
        if(event.url.startsWith('/')){
          this.scrollToTop()
        }
      }
    });

  }
}
