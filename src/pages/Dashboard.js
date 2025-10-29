import React from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Typography,
  AppBar,
  Toolbar,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import GoogleForm from '../components/GoogleForm';
import { 
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openFormDialog, setOpenFormDialog] = React.useState(false);
  const [selectedForm, setSelectedForm] = React.useState(null);
  const [openGoogleForm, setOpenGoogleForm] = React.useState(false);

  const googleForms = [
    { 
      id: 'TOT', 
      name: 'TOT Form', 
      color: '#1976d2', 
      description: 'Training of Trainers Application',
      formPath: '/form/tot',
      newUsersPath: '/new-users',
      approvedUsersPath: '/approved-users'
    },
    { 
      id: 'TECHNICAL', 
      name: 'Technical Form', 
      color: '#2e7d32', 
      description: 'Technical Training Application',
      formPath: '/form/technical',
      newUsersPath: '/technical-new-users',
      approvedUsersPath: '/technical-approved-users'
    },
    { 
      id: 'WORKSHOP', 
      name: 'Workshop Form', 
      color: '#ed6c02', 
      description: 'Workshop Participation Registration',
      formPath: '/form/workshop',
      newUsersPath: '/workshop-new-users',
      approvedUsersPath: '/workshop-approved-users'
    },
    { 
      id: 'SEMINAR', 
      name: 'Seminar Form', 
      color: '#d32f2f', 
      description: 'Seminar Attendance Registration',
      formPath: '/form/seminar',
      newUsersPath: '/seminar-new-users',
      approvedUsersPath: '/seminar-approved-users'
    }
  ];

  const handleFormClick = (form) => {
    if (user) {
      // If user is logged in, show management options
      setSelectedForm(form);
      setOpenFormDialog(true);
    } else {
      // If user is not logged in, redirect to form
      navigate(form.formPath);
    }
  };

  const handlePublicFormLink = (formPath) => {
    const fullUrl = `${window.location.origin}${formPath}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert('Form link copied to clipboard!');
    }).catch(() => {
      // Fallback if clipboard fails
      prompt('Copy this form link:', fullUrl);
    });
  };

  const handleQuickAction = (action, form) => {
    switch (action) {
      case 'new-users':
        // Navigate to the correct new users page based on form type
        navigate(form.newUsersPath);
        break;
      case 'approved-users':
        // Navigate to the correct approved users page based on form type
        navigate(form.approvedUsersPath);
        break;
      case 'form-link':
        handlePublicFormLink(form.formPath);
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Certificate Management System
          </Typography>
          {user ? (
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {user?.email}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>
              Admin Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {user ? 'Management Dashboard' : 'Application Forms'}
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" sx={{ mb: 4 }}>
          {user 
            ? 'Manage form submissions and user approvals' 
            : 'Select a form below to apply or register'
          }
        </Typography>
        
        <Grid container spacing={4}>
          {googleForms.map((form) => (
            <Grid item xs={12} sm={6} key={form.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: `2px solid ${form.color}`,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    gutterBottom
                    sx={{ color: form.color, fontWeight: 'bold' }}
                  >
                    {form.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {form.description}
                  </Typography>
                  {!user && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Click to fill out the form
                    </Typography>
                  )}
                  
                  {/* Quick Actions - Only show when user is logged in */}
                  {user && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Quick Actions:
                      </Typography>
                      <Grid container spacing={1} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<PeopleIcon />}
                            onClick={() => handleQuickAction('new-users', form)}
                            sx={{ 
                              borderColor: form.color,
                              color: form.color,
                              '&:hover': {
                                backgroundColor: form.color,
                                color: 'white'
                              }
                            }}
                          >
                            New Users
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleQuickAction('approved-users', form)}
                            sx={{ 
                              borderColor: form.color,
                              color: form.color,
                              '&:hover': {
                                backgroundColor: form.color,
                                color: 'white'
                              }
                            }}
                          >
                            Approved
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </CardContent>
                
                <CardActions>
                  {user ? (
                    <Button 
                      size="large" 
                      fullWidth
                      variant="contained"
                      sx={{ 
                        backgroundColor: form.color,
                        '&:hover': {
                          backgroundColor: form.color,
                          opacity: 0.9
                        }
                      }}
                      onClick={() => handleFormClick(form)}
                    >
                      Manage {form.name}
                    </Button>
                  ) : (
                    <Button 
                      size="large" 
                      fullWidth
                      variant="contained"
                      sx={{ 
                        backgroundColor: form.color,
                        '&:hover': {
                          backgroundColor: form.color,
                          opacity: 0.9
                        }
                      }}
                      onClick={() => handleFormClick(form)}
                    >
                      Fill {form.name}
                    </Button>
                  )}
                </CardActions>
                
                {/* Open Form Button - Only for admin */}
                {user && (
                  <CardActions>
                    <Button 
                      size="small" 
                      fullWidth
                      variant="outlined"
                      startIcon={<LinkIcon />}
                      onClick={() => {
                        setSelectedForm(form);
                        setOpenGoogleForm(true);
                      }}
                      sx={{ 
                        borderColor: form.color,
                        color: form.color,
                        '&:hover': {
                          backgroundColor: form.color,
                          color: 'white'
                        }
                      }}
                    >
                      Open Form
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        

        {/* Form Management Dialog */}
        <Dialog 
          open={openFormDialog} 
          onClose={() => setOpenFormDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Manage {selectedForm?.name}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Choose an action for {selectedForm?.name}:
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<PeopleIcon />}
                    onClick={() => {
                      setOpenFormDialog(false);
                      handleQuickAction('new-users', selectedForm);
                    }}
                    sx={{ 
                      borderColor: selectedForm?.color,
                      color: selectedForm?.color,
                      '&:hover': {
                        backgroundColor: selectedForm?.color,
                        color: 'white'
                      }
                    }}
                  >
                    View New Submissions
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => {
                      setOpenFormDialog(false);
                      handleQuickAction('approved-users', selectedForm);
                    }}
                    sx={{ 
                      borderColor: selectedForm?.color,
                      color: selectedForm?.color,
                      '&:hover': {
                        backgroundColor: selectedForm?.color,
                        color: 'white'
                      }
                    }}
                  >
                    View Approved Users
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<LinkIcon />}
                    onClick={() => {
                      setOpenFormDialog(false);
                      handleQuickAction('form-link', selectedForm);
                    }}
                    sx={{ 
                      borderColor: selectedForm?.color,
                      color: selectedForm?.color,
                      '&:hover': {
                        backgroundColor: selectedForm?.color,
                        color: 'white'
                      }
                    }}
                  >
                    Get Form Link
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenFormDialog(false)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Google Form Dialog */}
        
<Dialog 
  open={openGoogleForm} 
  onClose={() => setOpenGoogleForm(false)}
  maxWidth="md"
  fullWidth
  maxHeight="90vh"
>
  <DialogTitle>
    {selectedForm?.name}
  </DialogTitle>
  <DialogContent>
    {selectedForm && (
      <GoogleForm
        formType={selectedForm.id}  // This should be uppercase like "TOT", "TECHNICAL", etc.
        formTitle={selectedForm.name}
        formDescription={selectedForm.description}
      />
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenGoogleForm(false)}>
      Close
    </Button>
  </DialogActions>
</Dialog>
      </Container>
    </div>
  );
}

export default Dashboard;