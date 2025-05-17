// @ts-nocheck
'use server';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';
import { handleError, ResponseType } from '@/lib/error-handler';
import { z } from 'zod';
import { TransactionType } from '@prisma/client';

export const getTransactions = async () => {
  const data = await prisma.transaction.findMany({});
  return data;
};

import {
  CreateTransactionSchema,
  EditTransactionSchema,
  ExpenseItemSchema,
  CreateTransactionInput,
  EditTransactionInput,
  ExpenseItemInput
} from '@/schemas/transaction-schema';

// Mock database (replace with actual Prisma client in production)
interface Transaction {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  date: Date;
  balance?: number;
  divisionId?: string | null;
  receiptUrl?: string | null;
  expenseItems: ExpenseItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface ExpenseItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

let transactions: Transaction[] = [];
let expenseItems: ExpenseItem[] = [];

// Create Transaction
async function createTransaction(
  data: CreateTransactionInput
): Promise<Transaction> {
  // Validate input
  const validatedData = CreateTransactionSchema.parse(data);

  const now = new Date();
  const transaction: Transaction = {
    type: validatedData.type,
    amount: validatedData.amount,
    description: validatedData.description,
    date: validatedData.date,
    // balance: validatedData.balance,
    divisionId: validatedData.divisionId,
    receiptUrl: validatedData.receiptUrl,
    expenseItems: [],
    createdAt: now,
    updatedAt: now
  };

  // Handle expense items for EXPENSE type
  if (validatedData.type === 'EXPENSE' && validatedData.expenseItems) {
    const newExpenseItems: ExpenseItem[] = validatedData.expenseItems.map(
      (item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        createdAt: now,
        updatedAt: now
      })
    );
    expenseItems.push(...newExpenseItems);
    transaction.expenseItems = newExpenseItems;
  }

  const result = await prisma.transaction.create({ data: transaction });
  return transaction;
}

// Edit Transaction
async function editTransaction(
  id: string,
  data: EditTransactionInput
): Promise<Transaction> {
  // Validate input
  const validatedData = EditTransactionSchema.parse({ id, ...data });

  const transactionIndex = transactions.findIndex((t) => t.id === id);
  if (transactionIndex === -1) {
    throw new Error('Transaction not found');
  }

  const now = new Date();
  const existingTransaction = transactions[transactionIndex];

  // Update transaction fields
  const updatedTransaction: Transaction = {
    ...existingTransaction,
    type: validatedData.type ?? existingTransaction.type,
    amount: validatedData.amount ?? existingTransaction.amount,
    description: validatedData.description ?? existingTransaction.description,
    date: validatedData.date ?? existingTransaction.date,
    balance: validatedData.balance ?? existingTransaction.balance,
    divisionId:
      validatedData.divisionId !== undefined
        ? validatedData.divisionId
        : existingTransaction.divisionId,
    receiptUrl:
      validatedData.receiptUrl !== undefined
        ? validatedData.receiptUrl
        : existingTransaction.receiptUrl,
    updatedAt: now
  };

  // Handle expense items update
  if (validatedData.expenseItems) {
    // Remove existing expense items for this transaction
    expenseItems = expenseItems.filter((item) => item.transactionId !== id);
    // Add new expense items
    const newExpenseItems: ExpenseItem[] = validatedData.expenseItems.map(
      (item) => ({
        transactionId: id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        createdAt: item.id ? existingTransaction.createdAt : now,
        updatedAt: now
      })
    );
    expenseItems.push(...newExpenseItems);
    updatedTransaction.expenseItems = newExpenseItems;
  } else {
    updatedTransaction.expenseItems = existingTransaction.expenseItems;
  }

  transactions[transactionIndex] = updatedTransaction;
  return updatedTransaction;
}

// Get Transaction by ID
async function getTransaction(id: string): Promise<Transaction | null> {
  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) {
    return null;
  }
  return {
    ...transaction,
    expenseItems: expenseItems.filter((item) => item.transactionId === id)
  };
}

// Get All Transactions
async function getAllTransactions(): Promise<Transaction[]> {
  return transactions.map((t) => ({
    ...t,
    expenseItems: expenseItems.filter((item) => item.transactionId === t.id)
  }));
}

// Delete Transaction
async function deleteTransaction(id: string): Promise<void> {
  const transactionIndex = transactions.findIndex((t) => t.id === id);
  if (transactionIndex === -1) {
    throw new Error('Transaction not found');
  }

  // Remove associated expense items
  expenseItems = expenseItems.filter((item) => item.transactionId !== id);
  // Remove transaction
  transactions.splice(transactionIndex, 1);
}

// Example usage
// async function example() {
//   // Create an INCOME transaction
//   const incomeTransaction = await createTransaction({
//     type: 'INCOME',
//     amount: 1000000,
//     description: 'Salary payment',
//     date: new Date(),
//     balance: 1000000
//   });
//   console.log('Created INCOME transaction:', incomeTransaction);

//   // Create an EXPENSE transaction
//   const expenseTransaction = await createTransaction({
//     type: 'EXPENSE',
//     amount: 150000,
//     description: 'Office supplies',
//     date: new Date(),
//     balance: 850000,
//     divisionId: generateUUID(),
//     receiptUrl: 'https://example.com/receipt.pdf',
//     expenseItems: [
//       { name: 'Paper', quantity: 2, unitPrice: 50000, total: 100000 },
//       { name: 'Pen', quantity: 5, unitPrice: 10000, total: 50000 }
//     ]
//   });
//   console.log('Created EXPENSE transaction:', expenseTransaction);

//   // Edit transaction
//   const updatedTransaction = await editTransaction(expenseTransaction.id, {
//     description: 'Updated office supplies',
//     amount: 200000,
//     expenseItems: [
//       { name: 'Paper', quantity: 3, unitPrice: 50000, total: 150000 },
//       { name: 'Pen', quantity: 5, unitPrice: 10000, total: 50000 }
//     ]
//   });
//   console.log('Updated transaction:', updatedTransaction);

//   // Get transaction
//   const transaction = await getTransaction(incomeTransaction.id);
//   console.log('Retrieved transaction:', transaction);

//   // Get all transactions
//   const allTransactions = await getAllTransactions();
//   console.log('All transactions:', allTransactions);

//   // Delete transaction
//   await deleteTransaction(incomeTransaction.id);
//   console.log('Deleted transaction:', incomeTransaction.id);
// }

export {
  createTransaction,
  editTransaction,
  getTransaction,
  getAllTransactions,
  deleteTransaction
};
