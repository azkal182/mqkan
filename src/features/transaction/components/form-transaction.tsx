// 'use client';

// import { useState, useEffect } from 'react';
// import { useForm, useFieldArray, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/components/ui/table';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Trash2 } from 'lucide-react';
// import {
//   CreateTransactionSchema,
//   EditTransactionSchema,
//   CreateTransactionInput,
//   EditTransactionInput,
//   ExpenseItemInput
// } from '@/schemas/transaction-schema';
// // import {
// //   createTransaction,
// //   editTransaction
// // } from '@/actions/transaction-action';

// // Mock divisions (replace with API call)
// const divisions = [
//   { id: 'div1', name: 'Marketing' },
//   { id: 'div2', name: 'Finance' }
// ];

// interface TransactionFormProps {
//   transaction?: Transaction; // For edit mode
//   onSubmitSuccess?: () => void;
// }

// interface Transaction {
//   id: string;
//   type: 'INCOME' | 'EXPENSE';
//   amount: number;
//   description: string;
//   date: Date;
//   balance: number;
//   divisionId?: string | null;
//   receiptUrl?: string | null;
//   expenseItems: ExpenseItemInput[];
// }

// export default function TransactionForm({
//   transaction,
//   onSubmitSuccess
// }: TransactionFormProps) {
//   const isEditMode = !!transaction;
//   const schema = isEditMode ? EditTransactionSchema : CreateTransactionSchema;
//   const defaultValues = isEditMode
//     ? {
//         id: transaction.id,
//         type: transaction.type,
//         amount: transaction.amount,
//         description: transaction.description,
//         date: transaction.date.toISOString().split('T')[0],
//         balance: transaction.balance,
//         divisionId: transaction.divisionId,
//         receiptUrl: transaction.receiptUrl,
//         expenseItems: transaction.expenseItems
//       }
//     : {
//         type: 'INCOME' as const,
//         amount: 0,
//         description: '',
//         date: new Date(),
//         balance: 0,
//         divisionId: null,
//         receiptUrl: null,
//         expenseItems: []
//       };

//   const {
//     control,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors, isSubmitting }
//   } = useForm<CreateTransactionInput | EditTransactionInput>({
//     resolver: zodResolver(schema),
//     defaultValues
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: 'expenseItems'
//   });

//   const transactionType = watch('type');

//   const onSubmit = async (
//     data: CreateTransactionInput | EditTransactionInput
//   ) => {
//     try {
//       if (isEditMode) {
//         // await editTransaction(transaction!.id, data as EditTransactionInput);
//       } else {
//         // await createTransaction(data as CreateTransactionInput);
//       }
//       onSubmitSuccess?.();
//     } catch (error) {
//       console.error('Failed to submit transaction:', error);
//     }
//   };

//   const addExpenseItem = () => {
//     append({ name: '', quantity: 1, unitPrice: 0, total: 0 });
//   };

//   return (
//     <Card className='mx-auto max-w-2xl'>
//       <CardHeader>
//         <CardTitle>
//           {isEditMode ? 'Edit Transaction' : 'Create Transaction'}
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
//           {/* Transaction Type */}
//           <div className='space-y-2'>
//             <Label htmlFor='type'>Transaction Type</Label>
//             <Controller
//               control={control}
//               name='type'
//               render={({ field }) => (
//                 <Select onValueChange={field.onChange} value={field.value}>
//                   <SelectTrigger>
//                     <SelectValue placeholder='Select type' />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value='INCOME'>Income</SelectItem>
//                     <SelectItem value='EXPENSE'>Expense</SelectItem>
//                   </SelectContent>
//                 </Select>
//               )}
//             />
//             {errors.type && (
//               <p className='text-sm text-red-500'>{errors.type.message}</p>
//             )}
//           </div>

//           {/* Amount */}
//           <div className='space-y-2'>
//             <Label htmlFor='amount'>Amount</Label>
//             <Controller
//               control={control}
//               name='amount'
//               render={({ field }) => (
//                 <Input
//                   type='number'
//                   {...field}
//                   onChange={(e) => field.onChange(parseInt(e.target.value))}
//                 />
//               )}
//             />
//             {errors.amount && (
//               <p className='text-sm text-red-500'>{errors.amount.message}</p>
//             )}
//           </div>

//           {/* Description */}
//           <div className='space-y-2'>
//             <Label htmlFor='description'>Description</Label>
//             <Controller
//               control={control}
//               name='description'
//               render={({ field }) => <Input {...field} />}
//             />
//             {errors.description && (
//               <p className='text-sm text-red-500'>
//                 {errors.description.message}
//               </p>
//             )}
//           </div>

//           {/* Date */}
//           <div className='space-y-2'>
//             <Label htmlFor='date'>Date</Label>
//             <Controller
//               control={control}
//               name='date'
//               render={({ field }) => (
//                 <Input
//                   type='date'
//                   {...field}
//                   value={
//                     field.value instanceof Date
//                       ? field.value.toISOString().split('T')[0]
//                       : field.value
//                   }
//                   onChange={(e) => field.onChange(e.target.value)}
//                 />
//               )}
//             />
//             {errors.date && (
//               <p className='text-sm text-red-500'>{errors.date.message}</p>
//             )}
//           </div>

//           {/* Balance */}
//           <div className='space-y-2'>
//             <Label htmlFor='balance'>Balance</Label>
//             <Controller
//               control={control}
//               name='balance'
//               render={({ field }) => (
//                 <Input
//                   type='number'
//                   {...field}
//                   onChange={(e) => field.onChange(parseInt(e.target.value))}
//                 />
//               )}
//             />
//             {errors.balance && (
//               <p className='text-sm text-red-500'>{errors.balance.message}</p>
//             )}
//           </div>

//           {/* Division (EXPENSE only) */}
//           {transactionType === 'EXPENSE' && (
//             <div className='space-y-2'>
//               <Label htmlFor='divisionId'>Division</Label>
//               <Controller
//                 control={control}
//                 name='divisionId'
//                 render={({ field }) => (
//                   <Select
//                     onValueChange={field.onChange}
//                     value={field.value || undefined}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder='Select division' />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {divisions.map((division) => (
//                         <SelectItem key={division.id} value={division.id}>
//                           {division.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 )}
//               />
//               {errors.divisionId && (
//                 <p className='text-sm text-red-500'>
//                   {errors.divisionId.message}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Receipt URL (EXPENSE only) */}
//           {transactionType === 'EXPENSE' && (
//             <div className='space-y-2'>
//               <Label htmlFor='receiptUrl'>Receipt URL</Label>
//               <Controller
//                 control={control}
//                 name='receiptUrl'
//                 render={({ field }) => (
//                   <Input {...field} value={field.value || ''} />
//                 )}
//               />
//               {errors.receiptUrl && (
//                 <p className='text-sm text-red-500'>
//                   {errors.receiptUrl.message}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Expense Items (EXPENSE only) */}
//           {transactionType === 'EXPENSE' && (
//             <div className='space-y-4'>
//               <Label>Expense Items</Label>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Quantity</TableHead>
//                     <TableHead>Unit Price</TableHead>
//                     <TableHead>Total</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {fields.map((item, index) => (
//                     <TableRow key={item.id}>
//                       <TableCell>
//                         <Controller
//                           control={control}
//                           name={`expenseItems.${index}.name`}
//                           render={({ field }) => <Input {...field} />}
//                         />
//                         {errors.expenseItems?.[index]?.name && (
//                           <p className='text-sm text-red-500'>
//                             {errors.expenseItems[index].name.message}
//                           </p>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Controller
//                           control={control}
//                           name={`expenseItems.${index}.quantity`}
//                           render={({ field }) => (
//                             <Input
//                               type='number'
//                               {...field}
//                               onChange={(e) => {
//                                 field.onChange(parseInt(e.target.value));
//                                 const quantity = parseInt(e.target.value);
//                                 const unitPrice =
//                                   watch(`expenseItems.${index}.unitPrice`) || 0;
//                                 setValue(
//                                   `expenseItems.${index}.total`,
//                                   quantity * unitPrice
//                                 );
//                               }}
//                             />
//                           )}
//                         />
//                         {errors.expenseItems?.[index]?.quantity && (
//                           <p className='text-sm text-red-500'>
//                             {errors.expenseItems[index].quantity.message}
//                           </p>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Controller
//                           control={control}
//                           name={`expenseItems.${index}.unitPrice`}
//                           render={({ field }) => (
//                             <Input
//                               type='text'
//                               inputMode='numeric'
//                               pattern='[0-9]*'
//                               {...field}
//                               onChange={(e) => {
//                                 const rawValue = e.target.value;
//                                 // hanya izinkan angka
//                                 if (/^\d*$/.test(rawValue)) {
//                                   const unitPrice = parseInt(rawValue || '0');
//                                   field.onChange(unitPrice);

//                                   const quantity =
//                                     watch(`expenseItems.${index}.quantity`) ||
//                                     '0';

//                                   setValue(
//                                     `expenseItems.${index}.total`,
//                                     Number(quantity) * Number(unitPrice)
//                                   );
//                                 }
//                               }}
//                             />
//                           )}
//                         />

//                         {errors.expenseItems?.[index]?.unitPrice && (
//                           <p className='text-sm text-red-500'>
//                             {errors.expenseItems[index].unitPrice.message}
//                           </p>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Controller
//                           control={control}
//                           name={`expenseItems.${index}.total`}
//                           render={({ field }) => (
//                             <Input type='number' {...field} readOnly />
//                           )}
//                         />
//                         {errors.expenseItems?.[index]?.total && (
//                           <p className='text-sm text-red-500'>
//                             {errors.expenseItems[index].total.message}
//                           </p>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Button
//                           type='button'
//                           variant='destructive'
//                           size='icon'
//                           onClick={() => remove(index)}
//                         >
//                           <Trash2 className='h-4 w-4' />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//               <Button type='button' onClick={addExpenseItem}>
//                 Add Expense Item
//               </Button>
//               {errors.expenseItems && (
//                 <p className='text-sm text-red-500'>
//                   {errors.expenseItems.message}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Submit Button */}
//           <Button type='submit' disabled={isSubmitting}>
//             {isSubmitting ? 'Submitting...' : isEditMode ? 'Update' : 'Create'}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import {
  CreateTransactionSchema,
  EditTransactionSchema,
  CreateTransactionInput,
  EditTransactionInput,
  ExpenseItemInput
} from '@/schemas/transaction-schema';
// import {
//   createTransaction,
//   editTransaction
// } from "@/actions/transaction-action";

// Mock divisions (replace with API call)
const divisions = [
  { id: 'e39bff76-dbfa-4fbc-8ef1-2a5924f8d423', name: 'Marketing' },
  { id: 'ab07e1bb-0bf8-46ab-83c8-c396aa5e6186', name: 'Finance' }
];

interface TransactionFormProps {
  transaction?: Transaction; // For edit mode
  onSubmitSuccess?: () => void;
}

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  date: Date;
  divisionId?: string | null;
  receiptUrl?: string | null;
  expenseItems: ExpenseItemInput[];
}

export default function TransactionForm({
  transaction,
  onSubmitSuccess
}: TransactionFormProps) {
  const isEditMode = !!transaction;
  const schema = isEditMode ? EditTransactionSchema : CreateTransactionSchema;
  const defaultValues = isEditMode
    ? {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
        divisionId: transaction.divisionId,
        receiptUrl: transaction.receiptUrl,
        expenseItems: transaction.expenseItems
      }
    : {
        type: 'INCOME' as const,
        amount: 0,
        description: '',
        date: new Date(),
        divisionId: null,
        receiptUrl: null,
        expenseItems: []
      };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CreateTransactionInput | EditTransactionInput>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'expenseItems'
  });

  const transactionType = watch('type');

  // Function to update amount based on expenseItems
  const updateAmount = (updatedItems: ExpenseItemInput[]) => {
    if (transactionType === 'EXPENSE') {
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + (item.total || 0),
        0
      );
      setValue('amount', totalAmount);
    }
  };

  const onSubmit = async (
    data: CreateTransactionInput | EditTransactionInput
  ) => {
    try {
      if (isEditMode) {
        console.log(data);
        // await editTransaction(transaction!.id, data as EditTransactionInput);
      } else {
        console.log(data);
        // await createTransaction(data as CreateTransactionInput);
      }
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Failed to submit transaction:', error);
    }
  };

  const addExpenseItem = () => {
    append({ name: '', quantity: 1, unitPrice: 0, total: 0 });
  };

  return (
    <Card className='mx-auto max-w-2xl'>
      <CardHeader>
        <CardTitle>
          {isEditMode ? 'Edit Transaction' : 'Create Transaction'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Transaction Type */}
          <div className='space-y-2'>
            <Label htmlFor='type'>Transaction Type</Label>
            <Controller
              control={control}
              name='type'
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='INCOME'>Pemasukan</SelectItem>
                    <SelectItem value='EXPENSE'>Pengeluaran</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className='text-sm text-red-500'>{errors.type.message}</p>
            )}
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Controller
              control={control}
              name='description'
              render={({ field }) => <Input {...field} />}
            />
            {errors.description && (
              <p className='text-sm text-red-500'>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className='space-y-2'>
            <Label htmlFor='amount'>Amount</Label>
            <Controller
              control={control}
              name='amount'
              render={({ field }) => (
                <Input
                  type='number'
                  {...field}
                  readOnly={transactionType === 'EXPENSE'}
                  onChange={(e) =>
                    transactionType === 'INCOME' &&
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                  className={transactionType === 'EXPENSE' ? 'bg-gray-100' : ''}
                />
              )}
            />
            {errors.amount && (
              <p className='text-sm text-red-500'>{errors.amount.message}</p>
            )}
          </div>

          {/* Date */}
          <div className='space-y-2'>
            <Label htmlFor='date'>Date</Label>
            <Controller
              control={control}
              name='date'
              render={({ field }) => (
                <Input
                  type='date'
                  {...field}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split('T')[0]
                      : field.value
                  }
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            {errors.date && (
              <p className='text-sm text-red-500'>{errors.date.message}</p>
            )}
          </div>

          {/* Division (EXPENSE only) */}
          {transactionType === 'EXPENSE' && (
            <div className='space-y-2'>
              <Label htmlFor='divisionId'>Division</Label>
              <Controller
                control={control}
                name='divisionId'
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select division' />
                    </SelectTrigger>
                    <SelectContent>
                      {divisions.map((division) => (
                        <SelectItem key={division.id} value={division.id}>
                          {division.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.divisionId && (
                <p className='text-sm text-red-500'>
                  {errors.divisionId.message}
                </p>
              )}
            </div>
          )}

          {/* Receipt URL (EXPENSE only) */}
          {transactionType === 'EXPENSE' && (
            <div className='space-y-2'>
              <Label htmlFor='receiptUrl'>Receipt URL</Label>
              <Controller
                control={control}
                name='receiptUrl'
                render={({ field }) => (
                  <Input {...field} value={field.value || ''} />
                )}
              />
              {errors.receiptUrl && (
                <p className='text-sm text-red-500'>
                  {errors.receiptUrl.message}
                </p>
              )}
            </div>
          )}

          {/* Expense Items (EXPENSE only) */}
          {transactionType === 'EXPENSE' && (
            <div className='space-y-4'>
              <Label>Expense Items</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Controller
                          control={control}
                          name={`expenseItems.${index}.name`}
                          render={({ field }) => <Input {...field} />}
                        />
                        {errors.expenseItems?.[index]?.name && (
                          <p className='text-sm text-red-500'>
                            {errors.expenseItems[index].name.message}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Controller
                          control={control}
                          name={`expenseItems.${index}.quantity`}
                          render={({ field }) => (
                            <Input
                              type='number'
                              {...field}
                              onChange={(e) => {
                                const quantity = parseInt(e.target.value) || 0;
                                field.onChange(quantity);
                                const unitPrice =
                                  watch(`expenseItems.${index}.unitPrice`) || 0;
                                const newTotal = quantity * unitPrice;
                                setValue(
                                  `expenseItems.${index}.total`,
                                  newTotal
                                );
                                // Update amount
                                // @ts-ignore
                                const updatedItems = watch('expenseItems').map(
                                  (item, i) =>
                                    i === index
                                      ? { ...item, total: newTotal }
                                      : item
                                );
                                updateAmount(updatedItems);
                              }}
                            />
                          )}
                        />
                        {errors.expenseItems?.[index]?.quantity && (
                          <p className='text-sm text-red-500'>
                            {errors.expenseItems[index].quantity.message}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Controller
                          control={control}
                          name={`expenseItems.${index}.unitPrice`}
                          render={({ field }) => (
                            <Input
                              type='number'
                              {...field}
                              onChange={(e) => {
                                const unitPrice = parseInt(e.target.value) || 0;
                                field.onChange(unitPrice);
                                const quantity =
                                  watch(`expenseItems.${index}.quantity`) || 0;
                                const newTotal = quantity * unitPrice;
                                setValue(
                                  `expenseItems.${index}.total`,
                                  newTotal
                                );
                                // Update amount
                                // @ts-ignore
                                const updatedItems = watch('expenseItems').map(
                                  (item, i) =>
                                    i === index
                                      ? { ...item, total: newTotal }
                                      : item
                                );
                                updateAmount(updatedItems);
                              }}
                            />
                          )}
                        />
                        {errors.expenseItems?.[index]?.unitPrice && (
                          <p className='text-sm text-red-500'>
                            {errors.expenseItems[index].unitPrice.message}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Controller
                          control={control}
                          name={`expenseItems.${index}.total`}
                          render={({ field }) => (
                            <Input type='number' {...field} readOnly />
                          )}
                        />
                        {errors.expenseItems?.[index]?.total && (
                          <p className='text-sm text-red-500'>
                            {errors.expenseItems[index].total.message}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          type='button'
                          variant='destructive'
                          size='icon'
                          onClick={() => {
                            remove(index);
                            // Update amount after removal
                            // @ts-ignore
                            const updatedItems = watch('expenseItems').filter(
                              (_, i) => i !== index
                            );
                            updateAmount(updatedItems);
                          }}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button type='button' onClick={addExpenseItem}>
                Add Expense Item
              </Button>
              {errors.expenseItems && (
                <p className='text-sm text-red-500'>
                  {errors.expenseItems.message}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : isEditMode ? 'Update' : 'Create'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
