import React from 'react';
import GoogleForm from '../components/GoogleForm';

const WorkshopForm = () => {
  return (
    <GoogleForm
      formType="WORKSHOP"  // Uppercase to match queries
      formTitle="Workshop Participation Form"
      formDescription="Please fill out this form to register for the workshop. All fields marked with * are required."
    />
  );
};

export default WorkshopForm;