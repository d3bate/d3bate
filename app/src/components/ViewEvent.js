import React from 'react';
import {Button, Card, majorScale} from "evergreen-ui";
import {Link} from "react-router-dom";
import {Checkbox} from "./Checkbox";
import {firebase} from "../sync";
import {debatingClub} from "../sync/models/club";
import {observer} from "mobx-react";

const ViewEvent = observer(class ViewEvent extends React.Component {
    render() {
        return <Card background="blueTint" margin={4} padding={majorScale(1)} elevation={1}
                     height={'155px'} width={'100px'}>
            <p>{this.props.day} {this.props.event ? <Link to={'/event/' + this.props.event.id}>(view)</Link> : null}</p>
            <p>{this.props.event ? this.props.event['type'] : null}</p>
            {this.props.event ? <>
                <div><span style={{fontSize: '10px', float: 'left'}}>Attending: </span><Checkbox
                    checked={this.props.attending}
                    // Add attendance documents to the Firestore
                    updateHandler={(e) => {
                        if (this.props.attendance) {
                            firebase.firestore().collection('attendance').doc(this.props.attendance.id).update({
                                attending: e.target.checked
                            })
                        } else {
                            firebase.firestore().collection('attendance').add({
                                eventID: this.props.event.id,
                                attending: e.target.checked,
                                userID: firebase.auth().currentUser.uid,
                                clubID: debatingClub.club.clubID
                            })
                        }
                    }
                    }/></div>
                {debatingClub.club ? debatingClub.club.role === 'admin' ?
                    <Button height={majorScale(3)} onClick={e => {
                        e.preventDefault();
                        this.props.match.history.push('/register/' + this.props.event.id)
                    }}>Register</Button> : null : null}</> : null}
        </Card>
    }
});

export {ViewEvent}