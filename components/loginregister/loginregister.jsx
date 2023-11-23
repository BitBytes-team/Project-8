import React, { useState } from 'react';
import {
  Button,
  Box,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import axios from 'axios';

const LoginRegister = ({ changeUser }) => {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    location: '',
    description: '',
    occupation: '',
    login_name: '',
    password: '',
    password_repeat: ''
  });
  const [showLoginError, setShowLoginError] = useState(false);
  const [showRegistrationError, setShowRegistrationError] = useState(false);
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);
  const [openRegistration, setOpenRegistration] = useState(false);
  const [showRequiredFieldsWarning, setShowRequiredFieldsWarning] = useState(false);

  const handleShowRegistration = () => {
    setOpenRegistration(true);
    setShowRegistrationError(false);
    setShowRequiredFieldsWarning(false);
  };

  const handleCloseRegistration = () => {
    setOpenRegistration(false);
    setShowRegistrationSuccess(false);
    setShowRegistrationError(false);
    setShowRequiredFieldsWarning(false);
  };

  const handleLogin = () => {
    const currentState = JSON.stringify(user);
    axios
      .post('/admin/login', currentState, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        const userData = response.data;
        setShowLoginError(false);
        setShowRegistrationSuccess(false);
        setShowRegistrationError(false);
        changeUser(userData);
      })
      .catch((error) => {
        setShowLoginError(true);
        setShowRegistrationSuccess(false);
        setShowRegistrationError(false);
        console.log(error);
      });
  };

  const handleRegister = () => {
    if (user.password !== user.password_repeat) {
      setShowRegistrationError(true);
      setShowRequiredFieldsWarning(false);
      alert("Passwords don't match");
      return;
    }

    const requiredFields = [
      'login_name',
      'password',
      'password_repeat',
      'first_name',
      'last_name'
    ];
    if (requiredFields.some((field) => !user[field])) {
      setShowRequiredFieldsWarning(true);
      setShowRegistrationError(false);
      return;
    }

    const currentState = JSON.stringify(user);
    axios
      .post('/user/', currentState, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        const userData = response.data;
        setShowRegistrationSuccess(true);
        setShowRegistrationError(false);
        setShowLoginError(false);
        setOpenRegistration(false);
        setShowRequiredFieldsWarning(false);
        changeUser(userData);
      })
      .catch((error) => {
        setShowRegistrationError(true);
        setShowLoginError(false);
        setShowRegistrationSuccess(false);
        setShowRequiredFieldsWarning(false);
        console.log(error);
      });
  };

  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.id]: event.target.value
    });
  };

  return (
    <div>
      <Box component="form" autoComplete="off">
        {showLoginError && <Alert severity="error">Login Failed</Alert>}
        {showRegistrationError && (
          <Alert severity="error">Please correct the registration details.</Alert>
        )}
        {showRegistrationSuccess && (
          <Alert severity="success">Registration Succeeded</Alert>
        )}
        <div>
          <TextField
            id="login_name"
            label="Login Name"
            variant="outlined"
            fullWidth
            margin="normal"
            required={true}
            onChange={handleChange}
          />
        </div>
        <div>
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            required={true}
            onChange={handleChange}
          />
        </div>
        <Box mb={2}>
          <Button type="submit" variant="contained" onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Box>
      <Box>
        <Button variant="contained" onClick={handleShowRegistration}>
          Register
        </Button>
        <Dialog open={openRegistration} onClose={handleCloseRegistration}>
          <DialogTitle>User Registration</DialogTitle>
          <DialogContent>
            {showRequiredFieldsWarning && (
              <Alert severity="warning">Please fill in all required fields.</Alert>
            )}
            <Box>
              <TextField
                id="login_name"
                label="Login Name"
                variant="outlined"
                fullWidth
                margin="normal"
                required={true}
                onChange={handleChange}
              />
              <TextField
                id="password"
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                required={true}
                onChange={handleChange}
              />
              <TextField
                id="password_repeat"
                label="Repeat Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                required={true}
                onChange={handleChange}
              />
              <TextField
                id="first_name"
                label="First Name"
                variant="outlined"
                fullWidth
                margin="normal"
                autoComplete="off"
                required={true}
                onChange={handleChange}
              />
              <TextField
                id="last_name"
                label="Last Name"
                variant="outlined"
                fullWidth
                margin="normal"
                required={true}
                onChange={handleChange}
              />
              <TextField
                id="location"
                label="Location"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={handleChange}
              />
              <TextField
                id="description"
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                margin="normal"
                onChange={handleChange}
              />
              <TextField
                id="occupation"
                label="Occupation"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={handleChange}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleRegister}>
              Register Me
            </Button>
            <Button variant="outlined" onClick={handleCloseRegistration}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default LoginRegister;
