// @flow
import React from 'react';
import { useData } from '@pija-ab/next-dashboard';

import dataContext, { useIdentity } from 'src/utils/dataHooks';

const Profile = () => {
  const identity = useIdentity();
  if (identity == null) return null;
  const { username } = identity;
  const custInfo = useData(dataContext, 'customerInfo');
  let custName = 'Loading...';
  if (custInfo.status === 'error') {
    custName = 'ERROR!';
  } else if (custInfo.status === 'success') {
    custName = custInfo.value.customerName;
  }
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
