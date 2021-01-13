/* eslint-disable @typescript-eslint/class-name-casing */
import { response } from 'express';
import Transaction from '../models/Transaction';

interface createTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome' ;
}
interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions
  }

  public getBalance(): Balance {


    const transactions = this.transactions

    var income = 0
    var outcome = 0

    transactions.forEach(transaction => {
      if (transaction.type == 'income'){
        income += transaction.value
      }
      else if (transaction.type =='outcome'){
        outcome+= transaction.value
      }
      else{
        income+=0
        outcome+=0
      }
    })

    var total =  income - outcome
    const balance = {
      income,
      outcome,
      total
    }




    return balance
  }

  public create({ title, value, type }: createTransactionDTO): Transaction {
      const TransactionX = new Transaction({title,type,value})
        this.transactions.push(TransactionX)
        return TransactionX



  }
}

export default TransactionsRepository;
