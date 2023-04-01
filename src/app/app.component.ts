import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { ApexGrid, ColumnConfiguration } from 'apex-grid';
import { CalendarOptions } from '@fullcalendar/core';





import dayGridPlugin from  '@fullcalendar/daygrid'
ApexGrid.register();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin]
  };
  user$ = this.usersService.currentUserProfile$;

 
  
  constructor(
    private authService: AuthService,
    public usersService: UsersService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
