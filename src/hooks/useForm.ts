import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';
import type { UseFormProps } from 'react-hook-form';

export function useForm<T extends Record<string, any>>(
  schema: ZodType<T>,
  options?: Omit<UseFormProps<T>, 'resolver'>
) {
  return useHookForm<T>({
    ...options,
    resolver: zodResolver(schema)
  });
}