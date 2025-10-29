import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

const GoogleForm = ({ formType, formTitle, formDescription }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Information
    nameWithInitial: '',
    email: '',
    idNumber: '',
    address: '',
    
    // Contact Information
    phone1: '',
    phone2: '',
    phone3: '',
    
    // Training Details
    trained: false,
    medium: '',
    dateOfList: '',
    
    // Additional Information
    remarks: '',
    certificateImage: null,
    certificateImageFile: null
  });
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const steps = ['Personal Information', 'Contact Details', 'Training Information', 'Review & Submit'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type and size
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (JPEG, PNG, GIF)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        certificateImageFile: file,
        certificateImage: URL.createObjectURL(file) // Preview URL
      }));
      setError('');
    }
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (activeStep === 0) {
      if (!formData.nameWithInitial || !formData.email || !formData.idNumber) {
        setError('Please fill all required fields in Personal Information');
        return;
      }
    } else if (activeStep === 1) {
      if (!formData.phone1) {
        setError('Primary phone number is required');
        return;
      }
    }
    
    setActiveStep((prev) => prev + 1);
    setError('');
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const uploadImageToCloudinary = async (file) => {
    if (!file) return null;
    
    try {
      setUploading(true);
      const uploadResult = await uploadToCloudinary(file);
      return uploadResult.url; // Return the Cloudinary URL
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload certificate image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Final validation
      if (!formData.nameWithInitial || !formData.email || !formData.idNumber || !formData.phone1) {
        setError('Please fill all required fields');
        return;
      }

      let certificateImageUrl = null;

      // Upload certificate image to Cloudinary if exists
      if (formData.certificateImageFile) {
        try {
          certificateImageUrl = await uploadImageToCloudinary(formData.certificateImageFile);
        } catch (uploadError) {
          setError(uploadError.message);
          return;
        }
      }

      // Prepare submission data - Ensure formType is uppercase to match queries
      const submissionData = {
        // Personal Information
        nameWithInitial: formData.nameWithInitial,
        email: formData.email,
        idNumber: formData.idNumber,
        address: formData.address,
        
        // Contact Information
        phone1: formData.phone1,
        phone2: formData.phone2 || '',
        phone3: formData.phone3 || '',
        
        // Training Details
        trained: formData.trained,
        medium: formData.medium,
        dateOfList: formData.dateOfList,
        
        // Additional Information
        remarks: formData.remarks,
        certificateImage: certificateImageUrl,
        
        // System Fields - Make sure formType is uppercase
        formType: formType.toUpperCase(), // Convert to uppercase for consistency
        status: 'pending',
        createdAt: new Date(),
        submittedAt: new Date().toISOString()
      };

      console.log('Submitting form with type:', submissionData.formType);

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'users'), submissionData);
      console.log('Document written with ID: ', docRef.id);

      setSuccess('Form submitted successfully! We will review your application and get back to you soon.');
      
      // Reset form
      setFormData({
        nameWithInitial: '',
        email: '',
        idNumber: '',
        address: '',
        phone1: '',
        phone2: '',
        phone3: '',
        trained: false,
        medium: '',
        dateOfList: '',
        remarks: '',
        certificateImage: null,
        certificateImageFile: null
      });
      setActiveStep(0);

    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit form. Please try again. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Fields marked with * are required
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Full Name with Initial *"
                value={formData.nameWithInitial}
                onChange={(e) => handleInputChange('nameWithInitial', e.target.value)}
                helperText="e.g., John D. Silva"
                error={!formData.nameWithInitial && activeStep === 0}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="email"
                label="Email Address *"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!formData.email && activeStep === 0}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="ID Number *"
                value={formData.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                error={!formData.idNumber && activeStep === 0}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of List"
                type="date"
                value={formData.dateOfList}
                onChange={(e) => handleInputChange('dateOfList', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Full Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                helperText="Street address, city, postal code"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Contact Details
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Primary phone number is required. WhatsApp and Landline are optional.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Primary Phone Number *"
                value={formData.phone1}
                onChange={(e) => handleInputChange('phone1', e.target.value)}
                helperText="Main contact number"
                error={!formData.phone1 && activeStep === 1}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="WhatsApp Number"
                value={formData.phone2}
                onChange={(e) => handleInputChange('phone2', e.target.value)}
                helperText="Optional - for WhatsApp communications"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Landline Number"
                value={formData.phone3}
                onChange={(e) => handleInputChange('phone3', e.target.value)}
                helperText="Optional - office or home landline"
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Training Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.trained}
                    onChange={(e) => handleInputChange('trained', e.target.checked)}
                    color="primary"
                  />
                }
                label="Have you completed the training?"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Medium of Instruction</InputLabel>
                <Select
                  value={formData.medium}
                  label="Medium of Instruction"
                  onChange={(e) => handleInputChange('medium', e.target.value)}
                >
                  <MenuItem value=""><em>Select Medium</em></MenuItem>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Sinhala">Sinhala</MenuItem>
                  <MenuItem value="Tamil">Tamil</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Remarks / Additional Information"
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                helperText="Any additional comments, notes, or special requirements"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  component="label"
                  disabled={uploading}
                  startIcon={uploading ? <CircularProgress size={16} /> : null}
                >
                  {uploading ? 'Uploading...' : 'Choose Certificate Image'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Upload your certificate (JPEG, PNG, GIF - Max 5MB)
                </Typography>
                
                {formData.certificateImage && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="success.main" gutterBottom>
                      ✓ Image selected: {formData.certificateImageFile?.name}
                    </Typography>
                    <img 
                      src={formData.certificateImage} 
                      alt="Certificate preview" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '150px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginTop: '8px'
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Review Your Information
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Please review all information before submitting.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Personal Information
                  </Typography>
                  <Typography><strong>Name:</strong> {formData.nameWithInitial}</Typography>
                  <Typography><strong>Email:</strong> {formData.email}</Typography>
                  <Typography><strong>ID:</strong> {formData.idNumber}</Typography>
                  <Typography><strong>Address:</strong> {formData.address || 'Not provided'}</Typography>
                  <Typography><strong>Date:</strong> {formData.dateOfList || 'Not specified'}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Contact Details
                  </Typography>
                  <Typography><strong>Primary Phone:</strong> {formData.phone1}</Typography>
                  <Typography><strong>WhatsApp:</strong> {formData.phone2 || 'Not provided'}</Typography>
                  <Typography><strong>Landline:</strong> {formData.phone3 || 'Not provided'}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Training Information
                  </Typography>
                  <Typography><strong>Trained:</strong> {formData.trained ? 'Yes' : 'No'}</Typography>
                  <Typography><strong>Medium:</strong> {formData.medium || 'Not specified'}</Typography>
                  <Typography><strong>Remarks:</strong> {formData.remarks || 'None'}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Certificate
                  </Typography>
                  <Typography><strong>Status:</strong> {formData.certificateImageFile ? 'Uploaded' : 'Not uploaded'}</Typography>
                  {formData.certificateImage && (
                    <Box sx={{ mt: 1 }}>
                      <img 
                        src={formData.certificateImage} 
                        alt="Certificate preview" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '100px',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {formTitle}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" align="center" sx={{ mb: 4 }}>
          {formDescription}
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || uploading}
              startIcon={(loading || uploading) ? <CircularProgress size={16} /> : null}
            >
              {loading ? 'Submitting...' : uploading ? 'Uploading Image...' : 'Submit Form'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default GoogleForm;