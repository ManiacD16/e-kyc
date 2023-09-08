import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExistingCustomerComponent } from './existing-customer/existing-customer.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';

const routes: Routes = [
  {path: "newCustomer", component: NewCustomerComponent},
  {path: 'existingCustomer', component: ExistingCustomerComponent},
  {path: "**", redirectTo: "newCustomer", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
