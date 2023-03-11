import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import {ApexChart, ApexNonAxisChartSeries,ApexDataLabels, ApexTitleSubtitle } from 'ng-apexcharts';	
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable,tap,map,switchMap } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { Expenditure } from 'src/app/models/expenditure.model';
@UntilDestroy()
@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
})

export class BudgetComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;
  expen$ = this.usersService.getExpenditures();
  expenditures: Expenditure[] = [];
  values: number[] = [];
  textlabels: string[] = [];
  
  constructor(private usersService: UsersService, private firestore: Firestore, private auth: AuthService,) {

  }

  ngOnInit() {
    this.user$
      .pipe(
        switchMap((totalBudget) => {
          return this.usersService.getExpenditures().pipe(
            tap((expenditures) => {
              if (expenditures) {
                this.expenditures = expenditures;
                console.log(expenditures.map((expenditure) => expenditure.amount)); // log the array of expenditure amounts
                this.values = expenditures.map((expenditure) => expenditure.amount);
                this.textlabels = expenditures.map((expenditure) => expenditure.type);
              } else {
                console.log('No expenditures found.');
              }
            }),
            map((expenditures) => {
              return {
                values: this.values,
                textLabels: this.textlabels
              }
            })
          );
        }),
        untilDestroyed(this)
      )
      .subscribe((chartSeries) => {
        this.chartSeries = chartSeries.values;
        this.chartLabels = chartSeries.textLabels;
      });
      
  }

  chartSeries: ApexNonAxisChartSeries = [];
  chartDetails: ApexChart = {
    type: 'pie',
    toolbar: {
      show: true,
    },
  };
  chartLabels: string[] = [];
  getExpenditure(): Observable<Expenditure[] | null>{
      return this.usersService.getExpenditures();

  }
}

