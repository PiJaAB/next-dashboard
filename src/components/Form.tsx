import React from 'react';

import areEqualShallow from '../utils/areEqualShallow';

export const FORM_ALL_VALID = Symbol('all');

interface FormCTX {
  submit(): void;
  register(
    id: string,
    element: {
      validate(val: any): boolean | undefined;
      getValue<T>(): T;
    },
  ): void;
  unregister(id: string): void;
  validate<T>(id: string, val: T): boolean | undefined;
  validateAll(): Partial<Record<string, boolean>> & {
    [FORM_ALL_VALID]: boolean;
  };
  valid: Partial<Record<string, boolean>>;
}

interface State {
  ctx: Omit<FormCTX, 'valid'>;
  valid: FormCTX['valid'];
}

type Props = React.PropsWithChildren<{}>;

const defaultContext: FormCTX = {
  submit: () => {},
  register: () => {},
  unregister: () => {},
  validate: () => {
    return undefined;
  },
  validateAll: () => ({ [FORM_ALL_VALID]: false }),
  valid: {},
};

export const FormContext = React.createContext<FormCTX>(defaultContext);
FormContext.displayName = 'FormContext';

export default class Form extends React.PureComponent<Props, State> {
  validators: Record<string, (val: any) => boolean | undefined>;

  getters: Record<string, <T>() => T>;

  constructor(props: Props) {
    super(props);
    this.validators = {};
    this.getters = {};
    this.state = {
      ctx: {
        submit() {},
        register: (id, element) => {
          this.validators[id] = element.validate;
          this.getters[id] = element.getValue;
        },
        unregister: (id) => {
          delete this.validators[id];
          delete this.getters[id];
          this.setState((state) => {
            const { valid } = state;
            if (!(id in valid)) return null;
            const newValid = { ...valid };
            delete newValid[id];
            return { valid: newValid };
          });
        },
        validate: (id, val) => this.validate(id, val),
        validateAll: () => this.validateAll(),
      },
      valid: {},
    };
  }

  validate(id: string, val: unknown): boolean | undefined {
    const validator = this.validators[id];
    if (!validator) {
      return undefined;
    }
    const isValid = validator(val);
    this.setState((state) => {
      const { valid } = state;
      if (valid[id] === isValid) return null;
      return { valid: { ...valid, [id]: isValid } };
    });
    return isValid;
  }

  validateAll(): { [key in string | typeof FORM_ALL_VALID]: boolean } {
    const { validators, getters } = this;
    const ids: string[] = Object.keys(validators);
    let isAllValid = true;
    const valid: Partial<Record<string, boolean>> = {};

    const validArr = ids.map((id) => {
      return validators[id](getters[id]());
    });

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      isAllValid = Boolean(isAllValid && validArr[i]);
      valid[id] = validArr[i];
    }

    this.setState((state) => {
      const { valid: stateValid } = state;
      if (areEqualShallow(valid, stateValid)) return null;
      return { valid };
    });

    return { ...valid, [FORM_ALL_VALID]: isAllValid };
  }

  render(): JSX.Element {
    const { children } = this.props;
    const { ctx, valid } = this.state;
    return (
      <FormContext.Provider value={{ ...ctx, valid }}>
        {children}
      </FormContext.Provider>
    );
  }
}
