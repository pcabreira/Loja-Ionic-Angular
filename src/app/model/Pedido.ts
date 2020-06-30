
import { Produto } from '../model/Produto';

export class Pedido {
    $key: string;
    dataEntrada: Date;
    dataEntrega: Date;
    pedido: Produto[];
    status: string;
    valorTotal: string;
    idEndereco: string;
}