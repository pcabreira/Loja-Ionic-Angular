import { ProdutosService } from './../servicos/produtos.service';
import { Produto } from '../model/Produto';
import { CartService } from '../servicos/cart.service';
import { Component } from '@angular/core';
import { TabsPage } from '../tabs/tabs.page';
import { AuthenticateService } from '../servicos/authenticate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  Frutas = [];
  Verduras = [];

  constructor(private prodService: ProdutosService,
              private cartService: CartService, 
              private authService: AuthenticateService, 
              private tabsPage: TabsPage,
              private router: Router) {}

  ngOnInit() {

    document.getElementById("defaultOpen").click();

    this.prodService.getFrutas().snapshotChanges().subscribe(res => {
      this.Frutas = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        a['quantidade'] = 0;
        this.Frutas.push(a as Produto);
      })
    })

    this.prodService.getVerduras().snapshotChanges().subscribe(res => {
      this.Verduras = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        a['quantidade'] = 0;
        this.Verduras.push(a as Produto);
      })
    })
  }

  ionViewWillEnter() {
    if(localStorage.getItem('atualizaTab1') == 'sim') {
      for(let f of this.Frutas) {
        f.quantidade = 0;
      }
      for(let f of this.Verduras) {
        f.quantidade = 0;
      }
      this.mostraCart();
      localStorage.removeItem('atualizaTab1');
    }
  }

  addToCart(product) {
    //product.preco = product.preco.replace(',','.');
    this.cartService.addProduct(product);
    this.tabsPage.animateCSS('tada');
    this.mostraCart();
  }

  decreaseCartItem(product) {
    this.cartService.decreaseProduct(product);
    this.mostraCart();
  }

  mostraCart() {
    if(this.cartService.getCart().length == 0) {
      document.getElementById('ion-fab').style.visibility= 'hidden';
    }
    else {
      document.getElementById('ion-fab').style.visibility= 'visible';
    }
  }

  logoutUser() {
    this.authService.logoutUser();
  }
}
