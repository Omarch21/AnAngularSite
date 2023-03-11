import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,UntypedFormGroup,Validators,AbstractControl,ValidationErrors,ValidatorFn } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, tap } from 'rxjs';
import { Expenditure } from 'src/app/models/expenditure.model';
import { Router } from '@angular/router';

import { UsersService } from 'src/app/services/users.service';
interface ExpenditureType{
  type: string;

}
export function negativeExpenditure(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const amount = control.value;
    console.log('Amount:', amount);

    if (amount && amount < 0) {
      return { negativeAmount: true };
    } else {
      return null;
    }
  };
}
@UntilDestroy()

@Component({
  selector: 'app-expenditures',
  templateUrl: './expenditures.component.html',
  styleUrls: ['./expenditures.component.css'],
})
export class ExpendituresComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;

  expenditureForm = new UntypedFormGroup({
    uid: new FormControl(null),
    expenditureType:new FormControl<ExpenditureType | null>(null, Validators.required),
    expenditureAmount: new FormControl(null,[Validators.required, negativeExpenditure()]),
    expenditureDate: new FormControl(''),
    expenditureNotes: new FormControl('')
});

  constructor(

    private toast: HotToastService,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usersService.currentUserProfile$
      .pipe(untilDestroyed(this), tap(console.log))
      .subscribe((user) => {
        this.expenditureForm.patchValue({ ...user });
      });
  }
  
  
expenditures: ExpenditureType[] = [
  {type: 'Bill'},
  {type: 'Groceries'},
  {type: 'Personal Use'},
  {type: 'Gasoline'},
  {type: 'Rent'},
  {type: 'Other'}

]

  saveExpenditure() {
    if (!this.expenditureForm.valid) {
      return;
    }

    const expenditure: Expenditure = {
      type: this.expenditureForm.get('expenditureType')?.value?.type ?? 'Bill',
      amount: this.expenditureForm.get('expenditureAmount')?.value ?? 0,
      date: this.expenditureForm.get('expenditureDate')?.value ? new Date(this.expenditureForm.get('expenditureDate')?.value) : new Date(),
      notes: this.expenditureForm.get('expenditureNotes')?.value ?? ''
    };
  
    const userId = this.expenditureForm.get('uid')?.value;
   this.usersService
    .addExpenditures(userId, [expenditure])
    .then(()=>{
      this.toast.success('Expenditure added to account');
      this.router.navigate(['/budget']);
    }
    ).catch((error) => {
      console.error(error);
      this.toast.error("There was an error adding expenditure");
    })
   

    };
  
    // set the `expenditure` field in the form with the `expenditure` object
   
  
  
  
}
