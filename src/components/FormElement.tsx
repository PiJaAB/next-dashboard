import { useState, useContext, useEffect } from 'react';
import { FormContext } from './Form';

interface Props<T, U = T> {
  children: (
    value: T,
    onChange: (val: T) => void,
    isValid: boolean | undefined,
  ) => JSX.Element;
  valueParser?: (raw: T) => U;
  validate(val: T): boolean | undefined;
  initialValue: T;
  id: keyof T;
}

export default function FormElement<T, U = T>({
  children,
  validate,
  initialValue,
  id,
  valueParser = (val) => (val as unknown) as U,
}: Props<T, U>): JSX.Element {
  const ctx = useContext(FormContext);
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    ctx.register(id as string, {
      validate: (val: T) => validate(val),
      getValue: (() => valueParser(value)) as <Q>() => Q,
    });
    return () => ctx.unregister(id as string);
  }, [ctx, id, validate, value, valueParser]);

  return children(
    value,
    (val) => {
      ctx.validate(id as string, val);
      setValue(() => val);
    },
    ctx.valid[id as string],
  );
}
