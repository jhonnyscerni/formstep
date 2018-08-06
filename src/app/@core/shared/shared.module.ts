import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Http, HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { FlexLayoutModule, } from '@angular/flex-layout';
import {
  CovalentDataTableModule, CovalentMediaModule, CovalentLoadingModule,
  CovalentNotificationsModule, CovalentLayoutModule, CovalentMenuModule,
  CovalentPagingModule, CovalentSearchModule, CovalentStepsModule,
  CovalentCommonModule, CovalentDialogsModule,
} from '@covalent/core';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';


import {
  MatButtonModule, MatCardModule, MatIconModule,
  MatListModule, MatMenuModule, MatTooltipModule,
  MatSlideToggleModule, MatInputModule, MatCheckboxModule,
  MatToolbarModule, MatSnackBarModule, MatSidenavModule,
  MatTabsModule, MatSelectModule, MatRadioModule, MatDatepickerModule, MatNativeDateModule, MatStepperModule, DateAdapter
} from '@angular/material';
import { NgxChartsModule, } from '@swimlane/ngx-charts';
import { ErrorHandlerService } from '../../service/error-handler.service';
import { AppDateAdapter } from '../util/app-date-adapter';

const FLEX_LAYOUT_MODULES: any[] = [
  FlexLayoutModule,
];

const ANGULAR_MODULES: any[] = [
  FormsModule, ReactiveFormsModule, HttpModule, HttpClientModule,
];

const MATERIAL_MODULES: any[] = [
  MatButtonModule, MatCardModule, MatIconModule,
  MatListModule, MatMenuModule, MatTooltipModule,
  MatSlideToggleModule, MatInputModule, MatCheckboxModule,
  MatToolbarModule, MatSnackBarModule, MatSidenavModule,
  MatTabsModule, MatSelectModule, MatRadioModule, MatDatepickerModule, MatNativeDateModule
];

const COVALENT_MODULES: any[] = [
  CovalentDataTableModule, CovalentMediaModule, CovalentLoadingModule,
  CovalentNotificationsModule, CovalentLayoutModule, CovalentMenuModule,
  CovalentPagingModule, CovalentSearchModule, CovalentStepsModule,
  CovalentCommonModule, CovalentDialogsModule,MatStepperModule
];

const CHART_MODULES: any[] = [
  NgxChartsModule,
];


export const APP_DATE_FORMATS =
  {
    parse: {
      dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
    },
    display: {
      // dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
      dateInput: 'input',
      monthYearLabel: { month: 'short', year: 'numeric', day: 'numeric' },
      dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
      monthYearA11yLabel: { year: 'numeric', month: 'long' },
    }
  };


registerLocaleData(localePt, 'pt-BR');

@NgModule({
  imports: [
    CommonModule,
    ANGULAR_MODULES,
    MATERIAL_MODULES,
    COVALENT_MODULES,
    CHART_MODULES,
    FLEX_LAYOUT_MODULES,
  ],
  declarations: [

  ],
  exports: [
    ANGULAR_MODULES,
    MATERIAL_MODULES,
    COVALENT_MODULES,
    CHART_MODULES,
    FLEX_LAYOUT_MODULES,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pt-BR" },
    ErrorHandlerService,
    { provide: DateAdapter, useClass: AppDateAdapter },
  ]
  
})
export class SharedModule { }