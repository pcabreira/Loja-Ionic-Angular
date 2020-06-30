import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../servicos/authenticate.service';
import { LoginPage } from '../pages/login/login.page';
import { ClienteService } from '../servicos/cliente.service';
import { Cliente } from '../model/Cliente';
import { Endereco } from '../model/Endereco';
import { CartService } from '../servicos/cart.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  shownGroup = null;
  cliente: any;
  endereco: any;
  key: string = '';
  errorMessage: string = '';
  idCliente: string;

  iconePerfil: string;
  iconeEndereco: string;

  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;

  clienteRef: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  celular: string;
  email: string;
  senha: string;

  constructor(private authService: AuthenticateService, 
              private cliService: ClienteService, 
              private cartService: CartService) {}

  ngOnInit() {

    this.iconePerfil = 'chevron-forward-outline'
    this.iconeEndereco = 'chevron-forward-outline';

    if(localStorage.getItem('mudaEndereco') == 'sim'){
      this.iconeEndereco = 'chevron-down-outline';
      this.shownGroup = 1;
    }

    if(this.authService.userDetails()) { 

      //console.log(this.cliService.getCliente());

      if(localStorage.getItem('cadastroNovo') == 'sim'){
        this.cliente = this.cliService.getCliente();
        this.clienteRef = this.cliente.clienteRef;
        this.nome = this.cliente.nome;
        this.sobrenome = this.cliente.sobrenome;
        this.cpf = this.cliente.cpf;
        this.celular = this.cliente.celular;
        this.email = this.cliente.email;
      }
      else
      {
        this.cliente = Object.entries(this.cliService.getCliente())
                            .map(([key, value]) => [key, value]);
                  
        this.cliente.forEach(x => {
          this.key = x[1].key;
          this.clienteRef = x[1].clienteRef;
          this.nome = x[1].nome;
          this.sobrenome = x[1].sobrenome;
          this.cpf = x[1].cpf;
          this.celular = x[1].celular;
          this.email = x[1].email;
        });
      }

      this.endereco = this.cliService.getEndereco();

      this.cep = this.endereco.cep;
      this.rua = this.endereco.rua;
      this.numero = this.endereco.numero;
      this.complemento = this.endereco.complemento;
      this.bairro = this.endereco.bairro;
      this.cidade = this.endereco.cidade;
    }
    else {
      
    }
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;

        if(group == 0) {
          this.iconePerfil = 'chevron-forward-outline'
        } else {
          this.iconeEndereco = 'chevron-forward-outline';
        }
    } else {
        this.shownGroup = group;

        if(group == 0) {
          this.iconePerfil = 'chevron-down-outline'
          this.iconeEndereco = 'chevron-forward-outline';
        }
        else {
          this.iconePerfil = 'chevron-forward-outline'
          this.iconeEndereco = 'chevron-down-outline';
        }
    }
  };
  isGroupShown(group) {
      return this.shownGroup === group;
  };

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

  SalvarUsuario() {
    this.cliente = Object.entries(this.cliService.getCliente())
                         .map(([key, value]) => [key, value]);

    this.cliente.forEach(x => {
      this.key = x[0];
    });

    if(this.celular == undefined || this.celular == "") {
      document.getElementById('celular').classList.add('validacao');
    }
    else {
      let cli = new Cliente();
      cli.celular = this.celular;
      this.cliService.updateCliente(this.key, cli);
    }
  }

  SalvarEndereco() {
    this.endereco = this.cliService.getEndereco();

    if(this.cep == undefined || this.cep == "") {
      document.getElementById('cep').classList.add('validacao');
    }
    else {
      let end = new Endereco();
      end.cep = this.cep;
      end.rua = this.rua;
      end.numero = this.numero;
      end.complemento = this.complemento;
      end.bairro = this.bairro;
      end.cidade = this.cidade;
      this.cliService.updateEndereco(this.endereco.key, end);
    }
  }
}
