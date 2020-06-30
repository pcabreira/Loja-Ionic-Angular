
import { Endereco } from '../model/Endereco';

export class Cliente {
    $key: string;
    nome: string;
    sobrenome: string;
    cpf: string;
    celular: string;
    email: string;
    senha: string;
    endereco: Endereco[];
  }