import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: null,
      add_comment: false,
      current_photo_id: null,
      new_comment: '',
    };
  }

  componentDidMount() {
    this.fetchUserPhotos();
    this.fetchVersionInfo();
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    const { userId } = match.params;

    if (prevProps.match.params.userId !== userId) {
      this.fetchUserPhotos();
    }
  }

  fetchUserPhotos() {
    const { match } = this.props;
    const { userId } = match.params;

    axios.get(`/photosOfUser/${userId}`)
      .then((data) => {
        this.setState({ photos: data.data });
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  }

  fetchVersionInfo() {
    axios.get('/test/info')
      .then((data) => {
        // eslint-disable-next-line react/no-unused-state
        this.setState({ version: data.data });
      })
      .catch((error) => {
        console.error('Error fetching version info:', error);
      });
  }

  // Event handler for showing the add comment dialog
  handleShowAddComment = (photo_id) => {
    this.setState({
      add_comment: true,
      current_photo_id: photo_id,
    });
  };

  // Event handler for changing the new comment text
  handleNewCommentChange = (event) => {
    this.setState({
      new_comment: event.target.value,
    });
  };

  // Event handler for canceling the add comment dialog
  handleCancelAddComment = () => {
    this.setState({
      add_comment: false,
      new_comment: '',
      current_photo_id: null,
    });
  };

  // Event handler for submitting the new comment
  handleSubmitAddComment = () => {
    const { current_photo_id, new_comment } = this.state;

    axios.post(`/commentsOfPhoto/${current_photo_id}`, { comment: new_comment })
      .then(() => {
        console.log('Comment added to the database successfully');

        this.setState({
          add_comment: false,
          new_comment: '',
          current_photo_id: null,
        });
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };

  render() {
    const { photos } = this.state;
    const { match } = this.props;
    const { userId } = match.params;

    return (
      <div>
        {photos ? (
          <div>
            <Button
              component={Link}
              to={`/users/${userId}`}
              variant="contained"
              color="primary"
              style={{ boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)' }}
            >
              User Details
            </Button>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {photos.map((photo) => (
                <div
                  key={photo._id}
                  style={{
                    margin: '10px',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                    backgroundColor: '#fff',
                  }}
                >
                  <img
                    src={`/images/${photo.file_name}`}
                    alt={photo.file_name}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                  <p style={{ margin: 0 }}><b>Date Taken:</b> {photo.date_time}</p>

                  {photo.comments && photo.comments.length > 0 && (
                    <div
                      style={{
                        marginTop: '10px',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        backgroundColor: '#f5f5f5',
                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: 'bold' }}>Comments:</p>
                      {photo.comments.map((comment) => (
                        <div
                          key={comment._id}
                          style={{
                            margin: '10px',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            backgroundColor: '#f9f9f9',
                            boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                          }}
                        >
                          <p style={{ margin: 0 }}>{comment.comment}</p>
                          <p style={{ margin: 0, fontStyle: 'italic' }}>
                            <b>Commented ON:</b> {comment.date_time}
                          </p>
                          <p style={{ margin: 0, fontStyle: 'italic' }}>
                            <b>Commented BY:</b>
                            <Link to={`/users/${comment.user._id}`}>{comment.user.first_name} {comment.user.last_name}</Link>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Button to show the add comment dialog */}
                  <Button
                    variant="contained"
                    onClick={() => this.handleShowAddComment(photo._id)}
                  >
                    Add Comment
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Comment Dialog */}
            <Dialog open={this.state.add_comment}>
              <DialogTitle>Add Comment</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Enter a new comment for the photo.
                </DialogContentText>
                <TextField
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
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCancelAddComment}>Cancel</Button>
                <Button onClick={this.handleSubmitAddComment}>Add</Button>
              </DialogActions>
            </Dialog>
          </div>
        ) : (
          <p>No photos available</p>
        )}
      </div>
    );
  }
}

export default UserPhotos;
