import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailRoutingModule } from './email-routing.module';
import { MaterialModule } from '../../core/common/material-components.module';
import { PageModule } from '../../core/common/page/page.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AspectRatioModule } from '../../core/common/aspect-ratio/aspect-ratio.module';
import {CreateEditEmailComponent, DeleteEmailComponent, EmailComponent} from './email.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { EmailService } from './email.service';

@NgModule({
  imports: [
    CommonModule,
    EmailRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    // Core
    PageModule,
    AspectRatioModule,
    // 3rd
    NgxUploaderModule
  ],
  declarations: [EmailComponent, CreateEditEmailComponent, DeleteEmailComponent],
  entryComponents: [CreateEditEmailComponent, DeleteEmailComponent],
  providers: [EmailService]
})
export class EmailModule { }
