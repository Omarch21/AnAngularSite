import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEvent } from 'src/app/models/calendarEvent.model';
import { FormGroup, FormBuilder, Validators} from '@angular/forms'
import { AuthService } from 'src/app/services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UsersService } from 'src/app/services/users.service';
import { map, tap} from 'rxjs';
import { uuidv4 } from '@firebase/util';
import {DatePipe } from '@angular/common'
@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-event-dialog.component.html',
  styleUrls: ['./add-event-dialog.component.css']
})
export class AddEventDialogClickComponent {

  event: CalendarEvent = {id:'',title:'',date: ''};
  form: FormGroup;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddEventDialogClickComponent>, private usersService: UsersService, private authService: AuthService, private toast: HotToastService, private datePipe:DatePipe, @Inject(MAT_DIALOG_DATA) eventParameter: CalendarEvent){
 // const formdate = this.datePipe.transform(eventParameter.date,'yyyy-MM-dd hh-mm-ss');
    const formdate =this.datePipe.transform(eventParameter.date,'yyyy-MM-ddTHH:mm');
    console.log(formdate);
    this.form = this.fb.group({
      title: ['hi',Validators.required],
      date: [formdate,Validators.required]
    })
  }
  
  user$ = this.usersService.currentUserProfile$;
  onSubmit(){
    if(this.form.valid){
      const data ={
        title:this.form.get('title')?.value,
        date: this.form.get('date')?.value,
        id: uuidv4(),
      }
      const datestr = this.datePipe.transform(data.date,'yyyy-MM-dd');
      console.log(datestr);
      if(datestr){
      this.event.date = data.date;
      this.event.title= data.title;
      this.event.id = data.id;
      }
      let userid;
      console.log(this.event.date);
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
