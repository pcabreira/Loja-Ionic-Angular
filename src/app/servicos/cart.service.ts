import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart = [];
  private cartItemCount = new BehaviorSubject(0);

  private pedidoSource = new BehaviorSubject({ pedido: null, key: '' });
  currentPedido = this.pedidoSource.asObservable();

  firedata = firebase.database().ref("/orders");
  orderDetails = firebase.database().ref("/ordersdetails");

  constructor(private db: AngularFireDatabase, 
              private httpClient: HttpClient) { }

  getCart() {
    return this.cart;
  }
 
  getCartItemCount() {
    return this.cartItemCount;
  }

  addProduct(product) {
    let added = false;
    for (let p of this.cart) {
      if (p.$key === product.$key) {
        p.quantidade += 1;
        added = true;
        break;
      }
    }
    if (!added) {
      product.quantidade = 1;
      this.cart.push(product);
    }
    //this.cartItemCount.next(this.cartItemCount.value + 1);
    this.cartItemCount.next(this.cart.length);
  }

  decreaseProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.$key === product.$key) {
        p.quantidade -= 1;
        if (p.quantidade == 0) {
          this.cart.splice(index, 1);
        }
      }
    }
    this.cartItemCount.next(this.cart.length);
  }

  removeProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.$key === product.$key) {
        this.cartItemCount.next(this.cartItemCount.value - p.quantidade);
        this.cart.splice(index, 1);
      }
    }
  }

  removeCart() {
    for (let [index] of this.cart.entries()) {
        this.cart.splice(index, this.cart.length);
        this.cartItemCount.next(this.cart.length);
    }
    //console.log(this.cart.length);
  }

  RegistrarPedido(orderObj: any) {
      var promise = new Promise((resolve, reject) => {
        let orderRef = this.makeid(20);
        let orderObject = {
          orderRef: orderRef,
          dataEntrada: orderObj.dataEntrada.toString(),
          dataEntrega: '',
          status: 'Aberto',
          valorTotal: orderObj.valorTotal,
          idEndereco: orderObj.idEndereco
        };
     
        this.firedata.push(orderObject).then(() => {
          orderObj.pedido.forEach((v, index) => {
            this.orderDetails
              .push({
                orderRef: orderRef,
                nome: v.nome,
                tipo: v.tipo,
                preco: v.preco,
                quantidade: v.quantidade,
                medida: v.medida,
                imagem: ''
              });
              // .then(() => {
              //   resolve(true);
              // });
          });
        });
      });
      return promise;
  }

  makeid(lenght: number) {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
    for (var i = 0; i < lenght; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
 
    return text;
  }

  consultaCep(cep) {
    let url = "https://viacep.com.br/ws/" + cep.replace("-","") + "/json/";
    return this.httpClient.get(url);
  }

  getPedidosPorIdEndereco(idEndereco) {
    return this.db.list('/orders', ref => ref.orderByChild('idEndereco').equalTo(idEndereco));
  }

  getDetalhePedidosPorOrderRef(orderRef) {
    return this.db.list('/ordersdetails', ref => ref.orderByChild('orderRef').equalTo(orderRef));
  }

}
