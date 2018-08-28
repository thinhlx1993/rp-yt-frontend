import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewsManageComponent } from './views-manage.component';

const routes: Routes = [
  {
    path: '',
    component: ViewsManageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewsManageRoutingModule {
}
