// @flow
import React from 'react';

import { useIdentity, useCurrentCustomerInfo } from 'src/utils/dataHooks';
import readFromData from 'src/utils/readFromData';

const Profile = () => {
  const identity = useIdentity();
  if (identity == null) return null;

  const { username } = identity;
  const customer = useCurrentCustomerInfo();
  const custName = readFromData(
    customer,
    c => (c ? c.customerName : '(no customers)'),
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
