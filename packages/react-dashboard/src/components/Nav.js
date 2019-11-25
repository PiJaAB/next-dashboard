// @flow

import { Component, PureComponent } from 'react';

type Props = {};

// Abstract meant for extending
// eslint-disable-next-line react/prefer-stateless-function
export default class Nav<P: Props> extends Component<P> {}
export class PureNav<P: Props> extends PureComponent<P> {}
