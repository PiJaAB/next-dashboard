// @flow
import React from 'react';

import { DashboardContext } from '../utils/createDashboardHOC';
import areEqualShallow from '../utils/areEqualShallow';

export const ALL = Symbol('all');

type FormCTX = {
  submit(): void,
  onValidate(id: string, func: () => Promise<boolean> | boolean): void,
  offValidate(id: string): void,
  reset(id?: string): void,
  valid: { [string]: boolean },
};

type State = {
  ctx: $Diff<FormCTX, { valid: $PropertyType<FormCTX, 'valid'> }>,
  valid: $PropertyType<FormCTX, 'valid'>,
};

type Props = {
  children: React$Node,
};

export const FormContext = React.createContext<void | FormCTX>();
FormContext.displayName = 'Form Context';

export default class Form extends React.PureComponent<Props, State> {
  validators: { [string]: () => Promise<boolean> | boolean };

  constructor() {
    super();
    const self = this;
    this.validators = {};
    this.state = {
      ctx: {
        submit() {},
        onValidate(id: string, func: () => Promise<boolean> | boolean) {
          self.validators[id] = func;
        },
        offValidate(id: string) {
          delete self.validators[id];
          self.setState(state => {
            const { valid } = state;
            if (!(id in valid)) return {};
            const newValid = { ...valid };
            delete newValid[id];
            return newValid;
          });
        },
        reset(id?: string) {
          self.setState(state => {
            if (!id) return { valid: {} };
            const { valid } = state;
            if (!(id in valid)) return {};
            const newValid = { ...valid };
            delete newValid[id];
            return newValid;
          });
        },
      },
      valid: {},
    };
  }

  async validate(id: string): Promise<boolean> {
    const validator = this.validators[id];
    if (!validator) {
      throw new Error(`Id \`${id}\` does not have a registered validator.`);
    }
    const isValid = await validator();
    this.setState(state => {
      const { valid } = state;
      if (valid[id] === isValid) return {};
      return { valid: { ...valid, [id]: isValid } };
    });
    return isValid;
  }

  async validateAll(): Promise<{ [string | typeof ALL]: boolean }> {
    const { validators } = this;
    const ids: string[] = Object.keys(validators);
    let isAllValid = true;
    const valid: { [string]: boolean } = {};

    const validArr = await Promise.all(
      ids.map(id => {
        return validators[id]();
      }),
    );

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

  static contextType = DashboardContext;

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
