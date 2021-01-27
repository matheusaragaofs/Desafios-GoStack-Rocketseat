import csvParse from 'csv-parse';
import fs from 'fs';
import { getCustomRepository, getRepository, In } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);
    // Stream que vai estar lendo nossos arquivos
    const contactsReadStream = fs.createReadStream(filePath); // estará lendo nosso filePath

    const parsers = csvParse({ from_line: 2 }); // Queremos trabalhar a partir da segunda linha, pois a primeira linha é o cabeçalho

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    const parseCSV = contactsReadStream.pipe(parsers); // o pipe vai ler as linhas conforme elas estiverem disponíveis

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);

      transactions.push({ title, type, value, category });
    });
    await new Promise(resolve => parseCSV.on('end', resolve)); // quando o evento end for emitido, ele vai retornar oque deveria fazer
    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });
    const exitentCategoryTitle = existentCategories.map(
      (category: Category) => category.title,
    );
    // ['Orders' ,'Orders' ,'Food']
    const addCategoryTitle = categories
      .filter(category => !exitentCategoryTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitle.map(title => ({ title })),
    );
    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories]; // todas as categorias que exitem no banco de dados
    const createdTransactions = transactionRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );
    await transactionRepository.save(createdTransactions);
    await fs.promises.unlink(filePath);
    return createdTransactions;
  }
}

export default ImportTransactionsService;
