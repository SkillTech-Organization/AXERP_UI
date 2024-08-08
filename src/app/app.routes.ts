import { Routes } from '@angular/router';
import { DashboardComponent } from './modules/home/dashboard/dashboard.component';
import { PageNotFoundComponent } from './modules/building-blocks/util/page-not-found/page-not-found.component';
import { AppInsightsViewComponent } from './modules/pages/diagnostics/app-insights-view/app-insights-view.component';
import { GasTransactionsManagerComponent } from './modules/pages/master-data/transactions/gas-transactions-manager/gas-transactions-manager.component';

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
    {
        path: 'diagnostics',
        title: 'Diagnostics',
        children: [
            {
                path: 'monitoring/logs',
                title: 'Log',
                component: AppInsightsViewComponent,
            },
        ],
    },
    { path: 'home', component: DashboardComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent },
];