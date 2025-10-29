import React from 'react';
import GoogleForm from '../components/GoogleForm';

const TOTForm = () => {
  return (
    <GoogleForm
      formType="TOT"  // Uppercase to match queries
      formTitle="TOT (Training of Trainers) Application Form"
      formDescription="Please fill out this form to apply for the Training of Trainers program. All fields marked with * are required."
    />
  );
};

export default TOTForm;