// @flow
import React from 'react';

const Start = ({ label, title, description }) => (
  <div className="statistic">
    <label className="margin-bottom-x1">{label || 'Resources'}</label>
    <h2 className="margin-bottom-x1">{title || '8,4'}</h2>
    <p>{description || '30% from last period'}</p>
  </div>
);

export default Start;
