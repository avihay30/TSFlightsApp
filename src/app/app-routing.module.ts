import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { TestTableComponent } from './test-table/test-table.component';
import { FlightsResolver } from './services/flights.resolver';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'admin',
    component: TestTableComponent,
    resolve: {
      flights: FlightsResolver,
    },
  },
  { path: 'old-admin', component: AdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
