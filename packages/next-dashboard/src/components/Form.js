// @flow
import React from 'react';

import areEqualShallow from '../utils/areEqualShallow';

export const ALL = Symbol('all');

type FormCTX = {
  submit(): void,
  register(
    id: string,
    element: {
      validate(any): boolean | void,
      getValue<T>(): T,
    },
  ): void,
  unregister(id: string): void,
  validate<T>(id: string, val: T): boolean | void,
  validateAll(): { [string | typeof ALL]: boolean },
  valid: { [string]: boolean | void },
};

type State = {
  ctx: $Diff<FormCTX, { valid: $PropertyType<FormCTX, 'valid'> }>,
  valid: $PropertyType<FormCTX, 'valid'>,
};

type Props = {
  children: React$Node,
};

const defaultContext: FormCTX = {
  submit: () => {},
  register: () => {},
  unregister: () => {},
  validate: () => {},
  validateAll: () => ({}),
  valid: {},
};

export const FormContext = React.createContext<FormCTX>(defaultContext);
FormContext.displayName = 'Form Context';

export default class Form extends React.PureComponent<Props, State> {
  validators: { [string]: (any) => boolean | void };

  getters: { [string]: <T>() => T };

  constructor() {
    super();
    const self = this;
    this.validators = {};
    this.getters = {};
    this.state = {
      ctx: {
        submit() {},
        register: (id, element) => {
          self.validators[id] = element.validate;
          self.getters[id] = element.getValue;
        },
        unregister: id => {
          delete self.validators[id];
          delete self.getters[id];
          self.setState(state => {
            const { valid } = state;
            if (!(id in valid)) return {};
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

  validate(id: string, val: any): boolean | void {
    const validator = this.validators[id];
    if (!validator) {
      return undefined;
    }
    const isValid = validator(val);
    this.setState(state => {
      const { valid } = state;
      if (valid[id] === isValid) return {};
      return { valid: { ...valid, [id]: isValid } };
    });
    return isValid;
  }

  validateAll(): { [string | typeof ALL]: boolean } {
    const { validators, getters } = this;
    const ids: string[] = Object.keys(validators);
    let isAllValid = true;
    const valid: { [string]: boolean | void } = {};

    const validArr = ids.map(id => {
      return validators[id](getters[id]());
    });

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      isAllValid = isAllValid && validArr[i];
      valid[id] = validArr[i];
    }

    this.setState(state => {
      const { valid: stateValid } = state;
      if (areEqualShallow(valid, stateValid)) return {};
      return { valid };
    });

    return { ...valid, [ALL]: isAllValid };
  }

  render() {
    const { children } = this.props;
    const { ctx, valid } = this.state;
    return (
      <FormContext.Provider value={{ ...ctx, valid }}>
        {children}
      </FormContext.Provider>
    );
  }
}
