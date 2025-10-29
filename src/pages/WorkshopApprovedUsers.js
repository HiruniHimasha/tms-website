import React from 'react';
import ApprovedUsersManagement from '../components/ApprovedUsersManagement';

const WorkshopApprovedUsers = () => {
  return (
    <ApprovedUsersManagement 
      formType="WORKSHOP"  // Must be uppercase
      formName="Workshop Form"
      formColor="#ed6c02"
    />
  );
};

export default WorkshopApprovedUsers;