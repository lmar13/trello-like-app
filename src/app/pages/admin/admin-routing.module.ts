import { AdminComponent } from './admin.component';
import { Routes, RouterModule } from "@angular/router";

import { NgModule } from "@angular/core";
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [{
  path: '',
  component: AdminComponent,
  children: [
    {
      path: 'users',
      component: UserListComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
}
