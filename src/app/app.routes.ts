import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PocManagerComponent } from './modules/business/master-data/poc-manager/poc-manager.component';
import { DashboardComponent } from './modules/home/dashboard/dashboard.component';
import { PageNotFoundComponent } from './modules/building-blocks/util/page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path: 'business',
        title: 'Business',
        // component: AppComponent,  // this is the component with the <router-outlet> in the template
        children: [
            {
                path: 'master-data/poc-manager',  // child route path
                title: 'Poc Manager',
                component: PocManagerComponent,  // child route component that the router renders
            },
        ],
    },
    { path: 'home', component: DashboardComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }, // redirect to `first-component`
    { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];