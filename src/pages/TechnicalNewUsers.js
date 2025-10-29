import React from 'react';
import UserManagement from '../components/UserManagement';

const TechnicalNewUsers = () => {
  return (
    <UserManagement 
      formType="TECHNICAL"  // Must be uppercase
      formName="Technical Form"
      formColor="#2e7d32"
    />
  );
};

export default TechnicalNewUsers;