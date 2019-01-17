import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AccConfirmComponent } from './acc-confirm/acc-confirm.component';
import { AccRecoveryComponent } from './acc-recovery/acc-recovery.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { NbAuthComponent } from '@nebular/auth';

const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'signup',
        component: SignUpComponent
      },
      {
        path: 'confirm',
        component: AccConfirmComponent
      },
      {
        path: 'recovery',
        component: AccRecoveryComponent
      },
      {
        path: 'change',
        component: ChangePassComponent
      },
    ]
  },

];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}

export const components = [
  LoginComponent,
  SignUpComponent,
  AccConfirmComponent,
  AccRecoveryComponent,
  ChangePassComponent
];
