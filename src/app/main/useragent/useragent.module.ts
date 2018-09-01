import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersAgentRoutingModule } from './useragent-routing.module';
import {CreateEditUsersAgentComponent, DeleteUserAgentComponent, UserAgentComponent} from './useragent.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PageModule} from '../../core/common/page/page.module';
import {AspectRatioModule} from '../../core/common/aspect-ratio/aspect-ratio.module';
import {MomentModule} from 'ngx-moment';
import {MaterialModule} from '../../core/common/material-components.module';

@NgModule({
  imports: [
    CommonModule,
    UsersAgentRoutingModule,

    // Core
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PageModule,
    AspectRatioModule,
    MomentModule
  ],
  declarations: [UserAgentComponent, DeleteUserAgentComponent, CreateEditUsersAgentComponent],
  entryComponents: [DeleteUserAgentComponent, CreateEditUsersAgentComponent]
})
export class UserAgentModule { }
