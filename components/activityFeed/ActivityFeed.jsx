import React from 'react';
import axios from "axios";
import {
    Typography, Button
    } from '@mui/material';
class Activity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activityList: [],
        };
    }

    componentDidMount() {
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

    handleRefersh = ()=>{
        axios.get('/activity')
        .then((res) => {
                this.setState({activityList: res.data});
            })
        .catch((err) => {
                console.log(err);
            });
    };

    render() {
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
            <div style={{maxHeight: '100%', overflow: 'auto'}}>
                <Typography variant="h5">Activity Board</Typography>
                {innerHTML}
                <br/>
                <Button variant="outlined" onClick={this.handleRefersh}> Refresh </Button>
            </div>
        );
    }

}

export default Activity;
