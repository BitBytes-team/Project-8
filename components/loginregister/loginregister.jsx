// LoginRegister.jsx
import React, { Component } from 'react';
import { Button, TextField, Typography, Paper } from '@mui/material';

class LoginRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginName: '',
      // eslint-disable-next-line react/no-unused-state
      password:'',
      loginpassword: '',
      confirmPassword: '', // new state for confirming password
      firstName: '',
      lastName: '',
      location: '',
      description: '',
      occupation: '',
      error: '',
    };
  }


  handleRegister = async () => {
    // Implement registration logic here
    try {
      // Ensure passwords match
      if (this.state.password !== this.state.confirmPassword) {
        this.setState({ error: 'Passwords do not match' });
        return;
      }

      // Call your API to handle registration
      const response = await fetch('/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login_name: this.state.loginName,
          loginpassword: this.state.loginpassword,
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          location: this.state.location,
          description: this.state.description,
          occupation: this.state.occupation,
        }),
      });

      if (response.ok) {
        // Registration successful
        this.setState({
          error: '',
          loginName: '',
          // eslint-disable-next-line react/no-unused-state
          loginpassword: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          location: '',
          description: '',
          occupation: '',
        });
        // Optionally, you can provide a success message
      } else {
        // Registration failed
        const errorMessage = await response.text();
        this.setState({ error: errorMessage });
      }
    } catch (error) {
      console.error('Registration error:', error);
      this.setState({ error: 'An error occurred during registration' });
    }
  };
  
  
  handleLogin = async () => {
    // Implement login logic here
    try {
      // Call your API to handle login
      const response = await fetch('/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login_name: this.state.loginName,
          password: this.state.password,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        this.props.changeUser(user);
      } else {
        this.setState({ error: 'Invalid login credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      this.setState({ error: 'An error occurred during login' });
    }
  };
  
  render() {
    return (
      <Paper className="main-grid-item">
        <Typography variant="h5">Please Login</Typography>
        <TextField
          id='login_name'
          label="Login Name"
          variant="outlined"
          fullWidth
          value={this.state.loginName}
          onChange={(e) => this.setState({ loginName: e.target.value })}
        />
        <TextField
          id='password'
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          value={this.state.password}
          onChange={(e) => this.setState({ password: e.target.value })}
        />
        <Button variant="contained" onClick={this.handleLogin}>
          Login
        </Button>
        <Typography variant="h5">Not registered? </Typography>
        <Typography variant="h5">Register here: </Typography>
        <TextField
          id='newPassword'
          label="Enter new Password"
          variant="outlined"
          fullWidth
          type="password"
          value={this.state.loginpassword}
          // eslint-disable-next-line react/no-unused-state
          onChange={(e) => this.setState({ loginpassword: e.target.value })}
        />
        <TextField
          id='confirmPassword'
          label="Confirm Password"
          variant="outlined"
          fullWidth
          type="password"
          value={this.state.confirmPassword}
          onChange={(e) => this.setState({ confirmPassword: e.target.value })}
        />
        <TextField
          id='firstName'
          label="First Name"
          variant="outlined"
          fullWidth
          value={this.state.firstName}
          onChange={(e) => this.setState({ firstName: e.target.value })}
        />
        <TextField
          id='lastName'
          label="Last Name"
          variant="outlined"
          fullWidth
          value={this.state.lastName}
          onChange={(e) => this.setState({ lastName: e.target.value })}
        />
        <TextField
          id='location'
          label="Location"
          variant="outlined"
          fullWidth
          value={this.state.location}
          onChange={(e) => this.setState({ location: e.target.value })}
        />
        <TextField
          id='description'
          label="Description"
          variant="outlined"
          fullWidth
          value={this.state.description}
          onChange={(e) => this.setState({ description: e.target.value })}
        />
        <TextField
          id='occupation'
          label="Occupation"
          variant="outlined"
          fullWidth
          value={this.state.occupation}
          onChange={(e) => this.setState({ occupation: e.target.value })}
        />
        <Button variant="contained" onClick={this.handleRegister}>
          Register Me
        </Button>
        {this.state.error && (
          <Typography variant="body2" color="error" style={{ marginTop: '8px' }}>
            {this.state.error}
          </Typography>
        )}
        {this.state.error && (
          <Typography variant="body2" color="error" style={{ marginTop: '8px' }}>
            {this.state.error}
          </Typography>
        )}
      </Paper>
    );
  }
}

export default LoginRegister;
