import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import 'hammerjs'; // Needed for Touch functionality of Material Components
import { environment } from '../environments/environment';
import { RoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthActivateGruard } from './auth-service.guard';
import { ActivateServiceGuard } from './app-activate.guard';
import { MyInterceptor } from './app-interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Angular Core Module // Don't remove!
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // Fury Core Modules
    CoreModule,
    RoutingModule,

    // Register a Service Worker (optional)
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  bootstrap: [AppComponent],
  providers: [
    AuthActivateGruard,
    ActivateServiceGuard,
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true }]
})
export class AppModule { }
