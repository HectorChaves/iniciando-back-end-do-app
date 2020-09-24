
import { getCustomRepository } from "typeorm";
import AppError from "../errors/AppError";

import Transaction from '../models/Transaction';
import TransactionsRepository from "../repositories/TransactionsRepository"
// import AppError from '../errors/AppError';

interface Request{
  id: string
}

class DeleteTransactionService {
  public async execute(id: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionToDelete = await transactionsRepository.findOne({
      where: id
    });

    if (!transactionToDelete){
      throw new AppError("Transaction does not exist")
    }

    await transactionsRepository.remove(transactionToDelete);

    return 
  }
}

export default DeleteTransactionService;
