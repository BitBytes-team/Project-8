import React from 'react';
import { Divider, List, ListItem, Button,Typography} from '@mui/material';
import { Link } from 'react-router-dom';
import './userList.css';
import axios from 'axios'; // Import Axios

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      activityList: [],
    };
  }

  componentDidMount() {
    this.fetchUserList();
    axios.get('/activity')
        .then((res) => {
                this.setState({activityList: res.data});  
                console.log(res.data);
                //console.log(this.props.User);
            })
        .catch((err) => {
                console.log(err);
            });
  }

  fetchUserList() {
    // Use Axios to fetch the user list data from the server
    axios.get('/user/list')
      .then((response) => {
        this.setState({ userList: response.data });
      })
      .catch((error) => {
        console.error('Error fetching user list:', error);
      });
  }

  handleRefresh = ()=>{
    axios.get('/activity')
    .then((res) => {
            this.setState({activityList: res.data});
        })
    .catch((err) => {
            console.log(err);
        });
    };

  render() {
    const { userList } = this.state;
    const { user } = this.props;
        let innerHTML = [];
        for (let i = 0; i < this.state.activityList.length; i++) {
            let cur = this.state.activityList[i];
            //console.log('Uploaded Photo File Name:', cur.uploaded_photo_file_name);
            //console.log(cur);
            innerHTML.push(
                <Typography variant="body2" key = {i}>
                    <br/>
                    {new Date(cur.date_time).toLocaleString()}
                    <br/>
                    {user.first_name + " " + cur.type + " "}
                    {cur.commented_photo_author !== null && `${cur.commented_photo_author}'s photo`}
                    {cur.uploaded_photo_file_name !== null && <> <br/> <img src ={`/images/${cur.uploaded_photo_file_name}`} width={120} height={120} /> </> }
                    {cur.commented_photo_file_name !== null && <> <br/> <img src ={"/images/" + cur.commented_photo_file_name} width = {120} height ={120} /> </>}
                    {cur.deleted_photo_file_name !== null && <> <br/> <img src ={"/images/" + cur.deleted_photo_file_name} width = {120} height ={120} /> </>}
                    {cur.deleted_comment_file_name !== null && <> <br/> <img src ={"/images/" + cur.deleted_comment_file_name} width = {120} height ={120} /> </>}
                    {cur.liked_photo_file_name !== null && <> <br/> <img src ={"/images/" + cur.liked_photo_file_name} width = {120} height ={120} /> </>}
                    {cur.Unliked_photo_file_name !== null && <> <br/> <img src ={"/images/" + cur.Unliked_photo_file_name} width = {120} height ={120} /> </>}
                    <br/>
                </Typography>
            );
        }

    return (
      <><div style={{ display: 'flex' }}>
        <div style={{ width: '400%' }}>
          <List component="nav">
            {userList.map((user) => (
              <div key={user._id}>
                <ListItem>
                  <Button
                    component={Link}
                    to={`/users/${user._id}`}
                    className="ButtonStyle"
                  >
                    {`${user.first_name} ${user.last_name}`}
                  </Button>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </div>
        <div style={{ width: '70%' }}>
          {this.props.children}
        </div>
      </div><div style={{ maxHeight: '100%', overflow: 'auto' }}>
          <Typography variant="h8">User Activity </Typography>
          {innerHTML}
          <br />
          <Button variant="outlined" onClick={this.handleRefresh}> Refresh </Button>
        </div></>
    );
  }
}

export default UserList;
