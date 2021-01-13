import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string,
  value: number,
  type: "income" | 'outcome'
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({title, value, type}: Request): Transaction {

    if (type !== "income" && type !== "outcome") {
      throw new Error ("tpye is incorrect please put an 'income' or 'outcome' type")
    }
    const balance = this.transactionsRepository.getBalance()
    if (type =="outcome" &&  value > balance.total){

      throw new Error ("Outcome is greater than the total that you have in your account")

    } else {

      const TransactionX = this.transactionsRepository.create({title,value,type})
      return TransactionX

    }


  }
}

export default CreateTransactionService;
