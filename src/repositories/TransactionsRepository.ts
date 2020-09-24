import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {

    const transactions = await this.find();

    //como já estamos dentro da classe que extende o próprio repositório, podemos usar o this para se referenciar para dentro da classe e o método find

    const income = transactions.filter(transaction => {
      return transaction.type === "income"
    }).reduce((total, transaction) =>{
    return total + Number(transaction.value)
  },0)
  

  const outcome = transactions.filter(transaction => {
    return transaction.type === "outcome"
  }).reduce((total, transaction) =>{
  return total + Number(transaction.value)
},0)


const total = income - outcome;

const balance = {
  income,
  outcome,
  total,
}

return balance;
  }
}

export default TransactionsRepository;
