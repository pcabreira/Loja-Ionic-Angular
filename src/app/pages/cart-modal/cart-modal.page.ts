import { CartService } from '../../servicos/cart.service';
import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { AuthenticateService } from '../../servicos/authenticate.service';
import { ClienteService } from '../../servicos/cliente.service';
import { Pedido } from '../../model/Pedido';
import { Produto } from '../../model/Produto';
import { LoginPage } from '../login/login.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.page.html',
  styleUrls: ['./cart-modal.page.scss'],
})
export class CartModalPage implements OnInit {

  cart: Produto[];
  endereco: any;
  email: string;
  idEndereco: string;
  pedido: Pedido;
  key: string = '';
 
  constructor(private cartService: CartService, 
              private authService: AuthenticateService, 
              private cliService: ClienteService, 
              private modalCtrl: ModalController, 
              private navCtrl: NavController, 
              private router: Router,
              private alertCtrl: AlertController) { }
 
  ngOnInit() {
    this.cart = this.cartService.getCart();

    this.pedido = new Pedido();
    this.cartService.currentPedido.subscribe(data => {
      if (data.pedido && data.key) {
        this.pedido = new Pedido();
        this.pedido.dataEntrada = data.pedido.dataEntrada;
        this.pedido.dataEntrega = data.pedido.dataEntrega;
        this.pedido.idEndereco = data.pedido.idEndereco;
        this.pedido.pedido = data.pedido.pedido;
        this.pedido.status = data.pedido.status;
        this.pedido.valorTotal = data.pedido.valorTotal;
        this.key = data.key;
      }
    })
  }

  decreaseCartItem(product) {
    this.cartService.decreaseProduct(product);
  }
 
  increaseCartItem(product) {
    this.cartService.addProduct(product);
  }
 
  removeCartItem(product) {
    this.cartService.removeProduct(product);
  }
 
  getTotal() {
    return this.cart.reduce((i, j) => i + parseFloat(j.preco) * parseInt(j.quantidade), 0) + 10;
  }
 
  close() {
    this.modalCtrl.dismiss();
  }

  tab01() {
    this.modalCtrl.dismiss();
    this.router.navigate(['/tabs/tab1']); 
  }
 
  async checkout() {
      if(this.cart.length > 0)
      {
        if(this.getTotal() >= 50)
        {
          if(this.authService.userDetails()) {
            this.endereco = this.cliService.getEndereco();
            this.presentConfirm();
          }
          else {
            this.close();
            this.modalLogin();
          }
        }
        else{
          this.pedidoMinimo();
        }
      }
      else{
        this.carrinhoVazio();
      }
  }

  async pedidoMinimo() {
    let alert = await this.alertCtrl.create({
      header: 'Pedido mínimo de R$50.00',
      message: 'Por favor insira mais itens no seu carrinho.',
      buttons: ['OK']
    });
    alert.present();
  }

  async carrinhoVazio() {
    let alert = await this.alertCtrl.create({
      header: 'Seu carrinho está vazio!',
      message: 'Por favor adicione itens no seu carrinho.',
      buttons: ['OK']
    });
    alert.present();
  }

  async modalLogin() {
    let modal = await this.modalCtrl.create({
      component: LoginPage,
      cssClass: 'login-modal'
    });
    modal.present();
  }

  async presentConfirm() {
    let alert = await this.alertCtrl.create({
      header: 'Confirma endereço de entrega abaixo?',
      message: "<b>" + this.endereco.rua + ', ' + this.endereco.numero + '</b><br>' + 
                       this.endereco.complemento + '<br>' +
                       this.endereco.bairro + '<br>' +
                       this.endereco.cidade + '<br>' +
                       "CEP " + this.endereco.cep,
      buttons: [ 
        {
          text: 'Não',
          role: 'nao',
          handler: () => {
             this.close();
             localStorage.setItem('mudaEndereco', 'sim');
             this.router.navigate(['/tabs/tab3']); 
          }
        },
        {
          text: 'Sim',
          handler: () => {   
            this.pedido.dataEntrada = new Date();
            this.pedido.idEndereco = localStorage.getItem('idEndereco');
            this.pedido.status = 'Aberto';
            this.pedido.valorTotal = this.cart.reduce((i, j) => i + parseFloat(j.preco) * parseInt(j.quantidade), 0).toFixed(2);
            this.pedido.pedido = this.cart;
        
            this.cartService.RegistrarPedido(this.pedido)   
            this.pedidoConcluido();  
          }
        }
      ]
    });
    alert.present();
  }

  async pedidoConcluido() {
    let alert = await this.alertCtrl.create({
      header: 'Obrigado!',
      message: 'Seu pedido foi agendado e será entregue em até 2 dias corridos',
      buttons: ['OK']
    });
    alert.present().then(() => {
      this.close();
      this.cartService.removeCart();
      localStorage.setItem('atualizaTab1', 'sim');
      this.router.navigate(['/tabs/tab2']);  
    });
  }
}
