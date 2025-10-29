import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Box,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

function UserManagement({ formType, formName, formColor = '#1976d2' }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [formType]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users for form type:', formType);
      
      // Query with specific formType filter
      const q = query(
        collection(db, 'users'),
        where('status', '==', 'pending'),
        where('formType', '==', formType) // Use the specific formType prop
      );
      
      const querySnapshot = await getDocs(q);
      const usersData = [];
      
      querySnapshot.forEach((doc) => {
        const userData = { id: doc.id, ...doc.data() };
        usersData.push(userData);
        console.log('Found user:', userData.nameWithInitial, 'with formType:', userData.formType);
      });
      
      // Sort manually by creation date (newest first)
      usersData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB - dateA;
      });
      
      setUsers(usersData);
      setError('');
      console.log(`Loaded ${usersData.length} users for ${formName}`);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleApprove = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: 'admin'
      });
      
      await sendApprovalNotification(selectedUser);
      
      setOpenDialog(false);
      fetchUsers();
      alert('User approved successfully! Notification sent.');
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Error approving user: ' + error.message);
    }
  };

  const handleReject = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        status: 'rejected',
        rejectedAt: new Date(),
        rejectedBy: 'admin'
      });
      
      await sendRejectionNotification(selectedUser);
      
      setOpenDialog(false);
      fetchUsers();
      alert('User rejected successfully! Notification sent.');
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Error rejecting user: ' + error.message);
    }
  };

  const sendApprovalNotification = async (user) => {
    console.log('Sending APPROVAL notification to:', {
      name: user.nameWithInitial,
      email: user.email,
      phone: user.phone1,
      formType: formType,
      message: `Your ${formName} application has been approved!`
    });
  };

  const sendRejectionNotification = async (user) => {
    console.log('Sending REJECTION notification to:', {
      name: user.nameWithInitial,
      email: user.email,
      phone: user.phone1,
      formType: formType,
      message: `Your ${formName} application has been rejected. Please check your details and resubmit.`
    });
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    if (date.toDate) {
      return date.toDate().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: formColor }}>
        <Toolbar>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            {formName} - New Submissions ({users.length})
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => {
              // Navigate to the correct approved users page based on form type
              if (formType === 'TOT') navigate('/approved-users');
              else if (formType === 'TECHNICAL') navigate('/technical-approved-users');
              else if (formType === 'WORKSHOP') navigate('/workshop-approved-users');
              else if (formType === 'SEMINAR') navigate('/seminar-approved-users');
            }}
          >
            Approved Users →
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {formName} - New Submissions
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
          Review and approve new {formName} submissions
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {users.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="textSecondary">
                No new submissions for {formName}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                All pending {formName} submissions have been processed.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {users.map((user) => (
              <Grid item xs={12} md={6} key={user.id}>
                <Card 
                  variant="outlined"
                  sx={{
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 2,
                      borderColor: formColor
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h2">
                        {user.nameWithInitial}
                      </Typography>
                      <Chip 
                        label="Pending" 
                        size="small" 
                        color="warning"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>ID:</strong> {user.idNumber}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>Email:</strong> {user.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>Primary Phone:</strong> {user.phone1}
                    </Typography>
                    
                    {user.phone2 && (
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        <strong>WhatsApp:</strong> {user.phone2}
                      </Typography>
                    )}
                    
                    {user.phone3 && (
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        <strong>Landline:</strong> {user.phone3}
                      </Typography>
                    )}

                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={user.trained ? 'Trained: Yes' : 'Trained: No'} 
                        size="small" 
                        color={user.trained ? 'success' : 'default'}
                        variant="outlined"
                      />
                      <Chip 
                        label={`Medium: ${user.medium}`} 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        label={`Date: ${formatDate(user.dateOfList)}`} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>

                    {user.remarks && (
                      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                        <strong>Remarks:</strong> {user.remarks}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      variant="contained"
                      fullWidth
                      sx={{ backgroundColor: formColor }}
                      onClick={() => handleViewDetails(user)}
                    >
                      Review & Take Action
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* User Details Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Review User Details - {selectedUser?.nameWithInitial}
          </DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Personal Information</Typography>
                  <Typography><strong>Full Name:</strong> {selectedUser.nameWithInitial}</Typography>
                  <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
                  <Typography><strong>ID Number:</strong> {selectedUser.idNumber}</Typography>
                  <Typography><strong>Address:</strong> {selectedUser.address}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Contact Details</Typography>
                  <Typography><strong>Primary Phone:</strong> {selectedUser.phone1}</Typography>
                  <Typography><strong>WhatsApp:</strong> {selectedUser.phone2 || 'Not provided'}</Typography>
                  <Typography><strong>Landline:</strong> {selectedUser.phone3 || 'Not provided'}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Training Details</Typography>
                  <Typography><strong>Trained:</strong> 
                    <Chip 
                      label={selectedUser.trained ? 'Yes' : 'No'} 
                      size="small" 
                      color={selectedUser.trained ? 'success' : 'error'}
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography><strong>Medium:</strong> {selectedUser.medium}</Typography>
                  <Typography><strong>Date Listed:</strong> {formatDate(selectedUser.dateOfList)}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Submission Info</Typography>
                  <Typography><strong>Submitted:</strong> {formatDate(selectedUser.createdAt)}</Typography>
                  <Typography><strong>Form Type:</strong> {selectedUser.formType}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Remarks</Typography>
                  <Typography>
                    {selectedUser.remarks || 'No remarks provided'}
                  </Typography>
                </Grid>
                
                {selectedUser.certificateImage && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Certificate Image</Typography>
                    <Box sx={{ mt: 1 }}>
                      <img 
                        src={selectedUser.certificateImage} 
                        alt="Certificate" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '300px', 
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'space-between', p: 3 }}>
            <Button 
              onClick={() => setOpenDialog(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Box>
              <Button 
                onClick={() => handleReject(selectedUser?.id)}
                color="error"
                variant="outlined"
                sx={{ mr: 2 }}
              >
                Reject
              </Button>
              <Button 
                onClick={() => handleApprove(selectedUser?.id)}
                color="success"
                variant="contained"
              >
                Approve
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default UserManagement;