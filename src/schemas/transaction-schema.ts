import { z } from 'zod';

// Enum for TransactionType
const TransactionTypeEnum = z.enum(['INCOME', 'EXPENSE']);

// Schema for ExpenseItem (used in create/edit transaction)
const ExpenseItemSchema = z
  .object({
    id: z.string().uuid().optional(), // Optional for create, required for edit if provided
    name: z.string().min(1, 'Item name is required'),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
    unitPrice: z
      .number()
      .int()
      .positive('Unit price must be a positive integer'),
    total: z.number().int().positive('Total must be a positive integer')
  })
  .refine((data) => data.total === data.quantity * data.unitPrice, {
    message: 'Total must equal quantity * unitPrice',
    path: ['total']
  });

// Base Transaction schema (shared between create and edit)
const BaseTransactionSchema = z.object({
  type: TransactionTypeEnum,
  amount: z.number().int().positive('Amount must be a positive integer'),
  description: z.string().min(1, 'Description is required'),
  date: z.coerce.date().default(() => new Date()),
  divisionId: z.string().uuid().optional().nullable(), // Optional, only for EXPENSE
  receiptUrl: z.string().url().optional().nullable(), // Optional, only for EXPENSE
  expenseItems: z.array(ExpenseItemSchema).optional() // Only for EXPENSE
});

// Create Transaction schema
const CreateTransactionSchema = BaseTransactionSchema.refine(
  (data) => {
    if (data.type === 'EXPENSE') {
      return (
        data.divisionId != null &&
        data.expenseItems != null &&
        data.expenseItems.length > 0
      );
    }
    return (
      data.divisionId == null &&
      data.receiptUrl == null &&
      (data.expenseItems == null || data.expenseItems.length === 0)
    );
  },
  {
    message:
      'For EXPENSE: divisionId and expenseItems are required. For INCOME: divisionId, receiptUrl, and expenseItems must be null or empty.',
    path: []
  }
).refine(
  (data) => {
    if (data.type === 'EXPENSE' && data.expenseItems) {
      const itemsTotal = data.expenseItems.reduce(
        (sum, item) => sum + item.total,
        0
      );
      return itemsTotal === data.amount;
    }
    return true;
  },
  {
    message:
      'Sum of expenseItems total must equal transaction amount for EXPENSE',
    path: ['amount']
  }
);

// Edit Transaction schema (includes id, allows partial updates)
const EditTransactionSchema = BaseTransactionSchema.extend({
  id: z.string().uuid('Invalid transaction ID')
})
  .partial({
    type: true,
    amount: true,
    description: true,
    date: true,
    divisionId: true,
    receiptUrl: true,
    expenseItems: true
  })
  .refine(
    (data) => {
      if (data.type === 'EXPENSE') {
        return (
          data.divisionId != null &&
          data.expenseItems != null &&
          data.expenseItems.length > 0
        );
      }
      return (
        data.divisionId == null &&
        data.receiptUrl == null &&
        (data.expenseItems == null || data.expenseItems.length === 0)
      );
    },
    {
      message:
        'For EXPENSE: divisionId and expenseItems are required. For INCOME: divisionId, receiptUrl, and expenseItems must be null or empty.',
      path: []
    }
  )
  .refine(
    (data) => {
      if (data.type === 'EXPENSE' && data.expenseItems && data.amount != null) {
        const itemsTotal = data.expenseItems.reduce(
          (sum, item) => sum + item.total,
          0
        );
        return itemsTotal === data.amount;
      }
      return true;
    },
    {
      message:
        'Sum of expenseItems total must equal transaction amount for EXPENSE',
      path: ['amount']
    }
  );

// Export schemas and types
export { CreateTransactionSchema, EditTransactionSchema, ExpenseItemSchema };
export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
export type EditTransactionInput = z.infer<typeof EditTransactionSchema>;
export type ExpenseItemInput = z.infer<typeof ExpenseItemSchema>;
