// @flow
import { useState, useContext, useEffect } from 'react';
/*:: import * as R from 'react'; */
import { FormContext } from './Form';

type Props<T, U = T> = {
  children: (
    value: T,
    onChange: (val: T) => void,
    isValid: boolean | void,
  ) => R.Node,
  valueParser?: T => U,
  validate(T): boolean | void,
  initialValue: T,
  id: string,
};

export default function FormElement<T, U = T>({
  children,
  validate,
  initialValue,
  id,
  valueParser = val => val,
}: Props<T, U>): R.Node {
  const ctx = useContext(FormContext);
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    return () => ctx.unregister(id);
  }, [ctx.register, ctx.unregister]);
  useEffect(() => {
    ctx.register(id, {
      validate: (val: T) => validate(val),
      // $FlowIssue: This is impossible to type without runtime typechecking
      getValue: () => valueParser(value),
    });
  }, [validate, value]);

  return children(
    value,
    val => {
      ctx.validate(id, val);
      setValue(() => val);
    },
    ctx.valid[id],
  );
}
