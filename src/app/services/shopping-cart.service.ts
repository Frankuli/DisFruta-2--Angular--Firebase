import { Product } from 'src/app/models/product';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { take, map } from 'rxjs/operators';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable } from 'rxjs';



@Injectable()
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();
    let cart = this.db.object('/shopping-carts/' + cartId).snapshotChanges().pipe(
      map((action: any) => {
        const key = action.key;
        const items = (action.payload.val()) ? action.payload.val().items : [];
        return new ShoppingCart(key, items);
      })
    )
    return cart;
  }

  async addToCart(product: Product) {
    this.updateItem(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItem(product, -1);
  }

  async clearCart(){
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/'+ cartId + '/items').remove();
  }

  private getItem(cartId: string, productId: string){
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    })
  }

  private async getOrCreateCartId() {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;

    let result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;

  }

  private async updateItem(product: Product, change: number){
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.key);
    item$.snapshotChanges().pipe(take(1)).subscribe(item => {
      if (item.payload.exists()) {
        let i: any = item.payload.val();
        let q = i.quantity + change;
        item$.update({ quantity: q });
        if (q <= 0 ) item$.remove();
      } else item$.set({
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: 1 });
    })
  }

}
