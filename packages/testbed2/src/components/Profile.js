// @flow
import React from 'react';
import { useData } from '@pija-ab/next-dashboard';

import subscriberProvider from 'src/API/subscriberProvider';
import { useIdentity } from 'src/utils/dataHooks';
import readFromData from 'src/utils/readFromData';

const Profile = () => {
  const identity = useIdentity();
  if (identity == null) return null;

  const { username } = identity;
  const custInfo = useData(subscriberProvider, 'customerInfo');
  const custName = readFromData(
    custInfo,
    // TODO: ability to select between customers instead of hardcoding [0]
    ci => (ci.Customers[0] ? ci.Customers[0].customerName : '(no customers)'),
    'ERROR!',
    'Loading...',
  );
  const imgUrl = null;

  return (
    <div className="profile">
      {imgUrl != null && <div className="profile-image" />}
      <div className="profile-content">
        <div className="h5 margin-0 profile-name">{username}</div>
        <div className="profile-organization">{custName}</div>
      </div>
    </div>
  );
};

export default Profile;
