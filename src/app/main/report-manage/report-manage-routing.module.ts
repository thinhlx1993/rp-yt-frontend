import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReportManageComponent} from './report-manage.component';

const routes: Routes = [
  {
    path: '',
    component: ReportManageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {
}
