import React from 'react';
import UserManagement from '../components/UserManagement';

const WorkshopNewUsers = () => {
  return (
    <UserManagement 
      formType="WORKSHOP"  // Must be uppercase
      formName="Workshop Form"
      formColor="#ed6c02"
    />
  );
};

export default WorkshopNewUsers;