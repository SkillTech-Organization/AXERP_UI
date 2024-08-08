import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { GasTransactionsManagerComponent } from './modules/business/master-data/transactions/gas-transactions-manager/gas-transactions-manager.component';
import { DashboardComponent } from './modules/home/dashboard/dashboard.component';
import { PageNotFoundComponent } from './modules/building-blocks/util/page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path: 'business',
        title: 'Business',
        // component: AppComponent,
        children: [
            {
                path: 'transactions/gas-transactions',
                title: 'Gas Transactions',
                component: GasTransactionsManagerComponent,
            },
        ],
    },
    { path: 'home', component: DashboardComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent },
];