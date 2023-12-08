import React from 'react';
import { Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import './userDetail.css';
import axios from 'axios'; // Import Axios
import TopBar from '../topBar/TopBar';


class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      mentionedUsers: [],
      mentionedPhotos: [],
    };
  }

  componentDidMount() {
    this.fetchUserDetails();
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    const { userId } = match.params;

    if (prevProps.match.params.userId !== userId || !this.state.user) {
      this.fetchUserDetails();
      this.fetchMentionedPhotos();
    }
  }

  fetchUserDetails() {
    const { match } = this.props;
    const { userId } = match.params;

    // Use Axios to fetch user details from the server
    axios.get(`/user/${userId}`)
      .then((response) => {
        this.setState({ user: response.data });
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
    }

    fetchMentionedPhotos() {
      const { userId } = this.props.match.params;
      axios.get(`/mentionedPhotos/${userId}`)
        .then((response) => {
          this.setState({ mentionedPhotos: response.data });
        })
        .catch((error) => {
          console.error('Error fetching mentioned photos:', error);
        });
    }

  handleDelete=()=> {
    console.log(this.state.user._id);
    var id = this.state.user._id;
    axios.post(`/deleteUser/${id}`, {})
      .then((value) => {
        //this.props.onDelete();
        console.log(value);
        let obj1 = {};
        obj1.date_time = new Date().valueOf();
        obj1.name = value.data.name;
        obj1.user_id = value.data._id;
        obj1.type = "User deleted";
        axios.post('/newActivity', obj1); 
      })
      .catch((error) => {
        console.log(error);
      });
    // event.preventDefault();
    req.session.destroy((err) => {
      if (err) {
          console.error('Error destroying session during logout:', err);
          // Handle any errors or send an appropriate response
          res.status(500).send('Internal Server Error');
      } else {
          // Send a success response
          res.status(200).send('Logout successful');
      }
  });
  };

  render() {
    const { user, mentionedUsers, mentionedPhotos} = this.state;
    const topNameValue = user ? `User details for ${user.first_name} ${user.last_name}` : '';
    //const commentWithMentions = user && user.comment ? user.comment : '';
    //const mentionedUserIds = commentWithMentions.match(/@(\w+)/g) || [];
    //const mentionedUsers = mentionedUserIds.map((userId) => userId.slice(1));
    return (
      <div>
        <TopBar topName={topNameValue} user={user}/>
        {user ? (
          <div>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Button component={Link} to={`/photos/${user._id}`} variant="contained" color="primary">
                  User Photos
                </Button>
                <Button variant="outlined" onClick={() => {console.log(user._id); this.handleDelete(user._id);}}>
            Delete My Account
                </Button>
              </Grid>
            </Grid>

            <div className="user-detail-box" style={{ marginTop: '16px' }}>
              <Typography variant="body1" className="user-detail-title">
                First Name
              </Typography>
              <Typography variant="body1" className="user-detail-value">
                {user.first_name}
              </Typography>
            </div>

            {/* Include other user details here */}            

            <div className="user-detail-box">
              <Typography variant="body1" className="user-detail-title">
                Last Name
              </Typography>
              <Typography variant="body1" className="user-detail-value">
                {user.last_name}
              </Typography>
            </div>
            <div className="user-detail-box">
              <Typography variant="body1" className="user-detail-title">
                Location
              </Typography>
              <Typography variant="body1" className="user-detail-value">
                {user.location}
              </Typography>
            </div>
            <div className="user-detail-box">
              <Typography variant="body1" className="user-detail-title">
                Description
              </Typography>
              <Typography variant="body1" className="user-detail-value">
                {user.description}
              </Typography>
            </div>
            <div className="user-detail-box">
              <Typography variant="body1" className="user-detail-title">
                Occupation
              </Typography>
              <Typography variant="body1" className="user-detail-value">
                {user.occupation}
              </Typography>
            </div>
            <div className="user-detail-box">
              <Typography variant="body1" className="user-detail-title">
                Photos mentioning you
              </Typography>
            </div>
            {this.fetchMentionedPhotos()}
            {mentionedPhotos.length > 0 && (
            <div>
              <Typography variant="h5" style={{ marginTop: '16px' }}>
                Mentioned Photos
              </Typography>
              <div className="photo-list">
                {mentionedPhotos.map((photo) => (
                  <div key={photo._id} className="photo-item">
                    <Link to={`/photos/${photo._id}`}>
                      <img src={`/images/${photo.file_name}`} className="photo-image" alt="Mentioned Photo" />
                    </Link>
                    {/* Add any additional information you want to display */}
                  </div>
                ))}
              </div>
            </div>
          )}  
          </div>
        ) : (
          <Typography variant="body1" className="user-detail-box loading-text">
            Loading user details...
          </Typography>
        )}
      </div>
    );
  }
}

export default UserDetail;
