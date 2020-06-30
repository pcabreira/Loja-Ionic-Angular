import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { ProdutosService } from './../servicos/produtos.service';
import { Produto } from '../model/Produto';
import { AuthenticateService } from '../servicos/authenticate.service';
import { LoginPage } from '../pages/login/login.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  Produtos = [];
  produtoForm = new FormGroup({
    nome: new FormControl(),
    tipo: new FormControl(),
    preco: new FormControl(),
    quantidade: new FormControl(),
    medida: new FormControl(),
    imagem: new FormControl()
 });

  constructor(private prodService: ProdutosService,    
              private router: Router, 
              private authService: AuthenticateService, 
              private modalCtrl: ModalController, 
              public fb: FormBuilder) { }

  ngOnInit() { 
    //if(this.authService.userDetails()) { 
        let produtoRes = this.prodService.getProdutos();
        produtoRes.snapshotChanges().subscribe(res => {
          this.Produtos = [];
          res.forEach(item => {
            let a = item.payload.toJSON();
            a['$key'] = item.key;
            this.Produtos.push(a as Produto);
          })
        })
    // }
    // else {
    //   this.modalLogin();
    // }
  }

  deleteProduto(id) {
    //console.log(id)
    if (window.confirm('Deseja realmente excluir esse produto?')) {
      this.prodService.deleteProduto(id)
    }
  }

  formSubmit() {
    if (!this.produtoForm.valid) {
      return false;
    } else {
      this.prodService.createProduto(this.produtoForm.value).then(res => {
        //console.log(res)
        this.produtoForm.reset();
        this.router.navigate(['/admin']);
      })
        .catch(error => console.log(error));
    }
  }

  async modalLogin() {
    let modal = await this.modalCtrl.create({
      component: LoginPage,
      cssClass: 'login-modal'
    });
    modal.present();
  }
}