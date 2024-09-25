import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  // title = 'frontend';

  router = inject(Router)
  titleService = inject(Title)
  activatedRoute = inject(ActivatedRoute)

  ngOnInit(): void {
    // Listen to route changes
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd), // Only act on NavigationEnd events
        map(() => this.activatedRoute), // Get the current activated route
        map(route => {
          while (route.firstChild) route = route.firstChild; // Traverse to the last child route
          return route;
        }),
        filter(route => route.outlet === 'primary'), // Ensure it's the primary route
        map(route => route.snapshot.data['title']) // Get the title from route data
      )
      .subscribe(title => {
        if (title) {
          this.titleService.setTitle(title); // Set the page title
        }
      });
  }
}
