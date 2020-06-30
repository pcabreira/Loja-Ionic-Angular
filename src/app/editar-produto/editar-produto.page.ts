import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { ProdutosService } from './../servicos/produtos.service';

@Component({
  selector: 'app-editar-produto',
  templateUrl: './editar-produto.page.html',
  styleUrls: ['./editar-produto.page.scss'],
})
export class EditarProdutoPage implements OnInit {

  updateProdutoForm = new FormGroup({
    nome: new FormControl(),
    tipo: new FormControl(),
    preco: new FormControl(),
    quantidade: new FormControl(),
    medida: new FormControl(),
    imagem: new FormControl()
 });

  id: any;

  constructor(private prodService: ProdutosService,
              private actRoute: ActivatedRoute,
              private router: Router,
              public fb: FormBuilder) { 
                this.id = this.actRoute.snapshot.paramMap.get('id');
                this.prodService.getProduto(this.id).valueChanges().subscribe(res => {
                  this.updateProdutoForm.setValue(res);
                });
               }

  ngOnInit() {
    this.updateProdutoForm = this.fb.group({
      nome: [''],
      tipo: [''],
      preco: [''],
      quantidade: [''],
      medida: [''],
      imagem: ['']
    })
    //console.log(this.updateProdutoForm.value)
  }

  updateForm() {
    this.prodService.updateProduto(this.id, this.updateProdutoForm.value)
      .then(() => {
        this.router.navigate(['/admin']);
      })
      .catch(error => console.log(error));
  }

}
