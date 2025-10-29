import React from 'react';
import ApprovedUsersManagement from '../components/ApprovedUsersManagement';

const SeminarApprovedUsers = () => {
  return (
    <ApprovedUsersManagement 
      formType="SEMINAR"  // Must be uppercase
      formName="Seminar Form"
      formColor="#d32f2f"
    />
  );
};

export default SeminarApprovedUsers;
