import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
const transactionRepository = new TransactionsRepository
import CreateTransactionService from '../services/CreateTransactionService';
const transactionService = new CreateTransactionService(transactionRepository)
const transactionRouter = Router();


transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionRepository.all()
    const balance = transactionRepository.getBalance()

    response.json({
      transactions,
      balance,
    })

  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body;


    const transaction = transactionService.execute({title,type,value})

      return response.json(transaction)
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
