import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { AuthActivateGruard } from './auth-service.guard';
import { ActivateServiceGuard } from './app-activate.guard';

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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class RoutingModule {
}
