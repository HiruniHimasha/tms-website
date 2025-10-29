import React from 'react';
import UserManagement from '../components/UserManagement';

const SeminarNewUsers = () => {
  return (
    <UserManagement 
      formType="SEMINAR"  // Must be uppercase
      formName="Seminar Form"
      formColor="#d32f2f"
    />
  );
};

export default SeminarNewUsers;