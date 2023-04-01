import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LandingComponent } from './components/landing/landing.component';
import { EditExpenditureComponent } from './components/edit-expenditure/edit-expenditure.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { BudgetComponent } from './components/budget/budget.component';
import { ExpendituresComponent } from './components/expenditures/expenditures.component';
import { HelpPageComponent } from './components/help-page/help-page.component';
import { PlannerComponent } from './components/planner/planner.component';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { ProfileComponent } from './components/profile/profile.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent,
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'home',
    component: HomeComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'budget',
    component: BudgetComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'budget/expenditures',
    component: ExpendituresComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'profile',
    component: ProfileComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'help',
    component: HelpPageComponent
  },
  {
    path: 'budget/expenditures/info/:id',
    component: EditExpenditureComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'planner',
    component:  PlannerComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
