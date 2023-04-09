import { Component, OnInit,Inject } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms'
import { Goal } from 'src/app/models/goal.model';
import { HotToastService } from '@ngneat/hot-toast';
import { UsersService } from 'src/app/services/users.service';
import { MatDialog,MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';



import { map} from 'rxjs';
import { ConfirmDialogComponent } from '../../planner/planner-dialogs/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-accomplishment-dialog',
  templateUrl: './accomplishment-dialog.component.html',
  styleUrls: ['./accomplishment-dialog.component.css']
})
export class AccomplishmentDialogComponent implements OnInit {

  goalform: FormGroup;
  accomplishment: Goal = {name:'',date: '',id: '',notes:''}
  accomplishmentcopy: Goal = {name:'',date:'',id:'',notes:''}
  constructor(private fb: FormBuilder, private toast: HotToastService, private usersService: UsersService, private dialogRef: MatDialogRef<AccomplishmentDialogComponent>,@Inject(MAT_DIALOG_DATA) public goalgetter: Goal, private dialog: MatDialog) { 
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
      this.accomplishment.name = data.name;
      this.accomplishment.date = data.date;
      this.accomplishment.notes= data.notes;
      this.accomplishment.id = data.id;

      let userid;
      this.usersService.currentUserProfile$.pipe( map(user =>{
        if(user){
          userid = user.uid;
          return this.usersService.editAccomplishment(userid,this.accomplishment.id,this.accomplishment)
        }else{
          return null;
        
      
     } }),
      this.toast.observe({
        success: 'Accomplishment updated Successfully',
        loading: 'Updating Accomplishment...',
        error: ({message}) => `${message}`
      })
      ).subscribe()
      this.dialogRef.close(data);
  }
 
}
  deleteAccomplishment(){
    let userid;

    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) =>{
      if(result){
        this.usersService.currentUserProfile$.pipe(map(user=>{
          if(user){
            userid = user.uid;
            this.accomplishmentcopy.id = this.goalform.get('id')?.value;
            return this.usersService.deleteAccomplishment(userid,this.accomplishmentcopy.id)
          }
          else{
            return null;
          }
        })).subscribe(() =>{
          this.toast.success('Accomplishment deleted successfully');
          this.dialogRef.close();
        },
        error =>{
          this.toast.error(error.message);
        })
      }
    })
  }

}
