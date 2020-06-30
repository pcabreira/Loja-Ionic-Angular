import { Component, OnInit } from '@angular/core';
import { Pedido } from '../model/Pedido';
import { CartService } from '../servicos/cart.service';
import { AuthenticateService } from '../servicos/authenticate.service';
import { ModalController } from '@ionic/angular';
import { Produto } from '../model/Produto';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page implements OnInit {
 
  PedidosA = [];
  PedidosE = [];
  openA: string = 'defaultOpenP';
  openE: string = 'defaultOpenP';

  constructor(private cartService: CartService, 
              private authService: AuthenticateService) {}

  ngOnInit() {
    if(this.cartService.getCart().length == 0) {
      document.getElementById('ion-fab').style.visibility= 'hidden';
    }
    else {
      document.getElementById('ion-fab').style.visibility= 'visible';
    }

    let idEndereco = localStorage.getItem('idEndereco');

      if(idEndereco != '') {
        this.cartService.getPedidosPorIdEndereco(idEndereco).snapshotChanges().subscribe(res => {
          this.PedidosE = [];
          this.PedidosA = [];
          res.forEach(item => {
            let a = item.payload.toJSON();
            a['$key'] = item.key;
            if(a['status'] == 'Aberto') {
              this.PedidosE.push(a as Pedido);
            }
            else {
              this.PedidosA.push(a as Pedido);
            }
          })

          this.PedidosE.forEach(x => {
            x.produtos = [];
            this.cartService.getDetalhePedidosPorOrderRef(x.orderRef).snapshotChanges().subscribe(res => {
              res.forEach(item => {
                let a = item.payload.toJSON();
                a['$key'] = item.key;
                x.produtos.push(a as Produto);
              })
            })
          });

          this.PedidosA.forEach(x => {
            x.produtos = [];
            this.cartService.getDetalhePedidosPorOrderRef(x.orderRef).snapshotChanges().subscribe(res => {
              res.forEach(item => {
                let a = item.payload.toJSON();
                a['$key'] = item.key;
                x.produtos.push(a as Produto);
              })
            })
          });

          if(this.PedidosE.length > 0) {
            this.openE = 'defaultOpenP';
            this.openA = '';
          } 
          else {
            this.openE = '';
            this.openA = 'defaultOpenP';
          }

          document.getElementById("defaultOpenP").click();
        })
      }
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

}
