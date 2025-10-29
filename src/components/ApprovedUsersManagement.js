import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  AppBar,
  Toolbar,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

function ApprovedUsersManagement({ formType, formName, formColor = '#1976d2' }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApprovedUsers();
  }, [formType]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.idNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nameWithInitial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone1?.includes(searchTerm)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchApprovedUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching approved users for form type:', formType);
      
      // Query with specific formType filter
      const q = query(
        collection(db, 'users'),
        where('status', '==', 'approved'),
        where('formType', '==', formType) // Use the specific formType prop
      );
      
      const querySnapshot = await getDocs(q);
      const usersData = [];
      
      querySnapshot.forEach((doc) => {
        const userData = { id: doc.id, ...doc.data() };
        usersData.push(userData);
        console.log('Found approved user:', userData.nameWithInitial, 'with formType:', userData.formType);
      });
      
      // Sort manually by approval date (newest first)
      usersData.sort((a, b) => {
        const dateA = a.approvedAt?.toDate?.() || new Date(a.approvedAt);
        const dateB = b.approvedAt?.toDate?.() || new Date(b.approvedAt);
        return dateB - dateA;
      });
      
      setUsers(usersData);
      setFilteredUsers(usersData);
      setError('');
      console.log(`Loaded ${usersData.length} approved users for ${formName}`);
    } catch (error) {
      console.error('Error fetching approved users:', error);
      setError('Failed to load approved users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleUpdate = async (updatedUser) => {
    try {
      const userRef = doc(db, 'users', updatedUser.id);
      await updateDoc(userRef, {
        ...updatedUser,
        lastUpdated: new Date()
      });
      setOpenDialog(false);
      fetchApprovedUsers();
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user: ' + error.message);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        fetchApprovedUsers();
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user: ' + error.message);
      }
    }
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
            {formName} - Approved Users ({users.length})
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => {
              // Navigate to the correct new users page based on form type
              if (formType === 'TOT') navigate('/new-users');
              else if (formType === 'TECHNICAL') navigate('/technical-new-users');
              else if (formType === 'WORKSHOP') navigate('/workshop-new-users');
              else if (formType === 'SEMINAR') navigate('/seminar-new-users');
            }}
          >
            New Submissions →
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {formName} - Approved Users
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
          Manage approved {formName} users - Search, edit, or remove users
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by ID, Name, Email, or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            }}
          />
        </Box>

        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="textSecondary">
                {searchTerm ? 'No users found matching your search' : `No approved users for ${formName} yet`}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {searchTerm ? 'Try adjusting your search terms' : `Approved ${formName} users will appear here`}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredUsers.map((user) => (
              <Grid item xs={12} md={6} lg={4} key={user.id}>
                <Card 
                  variant="outlined"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 2,
                      borderColor: formColor
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h2" sx={{ wordBreak: 'break-word' }}>
                        {user.nameWithInitial}
                      </Typography>
                      <Chip 
                        label="Approved" 
                        size="small" 
                        color="success"
                        variant="filled"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>ID:</strong> {user.idNumber}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>Email:</strong> {user.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>Phone:</strong> {user.phone1}
                    </Typography>

                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={user.trained ? 'Trained' : 'Not Trained'} 
                        size="small" 
                        color={user.trained ? 'success' : 'default'}
                        variant="outlined"
                      />
                      <Chip 
                        label={user.medium} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>

                    <Box sx={{ mt: 2, p: 1, backgroundColor: 'success.light', borderRadius: 1 }}>
                      <Typography variant="caption" color="success.dark">
                        Approved on: {formatDate(user.approvedAt)}
                      </Typography>
                      {user.approvedBy && (
                        <Typography variant="caption" color="success.dark" display="block">
                          By: {user.approvedBy}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEdit(user)}
                      title="Edit User"
                    >
                      <EditIcon />
                    </IconButton>
                    <Button 
                      size="small" 
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(user.id)}
                    >
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Edit User Dialog */}
        <EditUserDialog
          open={openDialog}
          user={selectedUser}
          onClose={() => setOpenDialog(false)}
          onSave={handleUpdate}
        />
      </Container>
    </div>
  );
}

// Edit User Dialog Component
function EditUserDialog({ open, user, onClose, onSave }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit User - {user.nameWithInitial}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name with Initial *"
              value={formData.nameWithInitial || ''}
              onChange={(e) => handleChange('nameWithInitial', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email *"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ID Number *"
              value={formData.idNumber || ''}
              onChange={(e) => handleChange('idNumber', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Primary Phone *"
              value={formData.phone1 || ''}
              onChange={(e) => handleChange('phone1', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="WhatsApp Number"
              value={formData.phone2 || ''}
              onChange={(e) => handleChange('phone2', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Landline Number"
              value={formData.phone3 || ''}
              onChange={(e) => handleChange('phone3', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={2}
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Trained"
              value={formData.trained || false}
              onChange={(e) => handleChange('trained', e.target.value === 'true')}
              margin="normal"
              SelectProps={{
                native: true,
              }}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Medium"
              value={formData.medium || ''}
              onChange={(e) => handleChange('medium', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Remarks"
              multiline
              rows={3}
              value={formData.remarks || ''}
              onChange={(e) => handleChange('remarks', e.target.value)}
              margin="normal"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ApprovedUsersManagement;