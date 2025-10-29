import React from 'react';
import GoogleForm from '../components/GoogleForm';

const TechnicalForm = () => {
  return (
    <GoogleForm
      formType="TECHNICAL"  // Uppercase to match queries
      formTitle="Technical Training Application Form"
      formDescription="Please fill out this form to apply for the Technical Training program. All fields marked with * are required."
    />
  );
};

export default TechnicalForm;