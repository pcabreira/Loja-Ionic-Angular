import { Component, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartModalPage } from '../pages/cart-modal/cart-modal.page';
import { ModalController } from '@ionic/angular';
import { CartService } from '../servicos/cart.service';
import { AuthenticateService } from '../servicos/authenticate.service';
import { LoginPage } from '../pages/login/login.page';
import { EventEmitterService } from '../event-emitter.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  cart = [];
  cartItemCount: BehaviorSubject<number>;
 
  @ViewChild('cart', {static: false, read: ElementRef})fab: ElementRef;

  constructor(private modalCtrl: ModalController, 
              private authService: AuthenticateService, 
              private eventEmitterService: EventEmitterService, 
              private cartService: CartService) {}

  ngOnInit() {

    if (this.eventEmitterService.subsVar == undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService    
          .invokeFirstComponentFunction.subscribe(() => {    
        this.firstFunction();    
      });    
    }    

    this.cart = this.cartService.getCart();
    this.cartItemCount = this.cartService.getCartItemCount();
    document.getElementById('ion-fab').style.visibility = 'hidden';

    if(this.authService.userDetails()) {
      document.getElementById('tab-button-tab2').removeAttribute("disabled");
      document.getElementById('tab-button-tab3').removeAttribute("disabled");
    }
    else {
      document.getElementById('tab2').setAttribute("disabled","disabled");
      document.getElementById('tab3').setAttribute("disabled","disabled");
      this.modalLogin(); 
    }
  }

  firstFunction() {    
    this.ngOnInit();
  }  

  async openCart() {
    this.animateCSS('bounceOutLeft', true);
 
    let modal = await this.modalCtrl.create({
      component: CartModalPage,
      cssClass: 'cart-modal'
    });
    modal.onWillDismiss().then(() => {
      this.fab.nativeElement.classList.remove('animated', 'bounceOutLeft')
      this.animateCSS('bounceInLeft');
    });
    modal.present();
  }
 
  animateCSS(animationName, keepAnimated = false) {
    const node = this.fab.nativeElement;
    node.classList.add('animated', animationName)
    function handleAnimationEnd() {
      if (!keepAnimated) {
        node.classList.remove('animated', animationName);
      }
      node.removeEventListener('animationend', handleAnimationEnd)
    }
    node.addEventListener('animationend', handleAnimationEnd)
  }

  getTotal() {
    return this.cart.reduce((i, j) => i + j.preco * j.quantidade, 0);
  }

  async modalLogin() {
    let modal = await this.modalCtrl.create({
      component: LoginPage,
      cssClass: 'login-modal'
    });
    modal.present();
  }
}
