import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../core/common/material-components.module';
import { PageModule } from '../../core/common/page/page.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AspectRatioModule } from '../../core/common/aspect-ratio/aspect-ratio.module';
import { UsersRoutingModule } from './users-routing.module';
import { ChangePasswordUserComponent, CreateEditUserComponent, DeleteUserComponent, UsersComponent } from './users.component';
import { UsersService } from './users.service';
import { MomentModule } from 'ngx-moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    MaterialModule,

    // Core
    PageModule,
    AspectRatioModule,
    MomentModule
  ],
  declarations: [UsersComponent, CreateEditUserComponent, DeleteUserComponent, ChangePasswordUserComponent],
  entryComponents: [CreateEditUserComponent, DeleteUserComponent, ChangePasswordUserComponent],
  providers: [UsersService]
})
export class UsersModule { }
