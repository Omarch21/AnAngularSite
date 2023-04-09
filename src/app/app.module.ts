import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { BudgetComponent } from './components/budget/budget.component';
import { HomeComponent } from './components/home/home.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { HotToastModule } from '@ngneat/hot-toast';
import { LandingComponent } from './components/landing/landing.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { ProfileComponent } from './components/profile/profile.component';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ExpendituresComponent } from './components/expenditures/expenditures.component';
import { HelpPageComponent } from './components/help-page/help-page.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EditExpenditureComponent } from './components/edit-expenditure/edit-expenditure.component';
import { DatePipe } from '@angular/common';
import { PlannerComponent } from './components/planner/planner.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FullCalendarModule } from '@fullcalendar/angular';




//import { AddEventForm } from './components/planner/planner.component';
import { MatDialogModule } from '@angular/material/dialog';
//import { UpdateEventForm } from './components/planner/planner.component';


import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './components/planner/planner-dialogs/confirm-dialog/confirm-dialog.component';
import { UpdateEventDialogComponent } from './components/planner/planner-dialogs/update-event-dialog/update-event-dialog.component';
import { AddEventDialogComponent } from './components/planner/planner-dialogs/add-event-dialog/add-event-dialog.component';
import { AddEventDialogClickComponent } from './components/planner/planner-dialogs/add-event-dialog/add-event-dialog-click.component';
import { AddGoalDialogComponent } from './components/home/add-goal-dialog/add-goal-dialog.component';
import { UpdateGoalDialogComponent } from './components/home/update-goal-dialog/update-goal-dialog.component';
import { AccomplishmentDialogComponent } from './components/home/accomplishment-dialog/accomplishment-dialog.component';





@NgModule({
  declarations: [

    AppComponent,
    LoginComponent,
    SignUpComponent,
    LandingComponent,
    HomeComponent,
    ProfileComponent,
    BudgetComponent,
    ExpendituresComponent,
    HelpPageComponent,
    EditExpenditureComponent,
    PlannerComponent,
    ConfirmDialogComponent,
    UpdateEventDialogComponent,
    AddEventDialogComponent,
    AddEventDialogClickComponent,
    AddGoalDialogComponent,
    UpdateGoalDialogComponent,
    AccomplishmentDialogComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    HotToastModule.forRoot(),
    MatMenuModule,
    NgApexchartsModule,
    MatSelectModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FullCalendarModule,
    FormsModule,
    MatDialogModule
  ],
  providers: [ DatePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
