import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { CartModalPageModule } from './pages/cart-modal/cart-modal.module';
import { AuthenticateService } from './servicos/authenticate.service';
import { LoginPage } from '../app/pages/login/login.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { EventEmitterService } from './event-emitter.service';

@NgModule({
  declarations: [AppComponent, LoginPage],
  entryComponents: [LoginPage],
  imports: [BrowserModule, 
            IonicModule.forRoot(), 
            BsDropdownModule.forRoot(), 
            TooltipModule.forRoot(), 
            ModalModule.forRoot(), 
            AppRoutingModule, 
            FormsModule, 
            HttpClientModule, 
            ReactiveFormsModule, 
            CartModalPageModule, 
            AngularFireModule.initializeApp(environment.firebase),
            AngularFireAuthModule,
            AngularFireDatabaseModule,
            AngularFireStorageModule],
  exports: [BsDropdownModule, TooltipModule, ModalModule],
  providers: [
    StatusBar,
    SplashScreen, 
    AuthenticateService, 
    EventEmitterService, 
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
