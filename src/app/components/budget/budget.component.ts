import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import {ApexChart, ApexNonAxisChartSeries,ApexDataLabels, ApexTitleSubtitle } from 'ng-apexcharts';	
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable,tap,map } from 'rxjs';
@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
})
export class BudgetComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;
  myVariable: any;
  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.user$
      .pipe(
        tap((totalBudget) => {
          this.myVariable = totalBudget?.totalBudget;
        }),
        map((totalBudget) => {
          return [50, 20, this.myVariable] ;
        }),
        untilDestroyed(this)
      )
      .subscribe((chartSeries) => {
        this.chartSeries = chartSeries;        
      });
  }

  chartSeries: ApexNonAxisChartSeries = [];
  chartDetails: ApexChart = {
    type: 'pie',
    toolbar: {
      show: true,
    },
  };

}

