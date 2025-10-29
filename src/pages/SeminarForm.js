import React from 'react';
import GoogleForm from '../components/GoogleForm';

const SeminarForm = () => {
  return (
    <GoogleForm
      formType="SEMINAR"  // Uppercase to match queries
      formTitle="Seminar Registration Form"
      formDescription="Please fill out this form to register for the seminar. All fields marked with * are required."
    />
  );
};

export default SeminarForm;