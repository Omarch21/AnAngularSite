import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,UntypedFormGroup,Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, tap } from 'rxjs';
import { ProfileUser } from 'src/app/models/user';
import { Expenditure } from 'src/app/models/expenditure.model';

import { UsersService } from 'src/app/services/users.service';
interface ExpenditureType{
  type: string;

}

@UntilDestroy()

@Component({
  selector: 'app-profile',
  templateUrl: './expenditures.component.html',
  styleUrls: ['./expenditures.component.css'],
})
export class ExpendituresComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;

  expenditureForm = new UntypedFormGroup({
    uid: new FormControl(null),
    expenditureType:new FormControl<ExpenditureType | null>(null, Validators.required),
    expenditureAmount: new FormControl(0),
    expenditureDate: new FormControl(''),
    expenditureNotes: new FormControl('')
  });

  constructor(

    private toast: HotToastService,
    private usersService: UsersService
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
  {type: 'Rent'}

]

  saveProfile() {
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
      this.toast.success('Image uploaded successfully');
    }
    ).catch((error) => {
      console.error(error);
      this.toast.error("There was an error in updating the profile");
    })
   

    };
  
    // set the `expenditure` field in the form with the `expenditure` object
   
  
  
  
}
