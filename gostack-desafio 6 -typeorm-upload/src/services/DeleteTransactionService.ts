import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);
    const deletedTransaction = await transactionRepository.findOne({
      where: { id },
    });

    if (deletedTransaction) {
      await transactionRepository.delete(deletedTransaction.id);
    } else {
      throw new AppError(
        "Can't find any transaction with the given id, please try another one",
      );
    }
  }
}

export default DeleteTransactionService;
