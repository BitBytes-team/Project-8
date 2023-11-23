/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Divider, Box, Alert, Snackbar
} from '@mui/material';
import axios from 'axios';
import { Redirect, withRouter } from 'react-router-dom';

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      app_info: undefined,
      photo_upload_show: false,
      photo_upload_error: false,
      photo_upload_success: false,
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.handleNewPhoto = this.handleNewPhoto.bind(this);
  }

  componentDidMount() {
    this.handleAppInfoChange();
  }

  handleLogout = () => {
    axios
        .post('/admin/logout')
        .then((response) => {
          this.props.changeUser(undefined);
          // Redirect the user to the login/register page
          this.props.history.push('/login-register');
        })
        .catch((error) => {
          this.props.changeUser(undefined);
          console.log(error);
          // Redirect the user to the login/register page even if there's an error
          this.props.history.push('/login-register');
        });
  };

  handleNewPhoto = (e) => {
    e.preventDefault();
    if (this.uploadInput.files.length > 0) {
      const domForm = new FormData();
      domForm.append('uploadedphoto', this.uploadInput.files[0]);
      axios
          .post('/photos/new', domForm)
          .then((response) => {
            this.setState({
              photo_upload_show: true,
              photo_upload_error: false,
              photo_upload_success: true,
            });
          })
          .catch((error) => {
            this.setState({
              photo_upload_show: true,
              photo_upload_error: true,
              photo_upload_success: false,
            });
            console.log(error);
          });
    }
  };

  handleClose = () => {
    this.setState({
      photo_upload_show: false,
      photo_upload_error: false,
      photo_upload_success: false,
    });
  };

  handleAppInfoChange() {
    const app_info = this.state.app_info;
    if (app_info === undefined) {
      axios.get('/test/info').then((response) => {
        this.setState({
          app_info: response.data,
        });
      });
    }
  }

  render() {
    return this.state.app_info ? (
        <AppBar className="topbar-appBar" position="absolute">
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 0 }} color="inherit">
              {this.props.user ? (
                  <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: 'fit-content',
                        '& svg': {
                          m: 1.5,
                        },
                        '& hr': {
                          mx: 0.5,
                        },
                      }}
                  >
                    <span>{"Hi " + this.props.user.first_name}</span>
                    <Divider orientation="vertical" flexItem />
                    <Button variant="contained" onClick={this.handleLogout}>
                      Logout
                    </Button>
                    <Divider orientation="vertical" flexItem />
                    <Button component="label" variant="contained">
                      Add Photo
                      <input
                          type="file"
                          accept="image/*"
                          hidden
                          ref={(domFileRef) => {
                            this.uploadInput = domFileRef;
                          }}
                          onChange={this.handleNewPhoto}
                      />
                    </Button>
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                        open={this.state.photo_upload_show}
                        autoHideDuration={6000}
                        onClose={this.handleClose}
                    >
                      {this.state.photo_upload_success ? (
                          <Alert onClose={this.handleClose} severity="success" sx={{ width: '100%' }}>
                            Photo Uploaded
                          </Alert>
                      ) : this.state.photo_upload_error ? (
                          <Alert onClose={this.handleClose} severity="error" sx={{ width: '100%' }}>
                            Error Uploading Photo
                          </Alert>
                      ) : (
                          <div />
                      )}
                    </Snackbar>
                  </Box>
              ) : (
                  'Please Login'
              )}
            </Typography>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }} color="inherit" align="center">
              {this.props.main_content}
            </Typography>
            <Typography variant="h5" component="div" sx={{ flexGrow: 0 }} color="inherit">
              Version: {this.state.app_info.version}
            </Typography>
          </Toolbar>
        </AppBar>
    ) : (
        <div />
    );
  }
}

export default withRouter(TopBar);
