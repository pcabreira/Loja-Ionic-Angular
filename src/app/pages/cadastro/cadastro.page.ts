import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ClienteService } from '../../servicos/cliente.service';
import { Cliente } from '../../model/Cliente';
import { Endereco } from '../../model/Endereco';
import { Produto } from '../../model/Produto';
import { CartService } from '../../servicos/cart.service';
import { AuthenticateService } from '../../servicos/authenticate.service';
import { Pedido } from '../../model/Pedido';
import { LoginPage } from '../login/login.page';
import { EventEmitterService } from '../../event-emitter.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  cliente: Cliente;
  endereco: Endereco;
  key: string = '';
  errorMessage: string = '';
  cart: Produto[] = [];
  idCliente: string;

  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;

  nome: string;
  sobrenome: string;
  cpf: string;
  celular: string;
  email: string;
  senha: string;

  pedido: Pedido;
  cli: any;
  end: any;

  constructor(private cliService: ClienteService,   
              private cartService: CartService, 
              private authService: AuthenticateService, 
              private alertCtrl: AlertController, 
              private modalCtrl: ModalController, 
              private eventEmitterService: EventEmitterService, 
              private router: Router) { }

  ngOnInit() { 

    if(this.authService.userDetails()) {
      document.getElementById('btnFazerLogin').style.visibility= 'hidden';
    }
    else {
      document.getElementById('btnFazerLogin').style.visibility= 'visible';
    }

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

    this.endereco = new Endereco();
    this.cliService.currentEndereco.subscribe(data => {
      if (data.endereco && data.key) {
        this.endereco = new Endereco();
        this.endereco.cep = data.endereco.cep;
        this.endereco.rua = data.endereco.rua;
        this.endereco.complemento = data.endereco.complemento;
        this.endereco.bairro = data.endereco.bairro;
        this.endereco.cidade = data.endereco.cidade;
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

  somenteNumeros(value) {
    if(value != undefined) {
      return value.replace(/[^0-9\.]+/g,"");
    }
  }

  formatPhone(str) {
    if(str != undefined) {
      let cleaned = ('' + str).replace(/\D/g, '');    
      let match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);    
      if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
      };
    }
  }

  formatCPF(str) {
    if(str != undefined) {
      let cleaned = ('' + str).replace(/\D/g, '');    
      let match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);    
      if (match) {
        return match[1] + '.' + match[2] + '.' + match[3] + "-" + match[4]
      };
    }
  }

  formatCep(str) {
    this.errorMessage = "";
    this.cartService.consultaCep(str).subscribe(data => {
      const enderecoMapeado = Object.keys(data).map(key => ({type: key, value: data[key]}));
      //console.log(data, enderecoMapeado);

      if(enderecoMapeado[0].value == true) {
        this.errorMessage = "CEP inválido!";
        this.cep = "";
        this.rua = "";
        this.bairro = "";
        this.cidade = "";
      } 
      else {
        if(enderecoMapeado[5].value == "SP" && 
          (enderecoMapeado[3].value == "Santana" || enderecoMapeado[3].value == "Imirim" || 
           enderecoMapeado[3].value == "Alto da Mooca" || enderecoMapeado[3].value == "Mooca" || 
           enderecoMapeado[3].value == "Parque da Mooca" || enderecoMapeado[3].value == "Altos de Vila Prudente" || 
           enderecoMapeado[3].value == "Vila Prudente" || enderecoMapeado[3].value == "Jardim Tupanci" || 
           enderecoMapeado[3].value == "Jardim Tremembé" || enderecoMapeado[3].value == "Parque Palmas do Tremembé" || 
           enderecoMapeado[3].value == "Tremembé" || enderecoMapeado[3].value == "Mandaqui" || 
           enderecoMapeado[3].value == "Água Fria" || enderecoMapeado[3].value == "Jardim São Paulo(Zona Norte)" || 
           enderecoMapeado[3].value == "Parque Mandaqui" || enderecoMapeado[3].value == "Sítio do Mandaqui" || 
           enderecoMapeado[3].value == "Tucuruvi" || enderecoMapeado[3].value == "Carandiru" || 
           enderecoMapeado[3].value == "Casa Verde Baixa" || enderecoMapeado[3].value == "Lauzane Paulista" || 
           enderecoMapeado[3].value == "Casa Verde" || enderecoMapeado[3].value == "Casa Verde Alta" )) {

           this.cep = enderecoMapeado[0].value;
           this.rua = enderecoMapeado[1].value;
           this.bairro = enderecoMapeado[3].value;
           this.cidade = enderecoMapeado[4].value + "-" + enderecoMapeado[5].value;
        } 
        else {
          this.errorMessage = "Desculpe, ainda não atendemos essa região. Por favor digite outro cep.";
        }
      }
    });
  }

  RemoveValidacao(id: string) {
    if(<HTMLInputElement>document.getElementById(id) != null || document.getElementById(id) != null) {
        if((<HTMLInputElement>document.getElementById(id)).value == undefined) {
          document.getElementById(id).classList.add('validacao');
        }
        else {
          document.getElementById(id).classList.remove('validacao');
        }
    }
  }

  CadastrarUsuario()
  {
    this.errorMessage = "";
    if(this.nome == undefined || this.nome == "") {
      document.getElementById('nome').classList.add('validacao');
    }
    else if(this.sobrenome == undefined || this.sobrenome == "") {
      document.getElementById('sobrenome').classList.add('validacao');
    }
    else if(this.cpf == undefined || this.cpf == "") {
      document.getElementById('cpf').classList.add('validacao');
    }
    else if(this.celular == undefined || this.celular == "") {
      document.getElementById('celular').classList.add('validacao');
    }
    else if(this.email == undefined || this.email == "") {
      document.getElementById('email').classList.add('validacao');
    }
    else if((this.senha == undefined || this.senha == "") && !this.authService.userDetails()) {
      document.getElementById('senha').classList.add('validacao');
    }
    else if(this.senha != undefined ? this.senha.length <= 5 : null) {
      this.errorMessage = 'Senha precisa de no mínimo 6 caracteres!';
    }
    else if(this.cep == undefined || this.cep == "") {
      document.getElementById('cep').classList.add('validacao');
    }
    else if(this.rua == undefined || this.rua == "") {
      document.getElementById('rua').classList.add('validacao');
    }
    else if(this.numero == undefined || this.numero == "") {
      document.getElementById('numero').classList.add('validacao');
    }
    else if(this.bairro == undefined || this.bairro == "") {
      document.getElementById('bairro').classList.add('validacao');
    }
    else if(this.cidade == undefined || this.cidade == "") {
      document.getElementById('cidade').classList.add('validacao');
    }
    else { 

        let usuario = this.email.substring(0, this.email.indexOf("@"));
        let dominio = this.email.substring(this.email.indexOf("@")+ 1, this.email.length);
      
        if ((usuario.length >=1) &&
            (dominio.length >=3) && 
            (usuario.search("@")==-1) && 
            (dominio.search("@")==-1) &&
            (usuario.search(" ")==-1) && 
            (dominio.search(" ")==-1) &&
            (dominio.search(".")!=-1) &&      
            (dominio.indexOf(".") >=1)&& 
            (dominio.lastIndexOf(".") < dominio.length - 1)) { 

              this.cliente.nome = this.nome;
              this.cliente.sobrenome = this.sobrenome;
              this.cliente.cpf = this.cpf;
              this.cliente.celular = this.celular;
              this.cliente.email = this.email;
              this.cliente.senha = this.senha;
              
              this.endereco.cep = this.cep;
              this.endereco.rua = this.rua;
              this.endereco.numero = this.numero;
              this.endereco.complemento = this.complemento == undefined || this.complemento == '' ? '' : this.complemento;
              this.endereco.bairro = this.bairro;
              this.endereco.cidade = this.cidade;

              this.cart = this.cartService.getCart();

              if(this.authService.userDetails()) { 
                if(this.cart.length != 0) {
                  this.confirmarPedido();
                }
                else {
                  this.voltar();
                }   
              }
              else {
                this.tryRegister();
              }  
        }
        else {
            this.errorMessage = 'E-mail está em um formato incorreto!';
        }
      }
  }

  firstComponentFunction(){    
    this.eventEmitterService.onFirstComponentButtonClick();    
  } 

  tryRegister(){
    this.authService.registerUser(this.cliente.email, this.cliente.senha).then(res => {
      this.cliService.registrarClienteEndereco(this.cliente, this.endereco).then(resp => {
        this.loginUser(this.cliente.email, this.cliente.senha);
      })
        .catch(error => {
          console.log(error);
      });
      this.errorMessage = '';
    }, err => {
      console.log(err.message);
      if(err.message == 'The email address is badly formatted.') {
        this.errorMessage = 'E-mail está em um formato incorreto!';
      }
      else if(err.message == 'Password should be at least 6 characters') {
        this.errorMessage = 'Senha precisa de no mínimo 6 caracteres!';
      }
      else if(err.message == 'The email address is already in use by another account.') {
        this.errorMessage = 'O e-mail informado já está sendo usado por outra conta!';
      }  
    })
  }

  loginUser(email, senha){
    this.authService.loginUserViaCadastro(email, senha)
    .then(res => {
      //console.log(res);
      this.errorMessage = "";
      this.firstComponentFunction();
      localStorage.setItem('cadastroNovo', 'sim');

      if(this.cart.length != 0) {
        this.confirmarPedido();
      }
      else {
        this.voltar();
      }
    }, err => {
      if(err.message = 'There is no user record corresponding to this identifier. The user may have been deleted.') { 
        this.errorMessage = 'Usuário não encontrado!';
      }
      this.errorMessage = this.errorMessage;
      console.log(this.errorMessage);
    })
  }

  confirmarPedido() { 
    this.pedido.dataEntrada = new Date();
    this.pedido.idEndereco = localStorage.getItem('idEndereco');
    this.pedido.status = 'Aberto';
    this.pedido.valorTotal = this.cart.reduce((i, j) => i + parseFloat(j.preco) * parseInt(j.quantidade), 0).toFixed(2);
    this.pedido.pedido = this.cart;

    this.cartService.RegistrarPedido(this.pedido)   
    this.pedidoConcluido();    
  }

  async pedidoConcluido() {
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

  async modalLogin() {
    let modal = await this.modalCtrl.create({
      component: LoginPage,
      cssClass: 'login-modal'
    });
    modal.present();
  }

  voltar() {
    this.router.navigate(['/tabs/tab1']);
  }
}