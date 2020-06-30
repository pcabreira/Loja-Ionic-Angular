import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { AuthenticateService } from '../../servicos/authenticate.service';
import { CartService } from '../../servicos/cart.service';
import { ClienteService } from '../../servicos/cliente.service';
import { Router } from '@angular/router';
import { Pedido } from '../../model/Pedido';
import { Cliente } from '../../model/Cliente';
import { EventEmitterService } from '../../event-emitter.service';
//import { TabsPage } from '../../tabs/tabs.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  validations_form = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
 });

  errorMessage: string = '';

  cliente: Cliente;
  endereco: any;
  pedidos = [];
  idCliente: string;
  idEndereco = "";

  id: string;
  celular: string;
  cpf: string;
  email: string;
  nome: string;

  cep: string;
  rua: string;
  complemento: string;
  bairro: string;
  cidade: string;
 
  pedido: Pedido;
  key: string = '';

  constructor(private alertCtrl: AlertController,
              private authService: AuthenticateService, 
              private cliService: ClienteService, 
              private formBuilder: FormBuilder, 
              private cartService: CartService, 
              private router: Router, 
              private eventEmitterService: EventEmitterService, 
              private modalCtrl: ModalController) { }
 
  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });

    this.cliente = new Cliente();
    this.cliService.currentCliente.subscribe(data => {
      if (data.cliente && data.key) {
        this.cliente = new Cliente();
        this.cliente.nome = data.cliente.nome;
        this.cliente.sobrenome = data.cliente.sobrenome;
        this.cliente.cpf = data.cliente.cpf;
        this.cliente.celular = data.cliente.celular;
        this.cliente.email = data.cliente.email;
        this.cliente.senha = data.cliente.senha;
        this.key = data.key;
      }
    })

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
 
  validation_messages = {
    'email': [
      { type: 'required', message: 'E-mail obrigatório' },
      { type: 'pattern', message: 'Por favor digite um e-mail válido!' }
    ],
    'password': [
      { type: 'required', message: 'Senha obrigatória' },
      { type: 'minlength', message: 'Senha deve ter no mínimo 5 caracteres!' }
    ]
  };
 
  loginUser(value){
    this.authService.loginUser(value)
    .then(res => {
      if(value.email == 'adm@adm.com') {
        this.router.navigate(['/admin']);
      } 
      else {
        this.errorMessage = "";     
        if(localStorage.getItem('meusPedidos') == "sim") 
        {
          localStorage.removeItem('meusPedidos'); 
          this.router.navigate(['/tabs/tabs2']);
        } 
        else 
        {
          this.checkout(value);
        }
      }
      this.modalCtrl.dismiss();
    }, err => {
      if(err.message = 'There is no user record corresponding to this identifier. The user may have been deleted.') { 
        this.errorMessage = 'Usuário não encontrado!';
      }
      //console.log(this.errorMessage);
    })
  }

  checkout(value) {
    if(this.authService.userDetails()) { 

      this.firstComponentFunction(); //Libera tabs do menu
        
      this.cliService.getUsuarioPorEmail(value.email).then(result => { 

        this.idCliente = result[Object.keys(result)[0]].clienteRef;

        this.cliService.getEnderecoPorCliente(this.idCliente).then(endereco => { 

          this.pedido.dataEntrada = new Date();
          this.pedido.idEndereco = endereco.key;
          this.pedido.status = 'Aberto';
          this.pedido.valorTotal = this.cartService.getCart().reduce((i, j) => i + j.preco * j.quantidade, 0).toFixed(2);
          this.pedido.pedido = this.cartService.getCart();

          if(this.pedido.pedido.length != 0) {
            this.presentConfirm(value.email, this.pedido, endereco);
          }
        })
      }) 
    }
  }

  firstComponentFunction(){    
    this.eventEmitterService.onFirstComponentButtonClick();    
  } 

  async presentConfirm(email, pedido, end) {
    let alert = await this.alertCtrl.create({
      header: 'Confirma endereço de entrega abaixo?',
      message: "<b>" + end.rua + ', ' + end.numero + '</b><br>' + 
                       end.complemento + '<br>' +
                       end.bairro + '<br>' +
                       end.cidade + '<br>' +
                       "CEP " + end.cep,
      buttons: [ 
        {
          text: 'Não',
          role: 'nao',
          handler: () => {
            localStorage.setItem('mudaEndereco', 'sim');
            this.router.navigate(['/tabs/tab3']);
          }
        },
        {
          text: 'Sim',
          handler: () => {   
            this.cartService.RegistrarPedido(pedido).then(resp => {    
              this.pedidoConcluido(email);    
            })
              .catch(error => {
                //console.log(error);
            });
          }
        }
      ]
    });
    alert.present();
  }

  async pedidoConcluido(email) {
    let alert = await this.alertCtrl.create({
      header: 'Obrigado!',
      message: 'Seu pedido foi agendado e será entregue em até 2 dias corridos',
      buttons: ['OK']
    });
    alert.present().then(() => {
      this.cartService.removeCart();
      localStorage.setItem('atualizaTab1', 'sim');
      this.router.navigate(['/tabs/tab2']); 
    });
  }

  goToRegisterPage(){
    this.modalCtrl.dismiss();
    this.router.navigate(['/cadastro']);
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
