// @flow
import React, { useContext } from 'react';

//import DashboardContext from '../utils/dashboardContext';

const Profile = () => {
  // const ctx = useContext(DashboardContext);
  const ctx = null;
  if (ctx == null) return null;
  const identity = ctx.dataProvider.getIdentity();
  if (identity == null) return null;
  const { imgUrl, displayName, subName } = identity;
  if (imgUrl == null && displayName == null && subName == null) return null;
  return (
    <div className="profile">
      {imgUrl != null && <div className="profile-image" />}
      {displayName != null && (
        <div className="profile-content">
          <div className="h5 margin-0 profile-name">{displayName}</div>
          {subName != null && (
            <div className="profile-organization">{subName}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;