// Angular import
import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

// project import
import { SpinnerComponent } from './theme/shared/components/spinner/spinner.component';
import { EventManagementModule } from './demo/event-management/event-management.module';
import { Appservice } from './myservice/appservice';

@Component({
  selector: 'app-root',
  imports: [SpinnerComponent, RouterModule, EventManagementModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private appService = inject(Appservice);

  title = 'datta-able';

  // life cycle hook
  ngOnInit() {
    // Clear authentication token on app start to require fresh login
    this.appService.logout();

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
