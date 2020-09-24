import { getCustomRepository, getRepository } from "typeorm";
import AppError from '../errors/AppError';


import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from "../repositories/TransactionsRepository"


interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    if (type === "outcome"){
      const { total } = await transactionsRepository.getBalance();
      if (value > total){
        throw new AppError("Insufficient funds")
      }

    }

    let transactionCategory = await categoryRepository.findOne({
      where: { title: category }
    });

    if (!transactionCategory){
        transactionCategory = categoryRepository.create({
        title: category
      })

      await categoryRepository.save(transactionCategory);

    }

      const transaction = transactionsRepository.create({
        title,
        value,
        type,
        category: transactionCategory
      })
    

      await transactionsRepository.save(transaction);
    //não utilizar transactionCategory.title pois o relacionamento entre a coluna category da table transactions  e a tabela category já está indicado no model de transactions
      console.log(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
