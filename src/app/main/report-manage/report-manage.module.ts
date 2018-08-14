import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReportManageComponent} from './report-manage.component';
import {ReportRoutingModule} from './report-manage-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReportRoutingModule
  ],
  declarations: [ReportManageComponent]
})
export class ReportManageModule { }
