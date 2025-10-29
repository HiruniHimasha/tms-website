import React from 'react';
import ApprovedUsersManagement from '../components/ApprovedUsersManagement';

const TechnicalApprovedUsers = () => {
  return (
    <ApprovedUsersManagement 
      formType="TECHNICAL"  // Must be uppercase
      formName="Technical Form"
      formColor="#2e7d32"
    />
  );
};

export default TechnicalApprovedUsers;