import { Component, OnInit, Inject } from '@angular/core';
import { CalendarEvent } from 'src/app/models/calendarEvent.model';
import { FormGroup, FormBuilder, Validators} from '@angular/forms'
import { MatDialogRef,MatDialogModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UsersService } from 'src/app/services/users.service';
import { map, tap} from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-event-dialog.component.html',
  styleUrls: ['./update-event-dialog.component.css']
})
export class UpdateEventDialogComponent {
  event: CalendarEvent = {id:'',title:'',date: ''};
  eventcopy: CalendarEvent = {id:'', title: '', date: ''};
  updateform: FormGroup;
  newevent: CalendarEvent = {id: '', title: '', date: ''}
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<UpdateEventDialogComponent>, private usersService: UsersService, private authService: AuthService, private toast: HotToastService, @Inject(MAT_DIALOG_DATA) public eventParameter: CalendarEvent, private dialog: MatDialog){
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

