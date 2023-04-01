import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'src/app/models/calendarEvent.model';
import { FormGroup, FormBuilder, Validators} from '@angular/forms'
import { AuthService } from 'src/app/services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UsersService } from 'src/app/services/users.service';
import { map, tap} from 'rxjs';
import { uuidv4 } from '@firebase/util';
@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-event-dialog.component.html',
  styleUrls: ['./add-event-dialog.component.css']
})
export class AddEventDialogComponent {

  event: CalendarEvent = {id:'',title:'',date: new Date()};
  form: FormGroup;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddEventDialogComponent>, private usersService: UsersService, private authService: AuthService, private toast: HotToastService){
    
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
