import { Component, OnInit,Inject } from '@angular/core';
import { CalendarOptions,EventInput,CustomButtonInput,EventApi,EventSourceInput,Calendar,DateSelectArg } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import { FullCalendarComponent } from '@fullcalendar/angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, UntypedFormControl, UntypedFormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CalendarEvent } from 'src/app/models/calendarEvent.model';
import { UsersService } from 'src/app/services/users.service';
import { uuidv4 } from '@firebase/util';
import { AuthService } from 'src/app/services/auth.service';
import { map,tap } from 'rxjs/operators'
import { ConfirmDialogComponent } from './planner-dialogs/confirm-dialog/confirm-dialog.component';
import { HotToastService } from '@ngneat/hot-toast';
import { untilDestroyed } from '@ngneat/until-destroy';

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
    const eventDialog = this.dialog.open(UpdateEventForm, {
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
    const dialogRef = this.dialog.open(AddEventForm);
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.addingEvent(result.title,result.date);
      }
    })
  }
}
 
@Component({
    selector: 'add-event-form',
    template: `
    <div>
    <h2> Add Event</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <mat-form-field>
    <input matInput placeholder = "Enter Title" formControlName = "title" required style="color: black">
    </mat-form-field>
    <mat-form-field>
    <input matInput type="date" placeholder="Enter Date" formControlName="date" required style="color: black">
    </mat-form-field>
    <div>
    <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid"> Submit </button>
    <button mat-raised-button style="background-color: red;color:white" mat-dialog-close> Cancel </button>
   </div>
    </form>
    </div>
    
    `,
})
export class AddEventForm{
  event: CalendarEvent = {id:'',title:'',date: new Date()};
  form: FormGroup;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddEventForm>, private usersService: UsersService, private authService: AuthService, private toast: HotToastService){
    
    this.form = this.fb.group({
      title: ['',Validators.required],
      date: ['',Validators.required]
    })
  }
  
  user$ = this.usersService.currentUserProfile$;
  onSubmit(){
    if(this.form.valid){
      const data ={
        title:this.form.get('title')?.value,
        date:this.form.get('date')?.value
      }
      this.event.date = data.date;
      this.event.title= data.title;
      this.event.id = uuidv4();
      let userid;
      this.user$.pipe( map(user => {
        if(user){
        userid = user.uid;
        console.log(this.event, userid);
        return this.usersService.addEvent(userid, this.event);
        }else{
          return null
        }
      }),
      this.toast.observe({
        success: 'Event added successfully',
        loading: 'adding event...',
        error: ({message})=> `${message}`
      })
      ).subscribe();
     
     
      this.dialogRef.close(data);
    }
  }
}
@Component({
  selector: 'update-event-form',
  template: `
  <div>
  <h2> Update Event</h2>
  <form [formGroup]="updateform" (ngSubmit)="onSubmitUpdate()">
  <mat-form-field>
  <input matInput placeholder = "Enter Title" formControlName = "title" required style="color: black">
  </mat-form-field>
  <mat-form-field>
  <input matInput type="date" placeholder="Enter Date" formControlName="date" required style="color: black">
  </mat-form-field>
  <div>
  <button mat-raised-button color="primary" type="submit" [disabled]="updateform.invalid"> Update </button>
  <button mat-raised-button style="background-color: red;color:white" mat-dialog-close> Cancel </button>
  
 </div>
  </form>
  <button mat-raised-button style = "background-color: red; color: white" (click)="deleteEvent()"> Delete </button>
  </div>
  
  `
})
export class UpdateEventForm{
event: CalendarEvent = {id:'',title:'',date: new Date()};
eventcopy: CalendarEvent = {id:'', title: '', date: new Date()};
updateform: FormGroup;
newevent: CalendarEvent = {id: '', title: '', date: new Date()}
constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<UpdateEventForm>, private usersService: UsersService, private authService: AuthService, private toast: HotToastService, @Inject(MAT_DIALOG_DATA) public eventParameter: CalendarEvent, private dialog: MatDialog){
  this.updateform = this.fb.group({
    title: [eventParameter.title,Validators.required],
    date: [eventParameter.date,Validators.required],
    id: [eventParameter.id]
  })
}

user$ = this.usersService.currentUserProfile$;
onSubmitUpdate(){
  if(this.updateform.valid){
    const data ={
      title:this.updateform.get('title')?.value,
      date:this.updateform.get('date')?.value,
      id: this.updateform.get('id')?.value
    }
    this.event.date = data.date;
    this.event.title= data.title;
    this.event.id = data.id;
    let userid;
    this.user$.pipe( map(user => {
      if(user){
      userid = user.uid;
      console.log(this.event, userid);
      return this.usersService.editEvent(userid, data.id,this.event);
      }else{
        return null
      }
    }),
    this.toast.observe({
      success: 'Event updated successfully',
      loading: 'updating event...',
      error: ({message})=> `${message}`
    })
    ).subscribe();
   
   
    this.dialogRef.close(data);
  }
}
deleteEvent(){
  let userid;

  const dialogRef = this.dialog.open(ConfirmDialogComponent);
  dialogRef.afterClosed().subscribe((result) =>{
    if(result){
  this.user$.pipe(map(user=>{
    if(user){
      userid = user.uid;
      this.eventcopy.id = this.updateform.get('id')?.value;
      return this.usersService.deleteEvent(userid, this.eventcopy.id);
    }
    else{
      return;
    }
  })).subscribe(
    () => {
      this.toast.success('Event deleted successfully');
      this.dialogRef.close();
    },
    error =>{
      this.toast.error(error.message);
    }
      );
  }
    })
 
}

}