import { Routes } from '@angular/router';
import { DashboardComponent } from './modules/home/dashboard/dashboard.component';
import { PageNotFoundComponent } from './modules/building-blocks/util/page-not-found/page-not-found.component';
import { EventLogViewComponent } from './modules/pages/diagnostics/log-events-view/log-events-view.component';
import { GasTransactionsManagerComponent } from './modules/pages/master-data/transactions/gas-transactions-manager/gas-transactions-manager.component';
import { BlobFilesViewComponent } from './modules/pages/master-data/blob_storage/blob-files-view/blob-files-view.component';

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
            {
                path: 'blob/blob-files',
                title: 'Blob Files',
                component: BlobFilesViewComponent,
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
                component: EventLogViewComponent,
            },
        ],
    },
    { path: 'home', component: DashboardComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent },
];