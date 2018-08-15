import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StrategyRoutingModule} from './strategy-routing.module';
import {AspectRatioModule} from '../../core/common/aspect-ratio/aspect-ratio.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../core/common/material-components.module';
import {PageModule} from '../../core/common/page/page.module';
import {CreateEditStrategyComponent, DeleteStrategyComponent, StrategyComponent} from './strategy.component';
import {StrategyService} from './strategy.service';
import {HighlightModule} from '../../core/common/highlightjs/highlight.module';

@NgModule({
  imports: [
    CommonModule,
    StrategyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    // Core
    PageModule,
    AspectRatioModule,
    HighlightModule,
  ],
  declarations: [StrategyComponent, CreateEditStrategyComponent, DeleteStrategyComponent],
  entryComponents: [CreateEditStrategyComponent, DeleteStrategyComponent],
  providers: [StrategyService]
})
export class StrategyModule { }
