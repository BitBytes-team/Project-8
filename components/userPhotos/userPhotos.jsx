import React from 'react';
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField,IconButton } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { Link } from 'react-router-dom';
import './userPhotos.css';
import axios from 'axios'; // Import Axios
import TopBar from '../topBar/TopBar';
import { MentionsInput,Mention } from 'react-mentions';

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      photo:{},
      user: null,
      comment: null,
      image: null,
      new_comment: '', // Step 1: Add state for new comment
      add_comment: false,
      current_photo_id: null,
      addedComment : "",
      likedPhotos: [],
      likedMessage: '',
      like: false,
      likeCount: 0,
    };

    // Bind event handlers to the instance
    this.handleShowAddComment = this.handleShowAddComment.bind(this);
    this.handleNewCommentChange = this.handleNewCommentChange.bind(this);
    this.handleCancelAddComment = this.handleCancelAddComment.bind(this);
    this.handleSubmitAddComment = this.handleSubmitAddComment.bind(this);
  }

  componentDidMount() {
    this.fetchUserPhotosAndDetails();
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    const { userId } = match.params;

    if (prevProps.match.params.userId !== userId) {
      this.fetchUserPhotosAndDetails();
    }
  }

  fetchUserPhotosAndDetails() {
    const { match } = this.props;
    const { userId } = match.params;

    // Use Axios to fetch user photos from the server
    axios.get(`/photosOfUser/${userId}`)
      .then((response) => {
        this.setState({ photos: response.data });
      })
      .catch((error) => {
        console.error('Error fetching user photos:', error);
      });

    // Use Axios to fetch user details from the server
    axios.get(`/user/${userId}`)
      .then((response) => {
        this.setState({
          user: response.data,
          comment: response.data ? response.data.comment : null,
        });
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  }

  // Step 2: Create an event handler for showing the add comment dialog
  handleShowAddComment = (event) => {
    const photo_id = event.currentTarget.getAttribute('photo_id');
    this.setState({
      add_comment: true,
      current_photo_id: photo_id,
    });
  };

  // Step 3: Create a dialog for adding comments
  renderAddCommentDialog() {
    return (
      <Dialog open={this.state.add_comment}>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a new comment for the photo.
          </DialogContentText>
          <MentionsInput
            autoFocus
            margin="dense"
            id="comment"
            label="Comment"
            multiline
            rows={4}
            fullWidth
            variant="standard"
            onChange={this.handleNewCommentChange}
            value={this.state.new_comment}
            markup="display"
            >
            <Mention
              trigger="@"
              data={(search, callback) => {
                // Fetch users based on the search term from your backend
                // Adjust the following line according to your backend endpoint
                axios.get(`/searchUsers?query=${search}`)
                  .then(response => {
                    callback(response.data.map(user => ({
                      id: user._id,
                      display: `${user.first_name} ${user.last_name}`, // Use template literals here
                    })));
                  })
                  .catch(error => {
                    console.error('Error fetching users:', error);
                    callback([]);
                  });
              }}
            />
          </MentionsInput>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancelAddComment}>Cancel</Button>
          <Button onClick={this.handleSubmitAddComment}>Add</Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleSubmitAddComment = (event) => {
    const { current_photo_id, new_comment } = this.state;
    event.preventDefault();
    let passObj = {};
    passObj.comment = this.state.addedComment;
  
    // Use Axios to send the new comment to the server
    axios.post(`/commentsOfPhoto/${current_photo_id}`, { comment: new_comment ,sharing_list: this.state.photo.sharing_list} )
      .then((res) => {
        // Log a message indicating that the comment was added to the database
        console.log('Comment added to the database successfully');
  
        // Update state to close the dialog and reset new_comment
        this.setState({
          add_comment: false,
          new_comment: '',
          current_photo_id: null,
          addedComment:""
        });
        // Fetch updated user photos and details
        this.fetchUserPhotosAndDetails();
        // Get the commented photo details
        const commentedPhotoDetails = this.state.photos.find(photo => photo._id === current_photo_id);
        let obj = {};
        obj.name = res.data.name;
        obj.user_id = res.data._id;
        obj.date_time = new Date().valueOf();
        obj.type = "Commented on photo";
        obj.commented_photo_author = res.data.name;
        obj.commented_photo_file_name = commentedPhotoDetails.file_name;
        axios.post('/newActivity', obj);
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };

  /*handleLikePhoto = (photoId) => {
    const likedPhotos = [...this.state.likedPhotos];
    const index = likedPhotos.indexOf(photoId);
    if (index === -1) {
        likedPhotos.push(photoId);
        this.setState({ likedMessage: 'Liked successfully' });
    } else {
        likedPhotos.splice(index, 1);
        this.setState({ likedMessage: '' });
    }
    this.setState({ likedPhotos });
  };*/

  handleLike = (photoId) => {
    const { photos, user } = this.state;
    const alreadyLiked = photos.some(photo => photo.likes && photo.likes.includes(user._id));

    if (alreadyLiked) {
      alert('This photo has already been liked by a user!');
      return;
    }

    // Proceed to like the specific photo
    axios.post(`/likePhoto/${photoId}`)
      .then((response) => {
        console.log(response);
        console.log('Photo liked successfully');

        this.fetchUserPhotosAndDetails();
      })
      .catch((error) => {
        console.error('Error liking photo:', error);
      });
  };

  handleUnlike = (photoId) => {
    axios.post(`/unlikePhoto/${photoId}`)
      .then((response) => {
        console.log(response);
        console.log('Photo unliked successfully');
        this.fetchUserPhotosAndDetails();
      })
      .catch((error) => {
        console.error('Error unliking photo:', error);
      });
  };

  // Step 1: Add a handler for changing the new comment text
  handleNewCommentChange = (event) => {
    this.setState({
      new_comment: event.target.value,
    });
  };

  // Step 5: Add a handler for canceling the add comment dialog
  handleCancelAddComment = () => {
    this.setState({
      add_comment: false,
      new_comment: '',
      current_photo_id: null,
    });
  };

  handleDeletePhoto = (photoId) => {
    axios.post(`/deletePhoto/${photoId}`)
      .then((result) => {
        console.log(result.data); // Log the server response
        this.fetchUserPhotosAndDetails(); 
        // Refresh the photos after deletion
        // Get the commented photo details
        const deletecommentPhotoDetails = this.state.photos.find(photo => photo._id === photoId);
        let obj = {};
        obj.name = result.data.name;
        obj.date_time = new Date().valueOf();
        obj.type = "deleted photo";
        obj.deleted_photo_file_name = deletecommentPhotoDetails.file_name;
        axios.post('/newActivity', obj);
      })
      .catch((err) => {
        console.log(photoId);
        console.log(err);
      });
  };

  handleDeleteComment = (passObj,photo_id) => {
    let body = {};
    // console.log(passObj);
    body.commentId = passObj._id;
    console.log(body);
    // console.log({this.state.photo});
    axios.post(`deleteComment/${photo_id}`, body)
    .then(result => {
        console.log(result);
        this.props.handlePhotosChange(); 
        // this.setState({photo : this.props.photo});
    })
    .catch(err => {
        console.log(err);
    });
    // event.preventDefault();
};

  render() {
    const { photos, user, comment ,likedPhotos, likedMessage} = this.state;
    const { match } = this.props;
    const { userId } = match.params;
    const topNameValue = user ? `User photos for ${user.first_name} ${user.last_name}` : '';

    return (
      <div>
        <TopBar topName={topNameValue} user={user}/>
        <Button
          component={Link}
          to={`/users/${userId}`}
          variant="contained"
          className="ButtonLink"
        >
          User Details
        </Button>
        <Typography
          variant="h4"
          className="UserPhotosHeader"
        >
          User Photos
        </Typography>
        <div className="photo-list">
          {photos.map((photo) => (
            <div key={photo._id} className="photo-item">
              <img
                src={`/images/${photo.file_name}`}
                className="photo-image"
              />
              <div>
                <IconButton
                  onClick={() => this.handleLike(photo._id)}
                  style={{
                    color: photo.likes && photo.likes.includes(userId) ? '#1976D2' : 'inherit',
                  }}
                >
                <ThumbUpAltIcon />
                </IconButton>
                <IconButton
                  onClick={() => this.handleUnlike(photo._id)}
                  color={photo.likes && photo.likes.includes(userId) ? '#1976D2' : 'inherit'}
                >
                <ThumbDownAltIcon />
                </IconButton>
                <span>{photo.likes ? photo.likes.length : 0} Likes </span>
                {photo.likes && photo.likes.length > 0 && (
                  <span style={{ marginLeft: '120px', color: '#1976D2' }}>
                    Liked successfully!
                  </span>
                )}
              </div>
              {photo.user_id === userId && (
                    <Button onClick={() => {console.log(photo.file_name);this.handleDeletePhoto(photo._id);}}> Delete the Photo </Button>
                  )}
              <div className="user-photo-box" style={{ marginTop: '16px' }}>
                <Typography variant="caption" className="user-photo-title">
                  Date Taken
                </Typography>
                <Typography variant="body1" className="user-photo-value">
                  {photo.date_time}
                </Typography>
              </div>
              {photo.comments && photo.comments.length > 0 && (
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Comments:</p>
                  {photo.comments.map((userComment) => (
                    <div key={userComment._id} className="user-photo-box" style={{ marginTop: '16px' }}>
                      <p>
                        <b>
                          Comment:
                        </b>
                        {userComment.comment.split(' ').map((word, index) => {
                          if (word.startsWith('@')) {
                            //console.log(word);
                            console.log(userComment);
                            const fullWord = userComment.comment.split(' ').slice(index, index + 2).join(' ');
                            //console.log(fullWord);
                           // const mentionId = fullWord.substring(2);
                           // console.log(mentionId);
                            const start = userComment.comment.indexOf('[');
                            const end = userComment.comment.indexOf(']', start);
                            if (start !== -1 && end !== -1) {
                                var idStart = fullWord.indexOf('(');
                                var idEnd = fullWord.indexOf(')', idStart);
                                var id = fullWord.substring(idStart + 1, idEnd);
                                console.log(id);
                                var mentionId = userComment.comment.substring(start + 1, end);
                                console.log(mentionId);
                            }
                            return(
                              <Link key={index} to={`/users/${id}`}>
                                {mentionId}   
                              </Link>  
                            );
                          }
                        })}
                      </p>
                      <p>{userComment.comment}</p>
                      <p>
                        <b>Commented ON:</b> {userComment.date_time}
                      </p>
                      <p>
                        <b>Commented BY:</b>
                        <Link to={`/users/${userComment.user._id}`}>{userComment.user.first_name} {userComment.user.last_name}</Link>
                      </p>
                      {photo.user_id === userId && (
                        <Button onClick={() => {console.log(userComment); 
                        console.log(photo._id); 
                        this.handleDeleteComment(userComment,photo._id);}}> Delete the Comment 
                        </Button>
                     )}
                    </div>
                  ))}
                  <Button photo_id={photo._id} variant="contained" onClick={this.handleShowAddComment}>
                    Add Comment
                  </Button>
                  
                </div>
              )}
            </div>
          ))}
        </div>

        {user ? (
          <div>
            {comment && (
              <div className="user-photo-box" style={{ marginTop: '16px' }}>
                <Typography variant="caption" className="user-photo-title">
                  Comment
                </Typography>
                <Typography variant="body1" className="user-photo-value">
                  {comment}
                </Typography>
              </div>
            )}
          </div>
        ) : (
          <Typography variant="body1" className="user-detail-box loading-text">
            Loading user details...
          </Typography>
        )}

        {/* Step 3: Render the add comment dialog */}
        {this.renderAddCommentDialog()}
        {likedMessage && (
                    <div style={{ marginTop: '16px', color: 'green' }}>
                        {likedMessage}
                    </div>
        )}
      </div>
    );
  }
}

export default UserPhotos;
