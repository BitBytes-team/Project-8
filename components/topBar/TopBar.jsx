/* eslint-disable no-unused-vars */
import React from 'react';
import {
    AppBar, Toolbar, Typography, Button, Divider, Box, Alert, Snackbar
} from '@mui/material';
import './TopBar.css';
import axios from 'axios';
import { Link } from "react-router-dom";

/**
 * Define TopBar, a React componment of project #5
 */
class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            app_info: undefined,
            photo_upload_show: false,
            photo_upload_error: false,
            photo_upload_success: false
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.handleNewPhoto = this.handleNewPhoto.bind(this);
    }
    componentDidMount() {
        this.handleAppInfoChange();
    }

    /*handleLogout = (user) => {
        axios.post("/admin/logout")
            .then((response) =>
            {
                let obj = {};
                obj.name = this.props.user.first_name;
                obj.date_time = new Date().valueOf();
                obj.type = "logging out";
                axios.post('/newActivity', obj);
                this.props.changeUser(undefined);
            })
            .catch( error => {
                this.props.changeUser(undefined);
                console.log(error);
            });
    };*/

    handleLogout = async () => {
        try {
            let obj = {
                name: this.props.user.first_name,
                date_time: new Date().valueOf(),
                type: "logging out"
            };
    
            // Make a POST request to log the user's logout activity
            const activityResponse = await axios.post('/newActivity', obj);
    
            if (activityResponse.status === 200) {
                // Reset user-related state
                this.props.changeUser(undefined);
    
                // Make a separate request to logout
                const logoutResponse = await axios.post("/admin/logout");
    
                if (logoutResponse.status === 200) {
                    console.log('Logout successful');
                } else {
                    console.error('Non-200 status code during logout:', logoutResponse.status);
                    // Handle any errors or display a message to the user
                }
            } else {
                console.error('Non-200 status code during new activity post:', activityResponse.status);
                // Handle any errors or display a message to the user
            }
        } catch (error) {
            console.error('Error during logout:', error);
            // Handle any errors or display a message to the user
        }
    };
    
    
    /*handleNewPhoto = (e) => {
        e.preventDefault();
        if (this.uploadInput.files.length > 0) {
            const domForm = new FormData();
            domForm.append('uploadedphoto', this.uploadInput.files[0]);
            axios.post("/photos/new", domForm)
                .then((res) => {
                    console.log('Upload response:', res.data); // Log the entire response object
                    this.setState({
                        photo_upload_show: true,
                        photo_upload_error: false,
                        photo_upload_success: true
                    });
                    let obj = {};
                    obj.name = this.props.user.first_name;
                    obj.date_time = new Date().valueOf();
                    obj.uploaded_photo_file_name = res.data.file_name;
                    obj.type = "Uploaded Photo";
                    axios.post('/newActivity', obj);
                    //this.props.changeUser(undefined);
                })
                .catch(error => {
                    this.setState({
                        photo_upload_show: true,
                        photo_upload_error: true,
                        photo_upload_success: false,
                    });
                    console.log(error);
                });
        }
    };*/

    handleNewPhoto = async (e) => {
        e.preventDefault();
        console.log('handleNewPhoto called');
    
        if (this.uploadInput.files.length > 0) {
            console.log('File selected:', this.uploadInput.files[0].name);
    
            const domForm = new FormData();
            domForm.append('uploadedphoto', this.uploadInput.files[0]);
    
            try {
                const res = await axios.post("/photos/new", domForm);
                console.log('Entire Response:', res);
    
                if (res.status === 200) {
                    console.log('Upload response:', res.data);
    
                    if (res.data && res.data.file_name) {
                        this.setState({
                            photo_upload_show: true,
                            photo_upload_error: false,
                            photo_upload_success: true
                        });
    
                        let obj = {};
                        obj.name = this.props.user.first_name;
                        obj.date_time = new Date().valueOf();
                        obj.uploaded_photo_file_name = res.data.file_name;
                        obj.type = "Uploaded Photo";
    
                        await axios.post('/newActivity', obj);
                    } else {
                        console.error('Invalid response format. Missing file_name:', res.data);
                    }
                } else {
                    // Handle non-200 response status
                    console.error('Non-200 status code:', res.status);
                }
            } catch (error) {
                this.setState({
                    photo_upload_show: true,
                    photo_upload_error: true,
                    photo_upload_success: false,
                });
                console.error('Error during photo upload:', error);
            }
        } else {
            console.log('No file selected');
        }
    };
    
    handleClose = () => {
        this.setState({
            photo_upload_show: false,
            photo_upload_error: false,
            photo_upload_success: false,
        });
    };

    handleAppInfoChange(){
        const app_info = this.state.app_info;
        if (app_info === undefined){
            axios.get("/test/info")
                .then((response) =>
                {
                    this.setState({
                        app_info: response.data
                    });
                });
        }
    }

  render() {
    return this.state.app_info ? (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 0 }} color="inherit">
                {
                this.props.user ?
                    (
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
                            <Divider orientation="vertical" flexItem/>
                            <Button variant="contained"><Link to = {"/Activity"} >Activities</Link></Button>
                            <Button variant="contained" onClick={this.handleLogout}>Logout</Button>
                            <Divider orientation="vertical" flexItem/>
                            <Button
                                component = "label"
                                variant = "contained"
                            >
                                Add Photo
                                <input
                                    type="file"
                                    accept = "image/*"
                                    hidden
                                    ref={(domFileRef) => { this.uploadInput = domFileRef; }}
                                    onChange={this.handleNewPhoto}
                                />
                            </Button>
                            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'left'}} open={this.state.photo_upload_show} autoHideDuration={6000} onClose={this.handleClose}>
                                {
                                    this.state.photo_upload_success ?
                                        <Alert onClose={this.handleClose} severity="success" sx={{ width: '100%' }}>Photo Uploaded</Alert> :
                                        this.state.photo_upload_error ?
                                            <Alert onClose={this.handleClose} severity="error" sx={{ width: '100%' }}>Error Uploading Photo</Alert> :
                                            <div/>
                                }
                            </Snackbar>
                        </Box>
                    )
                :
                    ("Please Login")
                }
            </Typography>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }} color="inherit" align="center">{this.props.main_content}</Typography>
            <Typography variant="h5" component="div" sx={{ flexGrow: 0 }} color="inherit">Version: {this.state.app_info.version}</Typography>
        </Toolbar>
      </AppBar>
    ) : (
        <div/>
    );
  }
}

export default TopBar;
