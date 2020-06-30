import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Produto } from '../model/Produto';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  produtos: AngularFireList<any>;
  produtosRef: AngularFireObject<any>;

  produto = firebase.database().ref("/produto");

  constructor(private db: AngularFireDatabase) { }

  makeid(lenght: number) {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
    for (var i = 0; i < lenght; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
 
    return text;
  }

  // createProduto(apt: any) {
  //   var promise = new Promise((resolve) => {
  //     this.produto.push({
  //       nome: apt.nome,
  //       tipo: apt.tipo,
  //       preco: apt.preco.replace(',','.'),
  //       quantidade: apt.quantidade,
  //       medida: apt.medida,
  //       imagem: apt.imagem
  //     })
  //     .then(() => {
  //       resolve(true);
  //     });
  //   });
  //   return promise;
  // }


  Create
  createProduto(apt: Produto) {
    return this.produtos.push({
      nome: apt.nome,
      tipo: apt.tipo,
      preco: apt.preco.replace(',','.'),
      quantidade: apt.quantidade,
      medida: apt.medida,
      imagem: apt.imagem
    })
  }

  getFrutas() {
    return this.db.list('/produto', ref => ref.orderByChild('tipo').equalTo('Fruta'));
  }

  getVerduras() {
    return this.db.list('/produto', ref => ref.orderByChild('tipo').equalTo('Verdura'));
  }

  // Get Single
  getProduto(id: string) {
    this.produtosRef = this.db.object('/produto/' + id);
    return this.produtosRef;
  }

  // Get List
  getProdutos() {
    this.produtos = this.db.list('/produto', ref => ref.orderByChild('nome'));
    return this.produtos;
  }

  // Update
  updateProduto(id, apt: Produto) {
    return this.produtosRef.update({
      nome: apt.nome,
      tipo: apt.tipo,
      preco: apt.preco.replace(',','.'),
      quantidade: apt.quantidade,
      medida: apt.medida,
      imagem: apt.imagem
    })
  }

  // Delete
  deleteProduto(id: string) {
    this.produtosRef = this.db.object('/produto/' + id);
    this.produtosRef.remove();
  }
}
