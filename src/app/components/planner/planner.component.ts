import { Component, OnInit,Inject } from '@angular/core';
import { CalendarOptions,EventInput,CustomButtonInput,EventApi,EventSourceInput,Calendar,DateSelectArg } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import { FormGroup, UntypedFormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CalendarEvent } from 'src/app/models/calendarEvent.model';
import { UsersService } from 'src/app/services/users.service';
import { tap } from 'rxjs/operators'











import { AddEventDialogComponent } from './planner-dialogs/add-event-dialog/add-event-dialog.component';
import { UpdateEventDialogComponent } from './planner-dialogs/update-event-dialog/update-event-dialog.component';
@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css'],
})
export class PlannerComponent implements OnInit {
  calendarEvents: Event[] = [];
  public counter = 0;
  eventForm = new FormGroup({
    uid: new FormControl(null),
    date: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required])
  });
  constructor(private dialog: MatDialog, private datePipe: DatePipe, private usersService: UsersService) { }
 


  newEvents: EventInput[] = [];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],

    eventClick: this.updateEvent.bind(this),
    customButtons:{
      addEventButton:{
        text: 'Add Event',
        click: () => {
          this.openDialog();
        }
      }
    },
    height: 800,
    headerToolbar:{
      start: 'today prev,next',
      center: 'title',
      end: 'addEventButton'
    },
    events:[]
  };
  ngOnInit(): void {
    this.usersService.getEvents().pipe(
      tap((events) => {
        if(events){
          console.log(events);
          this.calendarEvents = events;
          this.calendarOptions.events = [...this.calendarEvents];
        }else{
          console.log('Could not find events');
        }
      })
    ).subscribe()
  }
  updateEvent(arg: any){

    if(arg.event.id){
   this.usersService.getEventById(arg.event.id).pipe(tap((event: CalendarEvent)=>{

    this.counter++;
    if(this.counter == 1){
    const eventDialog = this.dialog.open(UpdateEventDialogComponent, {
      data: event
    });
  }
  })
   )
   .subscribe(); 
    }
    this.counter = 0;
    }
  addingEvent(argTitle: string, argDate: Date){
    //console.log('hi');
    const newdate = this.datePipe.transform(argDate, 'yyyy-MM-dd');
    console.log(newdate);
    if(newdate){
    const newEvent: EventInput = {
      title: argTitle,
      date: newdate
    }
    this.calendarOptions.events = [...(this.calendarOptions.events as EventInput[]), newEvent];
  }
 
  }
  openDialog(){
    const dialogRef = this.dialog.open(AddEventDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.addingEvent(result.title,result.date);
      }
    })
  }
}
 
