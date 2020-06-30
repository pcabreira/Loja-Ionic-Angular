import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { Cliente } from '../model/Cliente';
import { Endereco } from '../model/Endereco';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private clienteSource = new BehaviorSubject({ cliente: null, key: '' });
  currentCliente = this.clienteSource.asObservable();

  private enderecoSource = new BehaviorSubject({ endereco: null, key: '' });
  currentEndereco = this.enderecoSource.asObservable();

  cliente = firebase.database().ref("/cliente");
  endereco = firebase.database().ref("/endereco");

  dadosCliente: [];
  dadosEndereco: [];

  constructor(private db: AngularFireDatabase) { }

  getUsuarioPorEmail(email: string) {
    return this.cliente.orderByChild('email').equalTo(email).once('value')
      .then(snapshot => {
        if(snapshot.val()) {
          this.dadosCliente = snapshot.val();
          return this.dadosCliente;
      }
    });
  }

  getEnderecoPorCliente(cliente: string) {
    return this.endereco.orderByChild('clienteRef').equalTo(cliente).once('value')
      .then(snapshot => {
        if(snapshot.val()) {
          var dataObj = snapshot.val();
          var end = dataObj[Object.keys(dataObj)[0]];
          end.key = Object.keys(dataObj)[0];
          localStorage.setItem('idEndereco', end.key.toString());
          this.dadosEndereco = end;
          return end;
      }
    });
  }
 
  updateCliente(key: string, cliente: Cliente) {
    this.db.list('cliente').update(key, cliente).catch((error: any) => {
        console.error(error);
    });
  }

  updateEndereco(key: string, endereco: Endereco) {
    this.db.list('endereco').update(key, endereco).catch((error: any) => {
        console.error(error);
    });
  }

  makeid(lenght: number) {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
    for (var i = 0; i < lenght; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
 
    return text;
  }

  registrarClienteEndereco(cliente: any, endereco: any) {
    var promise = new Promise((resolve, reject) => {
      let clienteRef = this.makeid(20);
      
      this.cliente.push({
        clienteRef: clienteRef,
        nome: cliente.nome,
        sobrenome: cliente.sobrenome,
        cpf: cliente.cpf,
        celular: cliente.celular,
        email: cliente.email
      });
      // .then(() => {
      //   resolve(true);
      // });

      this.endereco.push({
        clienteRef: clienteRef,
        cep: endereco.cep,
        rua: endereco.rua,
        numero: endereco.numero, 
        complemento: endereco.complemento,
        bairro: endereco.bairro,
        cidade: endereco.cidade
      })
      .then((result: any) => {
        resolve(true);
        localStorage.setItem('idEndereco', result.key.toString());
      });
   
      this.cliente = cliente;
      this.endereco = endereco;

      this.dadosCliente = cliente;
      this.dadosEndereco = endereco;
    });
    return promise;
  }

  getEndereco() {
    return this.dadosEndereco;
  }

  getCliente() {
    //console.log("Serviço: " + this.dadosCliente);
    return this.dadosCliente;
  }
}
