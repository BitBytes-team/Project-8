// // import React from 'react';
// // import { Typography, Button, Grid } from '@mui/material';
// // import { Link } from 'react-router-dom';
// // import './userDetail.css';

// // class UserDetail extends React.Component {
// //   constructor(props) {
// //     super(props);
// //     this.state = {
// //       user: null
// //     };
// //   }

// //   componentDidMount() {
// //     this.fetchUserDetails();
// //   }

// //   componentDidUpdate(prevProps) {
// //     const { match } = this.props;
// //     const { userId } = match.params;

// //     if (prevProps.match.params.userId !== userId || !this.state.user ) {
// //       this.fetchUserDetails();
// //       console.log(userId);
// //     }
// //   }

// //   fetchUserDetails() {
// //     const { match } = this.props;
// //     const { userId } = match.params;
  
// //     try {
// //       const user = window.models.userModel(userId);
// //       this.setState({ user });
// //     } catch (error) {
// //       console.error('Error fetching user details:', error);
// //     }
// //   }
  

// //   render() {
// //     const { user } = this.state;

// //     return (
// //       <div>
// //         {user ? ( 
//           // <div>
//           // <Grid container justifyContent="space-between">
//           //   <Grid item>
//           //     <Button component={Link} to={`/photos/${user._id}`} variant="contained" color="primary" onClick={()=> {console.log(user._id);}}>
//           //       User Photos
//           //     </Button>
//           //   </Grid>
//           // </Grid>
        
//           // <div className="user-detail-box" style={{ marginTop: '16px', border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
//           //   <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
//           //     First Name
//           //   </p>
//           //   <p style={{ fontSize: '0.9em', color: '#333' }}>
//           //     {user.first_name}
//           //   </p>
//           // </div>
          
//           // {/* Include other user details here */}
          
//           // <div className="user-detail-box" style={{ border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', marginTop: '10px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
//           //   <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
//           //     Last Name
//           //   </p>
//           //   <p style={{ fontSize: '0.9em', color: '#333' }}>
//           //     {user.last_name}
//           //   </p>
//           // </div>
//           // <div className="user-detail-box" style={{ border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', marginTop: '10px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
//           //   <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
//           //     Location
//           //   </p>
//           //   <p style={{ fontSize: '0.9em', color: '#333' }}>
//           //     {user.location}
//           //   </p>
//           // </div>
//           // <div className="user-detail-box" style={{ border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', marginTop: '10px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
//           //   <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
//           //     Description
//           //   </p>
//           //   <p style={{ fontSize: '0.9em', color: '#333' }}>
//           //     {user.description}
//           //   </p>
//           // </div>
//           // <div className="user-detail-box" style={{ border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', marginTop: '10px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
//           //   <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
//           //     Occupation
//           //   </p>
//           //   <p style={{ fontSize: '0.9em', color: '#333' }}>
//           //     {user.occupation}
//           //   </p>
//           // </div>
//           // </div>
        
        
        
// //         ) : (
// //           <Typography variant="body1" className="user-detail-box loading-text">
// //             Loading user details...
// //           </Typography>
// //         )}
// //       </div>
// //     );
// //   }
// // }

// // export default UserDetail;

// import React from 'react';
// import { Typography, Button, Grid } from '@mui/material';
// import { Link } from 'react-router-dom';
// import './userDetail.css';
// import FetchModel from '../../lib/fetchModelData';

// class UserDetail extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       user: null,
//     };
//   }

//   componentDidMount() {
//     this.fetchUserDetails();
//   }

//   componentDidUpdate(prevProps) {
//     const { match } = this.props;
//     const { userId } = match.params;

//     if (prevProps.match.params.userId !== userId || !this.state.user) {
//       this.fetchUserDetails(userId);
//     }
//   }

//   fetchUserDetails(userId) {
//     const { match } = this.props;

//     FetchModel(`/user/${userId}`)
//       .then((response) => {
//         this.setState({ user: response.data });
//       })
//       .catch((error) => {
//         console.error('Error fetching user details:', error);
//       });
//   }

//   render() {
//     const { user } = this.state;

//     return (
//       <div>
//         {user ? (
//           <div>
//           <Grid container justifyContent="space-between">
//             <Grid item>
//               <Button component={Link} to={`/photos/${user._id}`} variant="contained" color="primary" onClick={()=> {console.log(user._id);}}>
//                 User Photos
//               </Button>
//             </Grid>
//           </Grid>
        
//           <div className="user-detail-box" style={{ marginTop: '16px', border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
//             <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
//               First Name
//             </p>
//             <p style={{ fontSize: '0.9em', color: '#333' }}>
//               {user.first_name}
//             </p>
//           </div>
          
//           {/* Include other user details here */}
          
          // <div className="user-detail-box" style={{ border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', marginTop: '10px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
          //   <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
          //     Last Name
          //   </p>
          //   <p style={{ fontSize: '0.9em', color: '#333' }}>
          //     {user.last_name}
          //   </p>
          // </div>
          // <div className="user-detail-box" style={{ border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', marginTop: '10px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
          //   <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
          //     Location
          //   </p>
          //   <p style={{ fontSize: '0.9em', color: '#333' }}>
          //     {user.location}
          //   </p>
          // </div>
          // <div className="user-detail-box" style={{ border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', marginTop: '10px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
          //   <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
          //     Description
          //   </p>
          //   <p style={{ fontSize: '0.9em', color: '#333' }}>
          //     {user.description}
          //   </p>
          // </div>
          // <div className="user-detail-box" style={{ border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', marginTop: '10px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
          //   <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
          //     Occupation
          //   </p>
          //   <p style={{ fontSize: '0.9em', color: '#333' }}>
          //     {user.occupation}
          //   </p>
          // </div>
          // </div>
//         ) : (
//           <Typography variant="body1" className="user-detail-box loading-text">
//             Loading user details...
//           </Typography>
//         )}
//       </div>
//     );
//   }
// }

// export default UserDetail;

import React from 'react';
import { Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import './userDetail.css';
import axios from 'axios';
//import  FetchModel  from '../../lib/fetchModelData'; // Import the FetchModel function

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
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
    }
  }

  fetchUserDetails() {
    const { match } = this.props;
    const { userId } = match.params;

    // Define the URL to fetch the user data
    const url = `/user/${userId}`;

    axios.get(url) // Use the FetchModel function
      .then((response) => {
        this.setState({ user: response.data });
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  }

  render() {
    const { user } = this.state;

    return (
      <div>
        {user ? (
          <div>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Button
                  component={Link}
                  to={`/photos/${user._id}`}
                  variant="contained"
                  color="primary"
                >
                  User Photos
                </Button>
              </Grid>
            </Grid>

            <div
              className="user-detail-box"
              style={{
                marginTop: '16px',
                border: '1px solid #e74c3c',
                padding: '8px',
                borderRadius: '5px',
                backgroundColor: '#f5f5f5',
                boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)',
                transition: 'box-shadow 0.3s',
              }}
            >
              <p style={{ fontWeight: 'bold', fontSize: '1em' }}>First Name</p>
              <p style={{ fontSize: '0.9em', color: '#333' }}>{user.first_name}</p>
            </div>

            <div className="user-detail-box" style={{ border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', marginTop: '10px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
            <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
              Last Name
            </p>
            <p style={{ fontSize: '0.9em', color: '#333' }}>
              {user.last_name}
            </p>
            </div>
          <div className="user-detail-box" style={{ border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', marginTop: '10px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
            <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
              Location
            </p>
            <p style={{ fontSize: '0.9em', color: '#333' }}>
              {user.location}
            </p>
          </div>
          <div className="user-detail-box" style={{ border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', marginTop: '10px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
            <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
              Description
            </p>
            <p style={{ fontSize: '0.9em', color: '#333' }}>
              {user.description}
            </p>
          </div>
          <div className="user-detail-box" style={{ border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', marginTop: '10px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
            <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
              Occupation
            </p>
            <p style={{ fontSize: '0.9em', color: '#333' }}>
              {user.occupation}
            </p>
          </div>
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
