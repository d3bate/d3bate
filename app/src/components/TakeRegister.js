import React from 'react';
import {observer} from "mobx-react";
import {Card, Checkbox} from "evergreen-ui";
import {clubUsers} from "../sync/models/clubUsers";
import {registerDocuments} from "../sync/models/register";
import {firebase} from '../sync';
import {debatingClub} from "../sync/models/club";


const TakeRegister = observer(class TakeRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {register: null};
        this.state.register = registerDocuments.docs.find((o) => o.id === this.props.id);
    }

    render() {
        return <>
            <form onSubmit={e => {
                e.preventDefault();
            }}>
                {clubUsers.users.map((user, userIndex) => {
                    let foundUser = !!(this.state.register ? this.state.register.attendingUsers.find(o => o === user.id) : null);
                    if (foundUser) {
                        return <Card key={userIndex}>
                            <p>{user.email}</p>
                            <Checkbox checked={true}
                                      onChange={e => {
                                          if (this.state.register) {
                                              firebase.firestore().collection('register').doc(this.props.id).update({
                                                  attendingUsers: firebase.firestore.FieldValue.arrayRemove(user.id)
                                              });
                                              this.setState(state => {
                                                  const localRegister = state.register;
                                                  return {
                                                      register: {
                                                          ...localRegister,
                                                          attendingUsers: [...localRegister.attendingUsers.filter(o => o !== user.id)]
                                                      }
                                                  }
                                              })
                                          } else {
                                              firebase.firestore().collection('register').doc(this.props.id).set({
                                                  clubID: debatingClub.club.clubID,
                                                  eventID: this.props.id,
                                                  attendingUsers: [user.id]
                                              })
                                          }
                                      }}/>
                        </Card>
                    } else {
                        return <Card key={userIndex}>
                            <p>{user.email}</p>
                            <Checkbox checked={false}
                                      onChange={e => {
                                          if (this.state.register) {
                                              firebase.firestore().collection('register').doc(this.props.id).update({
                                                  attendingUsers: firebase.firestore.FieldValue.arrayUnion(user.id)
                                              });
                                              this.setState(state => {
                                                  const localRegister = state.register;
                                                  return {
                                                      register: {
                                                          ...localRegister,
                                                          attendingUsers: [user.id, ...localRegister.attendingUsers]
                                                      }
                                                  }
                                              })
                                          } else {
                                              firebase.firestore().collection('register').doc(this.props.id).set({
                                                  clubID: debatingClub.club.clubID,
                                                  eventID: this.props.id,
                                                  attendingUsers: [user.id]
                                              })
                                          }
                                      }}/>
                        </Card>
                    }
                })}
            </form>
        </>
    }
});

export {TakeRegister}