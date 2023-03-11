import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import {ApexChart, ApexNonAxisChartSeries,ApexDataLabels, ApexTitleSubtitle,ApexOptions,ApexAnnotations,ApexPlotOptions } from 'ng-apexcharts';	
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable,tap,map,switchMap } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { Expenditure } from 'src/app/models/expenditure.model';
interface GroupedExpenditures {
  [key: string]: number;
}
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
                console.log(expenditures.map((expenditure) => expenditure.amount));
                const groupedExpenditures = expenditures.reduce((accumulator: GroupedExpenditures, currentValue) => {
                  if (accumulator[currentValue.type]) {
                    accumulator[currentValue.type] += currentValue.amount;
                  } else {
                    accumulator[currentValue.type] = currentValue.amount;
                  }
                  return accumulator;
                }, {});
                this.values = Object.values(groupedExpenditures);
                this.textlabels = Object.keys(groupedExpenditures);
                //this.chartPlot.pie!.donut!.labels!.total!.formatter! = `Total: $${this.values.reduce((a, b) => a + b, 0)}`;
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
    type: 'donut',
    toolbar: {
      show: true,
    },
  };
  chartOptions: ApexDataLabels = {
      enabled: true,
      formatter: function (val, opts) {
        return  `$${opts.w.config.series[opts.seriesIndex]}`;
        
      },
      
      
  
}
public chartPlot: ApexPlotOptions = {
  pie: {
    donut: {
      labels: {
        show: true,
        total:{
          show: true,
          showAlways: true,
          fontSize: "24px",
          color: "purple"
        },
        value:{
          show: true,
          color: "purple",
          formatter: function (val) {
            return  `$${val}`;
            
          }
        }
      }
    }
  }

};


  
  chartLabels: string[] = [];
  getExpenditure(): Observable<Expenditure[] | null>{
      return this.usersService.getExpenditures();

  }
}

