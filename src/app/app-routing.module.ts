import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { AuthActivateGruard } from './auth-service.guard';
import { ActivateServiceGuard } from './app-activate.guard';
import {StrategyModule} from './main/strategy/strategy.module';
import {ViewsManageModule} from './main/views-manage/views-manage.module';
import {UserAgentModule} from './main/useragent/useragent.module';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [AuthActivateGruard],
    loadChildren: 'app/main/login/login.module#LoginModule',
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [ActivateServiceGuard],
    children: [
      {
        path: '',
        loadChildren: 'app/main/dashboard/dashboard.module#DashboardModule',
        pathMatch: 'full'
      },
      {
        path: 'email',
        loadChildren: 'app/main/email/email.module#EmailModule',
      },
      {
        path: 'report',
        loadChildren: 'app/main/report-manage/report-manage.module#ReportManageModule',
      },
      {
        path: 'users',
        loadChildren: 'app/main/users/users.module#UsersModule',
      },
      {
        path: 'strategy',
        loadChildren: 'app/main/strategy/strategy.module#StrategyModule',
      },
      {
        path: 'views',
        loadChildren: 'app/main/views-manage/views-manage.module#ViewsManageModule',
      },
      {
        path: 'agents',
        loadChildren: 'app/main/useragent/useragent.module#UserAgentModule',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: []
})
export class RoutingModule {
}
