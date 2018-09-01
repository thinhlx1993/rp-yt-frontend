import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewsManageRoutingModule } from './views-manage-routing.module';
import {CreateEditViewsComponent, DeleteViewsComponent, ViewsManageComponent} from './views-manage.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PageModule} from '../../core/common/page/page.module';
import {AspectRatioModule} from '../../core/common/aspect-ratio/aspect-ratio.module';
import {MomentModule} from 'ngx-moment';
import {MaterialModule} from '../../core/common/material-components.module';

@NgModule({
  imports: [
    CommonModule,
    ViewsManageRoutingModule,

    // Core
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PageModule,
    AspectRatioModule,
    MomentModule
  ],
  declarations: [ViewsManageComponent, CreateEditViewsComponent , DeleteViewsComponent],
  entryComponents: [CreateEditViewsComponent , DeleteViewsComponent]

})
export class ViewsManageModule { }
