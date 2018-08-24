import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CreateEditReportComponent, DeleteChannelComponent, ReportManageComponent} from './report-manage.component';
import {ReportRoutingModule} from './report-manage-routing.module';
import {AspectRatioModule} from '../../core/common/aspect-ratio/aspect-ratio.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../core/common/material-components.module';
import {PageModule} from '../../core/common/page/page.module';
import {EmailService} from '../email/email.service';
import {MomentModule} from 'ngx-moment';
import {StrategyService} from '../strategy/strategy.service';
import {ReportService} from './report-manage.service';


@NgModule({
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    // Core
    PageModule,
    AspectRatioModule,
    MomentModule
  ],
  declarations: [ReportManageComponent, CreateEditReportComponent, DeleteChannelComponent],
  entryComponents: [CreateEditReportComponent, DeleteChannelComponent],
  providers: [EmailService, StrategyService, ReportService]
})
export class ReportManageModule { }
