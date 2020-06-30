import { Injectable } from "@angular/core";
import * as firebase from 'firebase';
import { CartService } from '../servicos/cart.service';

@Injectable()
export class AuthenticateService {
 
  email: string;

  constructor(private cartService: CartService){}
 
  registerUser(email, password){
   return new Promise<any>((resolve, reject) => {
     firebase.auth().createUserWithEmailAndPassword(email, password)
     .then(
       res => resolve(res),
       err => reject(err))
   })
  }

  loginUser(value) {

    this.email = value.email;

    return new Promise<any>((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  loginUserViaCadastro(email, senha) {

    this.email = email;

    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, senha)
      .then(
        res => resolve(res),
        err => reject(err))
    });
  }

  logoutUser(){

    this.cartService.removeCart();
    localStorage.clear();

    //console.log(localStorage);

    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        firebase.auth().signOut()
        .then(() => {
          console.log("LOG OUT");
          resolve();
        }).catch((error) => {
          reject();
        });
      }
    })
  }
 
  userDetails(){
    //console.log(firebase.auth().currentUser);
    return firebase.auth().currentUser;
  }

  getEmail() {
    return this.email;
  }
}