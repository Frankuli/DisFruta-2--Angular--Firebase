import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment/comment.component';
import { OrderComponent } from './order/order.component';
import { ProducFormComponent } from './produc-form/produc-form.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { BranchComponent } from './branch/branch.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CommentComponent, OrderComponent, ProducFormComponent, AdminProductsComponent, BranchComponent]
})
export class AdminModule { }
