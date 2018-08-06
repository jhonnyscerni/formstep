import { HomeComponent } from './home/home.component';
import { FormComponent } from './home/form/form.component';
import { Routes, RouterModule } from '@angular/router';
import { SuccessComponent } from './home/success/success.component';

const routes: Routes = [
 
    {
        path: "",
        data: {
        }, children: [
    
          { path: '', component: HomeComponent , children: [
            { path: '', component: FormComponent },
            { path: 'success/:idTituloEleitoral/confirmation', component: SuccessComponent},
          ]},
        ]
      }
    ];

export const PublicRoutes = RouterModule.forChild(routes);
