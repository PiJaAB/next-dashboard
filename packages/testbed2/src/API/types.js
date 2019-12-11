// @flow

export type Identity = {
  username: string,
  accessToken: string,
  customerId: string,
};

export type Scores = {|
  Volume: number,
  Quality: number,
  Resources: number,
  Leadership: number,
  Average: number,
|};

export type ScoresObj = {
  Period: string,
  ...Scores,
};

export type Overview = {
  PeriodScores: ScoresObj[],
  TtotalScore: ScoresObj,
};

export type CustInfo = {
  customerName: string,
  CustNo: string,
  Summary: string,
  PrognoseInfo: string,
  CustomerContacts: string,
};

export type Data = {|
  overview: Overview,
  overviewChart: Overview,
  customerInfo: CustInfo,
|};

export type Fetch = {
  ApiToken: string,
  AuthUsername: string,
};
