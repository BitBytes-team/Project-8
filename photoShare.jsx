import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Grid, Paper } from '@mui/material';
import './styles/main.css';

import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
import LoginRegister from './components/loginRegister/loginRegister';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topname: '',
      user: null,
      // eslint-disable-next-line react/no-unused-state
      main_content: undefined, // Add main_content state
    };
  }

  setTopName = (name) => {
    this.setState({ topname: name });
  };

  changeUser = (user) => {
    this.setState({ user });
  };

  // Add changeMainContent function
  changeMainContent = (content) => {
    // eslint-disable-next-line react/no-unused-state
    this.setState({ main_content: content });
  };

  render() {
    return (
      <BrowserRouter>
        <div>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <TopBar
                topName={this.state.topname}
                user={this.state.user}
                changeUser={this.changeUser}
              />
            </Grid>
            <div className="main-topbar-buffer" />
            <Grid item sm={2}>
              {this.state.user ? (
                <Paper className="main-grid-item">
                  {this.state.user ? <UserList setTopName={this.setTopName} /> : null}
                </Paper>
              ) : null}
            </Grid>
            <Grid item sm={10}>
              <Paper className="main-grid-item">
                <Switch>
                {
                this.state.user ?
                    <Route path="/users/:userId" render={ props => <UserDetail {...props} changeMainContent={this.changeMainContent}/> }/>
                    :
                    <Redirect path="/users/:userId" to="/login-register" />
              }
              {
                this.state.user ?
                    <Route path="/photos/:userId" render ={ props => <UserPhotos {...props} changeMainContent={this.changeMainContent}/> }/>
                    :
                    <Redirect path="/photos/:userId" to="/login-register" />
              }
              {
                this.state.user ?
                    <Route path="/" render={() => (<div/>)}/>
                    :
                    <Route path="/login-register" render ={ props => <LoginRegister {...props} changeUser={this.changeUser}/> } />
              }
               {
                this.state.user ?
                    <Route path="/" render={() => (<div/>)}/>
                    :
                    <Route path="/" render ={ props => <LoginRegister {...props} changeUser={this.changeUser}/> } />
              }
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<PhotoShare />, document.getElementById('photoshareapp'));
