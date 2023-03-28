import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { UntypedFormControl, UntypedFormGroup, FormGroup, FormControl,Validators } from '@angular/forms';
import { negativeExpenditure } from '../expenditures/expenditures.component';
import { Expenditure } from 'src/app/models/expenditure.model';
import { untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HotToastService } from '@ngneat/hot-toast';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
interface ExpenditureType{
  type: string;
  
}
@Component({
  selector: 'app-edit-expenditure',
  templateUrl: './edit-expenditure.component.html',
  styleUrls: ['./edit-expenditure.component.css']
})
export class EditExpenditureComponent implements OnInit {
  expenditure: Expenditure = {Type: '',Amount: 0,Date: '10-10-1000',Notes: "notes", id: "1000", dateinserted: new Date()};
  user$ = this.usersService.currentUserProfile$
  expenditures: ExpenditureType[] = [
    {type: 'Bill'},
    {type: 'Groceries'},
    {type: 'Personal Use'},
    {type: 'Gasoline'},
    {type: 'Rent'},
    {type: 'Other'}
  
  ]
  
 expenditureForm = new UntypedFormGroup({
    Type:new FormControl<String | null>(null, Validators.required),
    Amount: new FormControl(null,[Validators.required, negativeExpenditure()]),
    Date: new FormControl(''),
    Notes: new FormControl('')
});
  constructor(private usersService: UsersService, private datePipe: DatePipe, private toast: HotToastService, private route: ActivatedRoute, private router: Router, private auth: Auth ) { }

  ngOnInit(): void {
    const expenditureId = this.route.snapshot.paramMap.get('id')!;
    this.usersService
      .getExpenditureById(expenditureId)
      .subscribe(
        (expenditure) => {
          console.log('Expenditure:', expenditure);
          const expenditureType = this.expenditures.find(
            (type) => type.type === expenditure.Type
          );
          if (expenditureType) {
            this.expenditureForm
              .get('Type')
              ?.setValue(expenditureType);
          }
          if(expenditure.Date){
            this.expenditureForm.patchValue({
              Amount: expenditure.Amount,
              Date: this.datePipe.transform(expenditure.Date, 'yyyy-MM-dd'),
              Notes: expenditure.Notes
            });
          
        }
        },
        (error) => {
          console.log('Error getting expenditure:', error);
        }
      );
  }

  saveExpenditure() {
    if (!this.expenditureForm.valid) {
      return;
    }
    const expenditureData = this.expenditureForm.value;
    expenditureData.Date = this.datePipe.transform(expenditureData.Date, 'MM-dd-yyyy');
    expenditureData.Type = this.expenditureForm.get('Type')?.value.type;
    const expenditureId = this.route.snapshot.paramMap.get('id')!;
    this.usersService
      .updateExpenditure(expenditureId,expenditureData)
      .pipe(
        this.toast.observe({
          loading: 'Saving expenditure data...',
          success: 'Expenditure updated successfully',
          error: 'There was an error in updating the expenditure',
        }),
        tap(() => {
          this.router.navigate(['/budget']);
        })
      )
      .subscribe();
  }
  deleteExpenditure(){
    const expenditureId = this.route.snapshot.paramMap.get('id')!;
    const id = this.auth.currentUser?.uid;
    console.log(id);
    if(confirm('Are you sure you want to delete expenditure?')){
    this.usersService
    .deleteExpenditure(id!,expenditureId)
    .then(()=> {
      this.toast.success("Expenditure Deleted successfuly");
      this.router.navigate(['/budget']);
    }).catch(error =>{
      this.toast.error("There was an error")
    })
      

}
  }
  }

