import { Component, OnInit,Inject } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms'
import { Goal } from 'src/app/models/goal.model';
import { HotToastService } from '@ngneat/hot-toast';
import { UsersService } from 'src/app/services/users.service';
import { MatDialog,MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';



import { map} from 'rxjs';
import { ConfirmDialogComponent } from '../../planner/planner-dialogs/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogComponent2 } from '../accomplishment-dialog/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-update-goal-dialog',
  templateUrl: './update-goal-dialog.component.html',
  styleUrls: ['./update-goal-dialog.component.css']
})
export class UpdateGoalDialogComponent implements OnInit {

  goalform: FormGroup;
  goal: Goal = {name:'',date: '',id: '',notes:''}
  goalcopy: Goal = {name:'',date:'',id:'',notes:''}
  constructor(private fb: FormBuilder, private toast: HotToastService, private usersService: UsersService, private dialogRef: MatDialogRef<UpdateGoalDialogComponent>,@Inject(MAT_DIALOG_DATA) public goalgetter: Goal, private dialog: MatDialog) { 
    this.goalform = this.fb.group({
      name: [goalgetter.name,Validators.required],
      date: [goalgetter.date,Validators.required],
      notes: [goalgetter.notes],
      id: [goalgetter.id]
    })
  }

  ngOnInit(): void {
  }
  onSubmitUpdate(){
    if(this.goalform.valid){
      const data={
        name: this.goalform.get('name')?.value,
        date: this.goalform.get('date')?.value,
        notes: this.goalform.get('notes')?.value,
        id: this.goalform.get('id')?.value
      }
      this.goal.name = data.name;
      this.goal.date = data.date;
      this.goal.notes= data.notes;
      this.goal.id = data.id;

      let userid;
      this.usersService.currentUserProfile$.pipe( map(user =>{
        if(user){
          userid = user.uid;
          return this.usersService.editGoal(userid,this.goal.id,this.goal)
        }else{
          return null;
        
      
     } }),
      this.toast.observe({
        success: 'Goal updated Successfully',
        loading: 'Updating Goal...',
        error: ({message}) => `${message}`
      })
      ).subscribe()
      this.dialogRef.close(data);
  }
 
}
  deleteGoal(){
    let userid;

    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) =>{
      if(result){
        this.usersService.currentUserProfile$.pipe(map(user=>{
          if(user){
            userid = user.uid;
            this.goalcopy.id = this.goalform.get('id')?.value;
            return this.usersService.deleteGoal(userid,this.goalcopy.id)
          }
          else{
            return null;
          }
        })).subscribe(() =>{
          this.toast.success('Goal deleted successfully');
          this.dialogRef.close();
        },
        error =>{
          this.toast.error(error.message);
        })
      }
    })
  }
  accomplishGoal(){
    let userid;

    const dialogRef = this.dialog.open(ConfirmDialogComponent2);
    dialogRef.afterClosed().subscribe((result) =>{
      if(result){
        this.usersService.currentUserProfile$.pipe(map(user=>{
          if(user){
            userid = user.uid;
            this.goalcopy.id = this.goalform.get('id')?.value;
            this.goalcopy.name = this.goalform.get('name')?.value;
            this.goalcopy.date = this.goalform.get('date')?.value;
            this.goalcopy.notes = this.goalform.get('notes')?.value;
            return this.usersService.accomplishGoal(userid,this.goalcopy)
          }
          else{
            return null;
          }
        })).subscribe(() =>{
          this.toast.success('Goal accomplished successfully');
          this.dialogRef.close();
        },
        error =>{
          this.toast.error(error.message);
        })
      }
    })
  }
}
