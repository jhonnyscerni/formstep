import { MesarioService } from './../../service/mesario.service';
import { MenuLayoutComponent } from './../../@core/layout/menu-layout/menu-layout.component';
import { PublicRoutes } from './public.routing';
import { FormComponent } from './home/form/form.component';
import { HomeComponent } from './home/home.component';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavListLayoutComponent } from '../../@core/layout/nav-list-layout/nav-list-layout.component';
import { NavViewLayoutComponent } from '../../@core/layout/nav-view-layout/nav-view-layout.component';
import { SharedModule } from '../../@core/shared/shared.module';
import { SuccessComponent } from './home/success/success.component';
import { EleitorService } from '../../service/eleitor.service';

import {NgxMaskModule} from 'ngx-mask'

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PublicRoutes,
    NgxMaskModule.forRoot()
  ],
  declarations: [
    HomeComponent,
    FormComponent,
    NavListLayoutComponent,
    NavViewLayoutComponent,
    MenuLayoutComponent,
    SuccessComponent 
  ],
  providers:[
    MesarioService,
    EleitorService,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ]
})
export class PublicModule { }
