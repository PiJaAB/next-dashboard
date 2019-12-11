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

export type ScoresObj = {|
  Period: string,
  ...Scores,
|};

export type Overview = {
  periodScores: ScoresObj[],
  totalScore: ScoresObj,
};

export type CustInfo = {
  Customers: {
    customerName: string,
    CustNo: string,
    Summary: string,
    PrognoseInfo: string,
    CustomerContacts: string,
  }[],
};

export type Data = {|
  overview: Overview,
  customerInfo: CustInfo,
|};

export type Fetch = {
  ApiToken: string,
  AuthUsername: string,
};
