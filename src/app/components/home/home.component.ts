import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import { UsersService } from 'src/app/services/users.service';
import{ switchMap } from 'rxjs';
import { CalendarOptions } from '@fullcalendar/core';

import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';
import { tap } from 'rxjs';
import { CalendarEvent } from 'src/app/models/calendarEvent.model';
import { ApexOptions,ApexNonAxisChartSeries,ApexChart } from 'ng-apexcharts';
import { Expenditure } from 'src/app/models/expenditure.model';
import { ApexGrid } from 'apex-grid';
import { ColumnConfiguration } from 'apex-grid';

import { Goal } from 'src/app/models/goal.model';
import { MatDialog } from '@angular/material/dialog';
import { AddGoalDialogComponent } from './add-goal-dialog/add-goal-dialog.component';
import { html } from 'lit';
import { UpdateGoalDialogComponent } from './update-goal-dialog/update-goal-dialog.component';
import { AccomplishmentDialogComponent } from './accomplishment-dialog/accomplishment-dialog.component';
ApexGrid.register();
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {
  
  user$ = this.usersService.currentUserProfile$;
  expenditures$ = this.usersService.getExpenditures();
  goal$ = this.usersService.getGoals();
  goals: Goal[] = [];
  public count = 0;
  expenditureTotal$: any;
  accomplishments: Goal[] = [];
  calendarEvents: CalendarEvent[] = [];
  calendarData: number[] = [];
  expenditures: Expenditure[] = [];
  num: number[] = [];
  dates: string[] = [];
  constructor(private usersService: UsersService, private auth: AuthService, private dialog: MatDialog) {}
  calendarOptions: CalendarOptions = {
    initialView: 'listWeek',
    plugins: [dayGridPlugin, interactionPlugin,listPlugin],
    selectable: true,
    height: 500,
    views:{
      listMonth: { buttonText: 'Month View'},
      listWeek: {buttonText: 'Week View'}
    },
    headerToolbar:{
      start: 'listMonth,listWeek',
      center: 'title',
      end:'today prev,next'
    },
    events:[]
  };
chartOptions: ApexChart = {
  type: 'area',

}
options: ApexOptions = {

  
}
chartInfo: ApexNonAxisChartSeries= [];
column: ColumnConfiguration<Goal>[] = [
  { key: 'name', headerText: "Goals",type: 'string', sort: {comparer: (a, b) => a.length - b.length },filter: true,width: '28%'},
  { key: 'date', headerText: "Date",type: 'string', sort: true,filter: true,width: '28%'},
  { key: 'notes', headerText: "Notes", type: 'string',  sort: true,filter: true,width: '28%'},
  { key: 'id', headerText: "edit", cellTemplate: ({ value,row }) => html`<button <button style="background-color: purple; color: #fff; border: none; border-radius: 4px; padding: 8px 12px; font-size: 12px;" @click="${() => this.openUpdateDialog(value)}">Edit</button> <style> button:active{transform: translateY(2px);}`, width: '16%'}
];
accomplishmentscolumn: ColumnConfiguration<Goal>[] = [
  { key: 'name', headerText: "Accomplishments",type: 'string', sort: {comparer: (a, b) => a.length - b.length },filter: true,width: '28%'},
  { key: 'date', headerText: "Date", type: 'string', sort: true,filter: true,width: '28%'},
  { key: 'notes', headerText: "Notes", type: 'string',  sort: true,filter: true,width: '28%'},
  { key: 'id', headerText: "edit", cellTemplate: ({ value,row }) => html`    <button style="background-color: purple; color: #fff; border: none; border-radius: 4px; padding: 8px 12px; font-size: 12px;"
  @click="${() => this.openAccomplishmentDialog(value)}">Edit</button> <style> button:active{transform: translateY(2px);};
    transform: translateY(2px);}`, width: '16%'}
];
  ngOnInit(): void {
    
    
      console.log(this.count);
    this.usersService.currentUserProfile$.subscribe(user =>{
      console.log('fetching');
   
    
        console.log(this.count);
      this.usersService.getGoals().pipe(
        tap((goals) =>{
          if(goals){
            this.goals = goals;
            console.log('got');
          }
        })
      ).subscribe()
      
    //  this.count++;
      if(!user?.uid){
        throw new Error('error');
      }
      this.expenditureTotal$ = this.usersService.getExpenditureTotal(user.uid);
    })
    this.usersService.currentUserProfile$.subscribe(user =>{
      console.log('fetching 2');
   
    
        console.log(this.count);
      this.usersService.getAccomplishments().pipe(
        tap((accomplishments) =>{
          if(accomplishments){
            this.accomplishments = accomplishments;
            console.log('got 2');
          }
        })
      ).subscribe()
      
    //  this.count++;
      if(!user?.uid){
        throw new Error('error');
      }
      this.expenditureTotal$ = this.usersService.getExpenditureTotal(user.uid);
    })
  this.count = 0;
    this.usersService.getExpenditures().pipe(
      tap((expenditures) =>{
        if(expenditures){
        this.expenditures = expenditures;
        this.expenditures.sort((a,b) =>{
          if(a.Date! < b.Date!){
            return -1;
          }
          else if(a.Date! > b.Date!){
            return 1;
          }
          else{
            return 0;
          }
         })
         this.num = this.expenditures.map((nums) => nums.Amount);
         this.dates = this.expenditures.map((numstime) => numstime.Date!)
        console.log(this.num);
          this.options = {
            series: [{
              data: this.num,
              name: "Expenditure Amount",
              color: "purple",
          }],
          chart:{
            type: "area",
          },
      
          xaxis:{
            type: "datetime"
          },
          dataLabels:{
            enabled:false
          },
          labels: this.dates,
          title: {
            text: 'Spent this month',
            align: 'center'
          },
          yaxis:{
            opposite: true
          }
          
          }
          }
        
      })
    ).subscribe()
 
    this.usersService.getEvents().pipe(
      tap((events) => {
        if(events){
          console.log(events);
          this.calendarEvents = events as CalendarEvent[];
          this.calendarOptions.events = [...this.calendarEvents];
        }else{
          console.log('Could not find events');
        }
      })
    ).subscribe()
     
  }

 openGoalDialog(){
  const dialogRef = this.dialog.open(AddGoalDialogComponent)
 }
 openUpdateDialog(goal:any){
  console.log(goal);
  const goalbyid = this.usersService.getGoalById(goal);
  console.log(goalbyid);

    console.log(this.count);
  goalbyid.pipe(
    tap((agoal)=> {
   
      if(this.count == 0){
    const dialogRef = this.dialog.open(UpdateGoalDialogComponent,{
      data: agoal
    });
    this.count++;
  }

  })
  ).subscribe()
  this.count = 0;
}
openAccomplishmentDialog(goal:any){
  console.log(goal);
  const goalbyid = this.usersService.getAccomplishmentById(goal);
  console.log(goalbyid);

    console.log(this.count);
  goalbyid.pipe(
    tap((agoal)=> {
   
      if(this.count == 0){
    const dialogRef = this.dialog.open(AccomplishmentDialogComponent,{
      data: agoal
    });
    this.count++;
  }

  })
  ).subscribe()
  this.count = 0;
}
}
