import { Component, OnInit } from '@angular/core';
import { Goal } from 'src/app/models/goal.model';
import { FormGroup,FormControl,FormControlName,Validators, FormBuilder } from '@angular/forms'
import { HotToastService } from '@ngneat/hot-toast';
import { uuidv4 } from '@firebase/util';
import { UsersService } from 'src/app/services/users.service';

import { map } from 'rxjs';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-add-goal-dialog',
  templateUrl: './add-goal-dialog.component.html',
  styleUrls: ['./add-goal-dialog.component.css']
})
export class AddGoalDialogComponent implements OnInit {
  goalform: FormGroup;
  goal: Goal = {name:'',date: '',id: '',notes:''}
  constructor(private fb: FormBuilder, private toast: HotToastService, private usersService: UsersService, private dialogRef: MatDialogRef<AddGoalDialogComponent>) { 
    this.goalform = this.fb.group({
      name: ['',Validators.required],
      date: ['',Validators.required],
      notes: [''],
      id: ['']
    })
  }

  ngOnInit(): void {
  }
  user$ = this.usersService.currentUserProfile$;
onSubmit(){
  if(this.goalform.valid){
    const data = {
      name: this.goalform.get('name')?.value,
      date: this.goalform.get('date')?.value,
      notes: this.goalform.get('notes')?.value,
      id: uuidv4()
    }
    this.goal.name = data.name;
    this.goal.date = data.date;
    this.goal.notes = data.notes;
    this.goal.id = data.id;
  }
  let userid;
  this.user$.pipe(map(user =>{
    if(user){
      userid = user.uid;
      return this.usersService.addGoal(userid, this.goal);
    }else{
      return null;
    }
  }),this.toast.observe({
    success: 'Goal Added Successfully',
    loading: 'Adding goal',
    error: ({message})=> `${message}`
  })).subscribe();
  this.dialogRef.close();
}
}
