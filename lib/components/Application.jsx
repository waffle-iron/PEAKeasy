import React, { Component } from 'react';
import { map, filter } from 'lodash'
import { BrowserRouter, Match, Miss, Link } from 'react-router';
import firebase, { signIn, signOut, reference, remove } from '../firebase';
import Search from './Search'
import IndividualMountain from './IndividualMountain'
import HomePage from './HomePage'
import mountainData from '../data.js'
import SignIn from './SignIn'
import SignOut from './SignOut'
import Header from './Header'



class Application extends Component {
  constructor() {
    super();
			this.state = {
				data: [],

				user: null,
				mountainDatabase: null,
				favorites: []
			}
		}


	componentDidMount() {
		firebase.auth().onAuthStateChanged(user => this.referenceDatabaseUser(user));
		this.setState({
			data: mountainData
		})
	}


	referenceDatabaseUser(user){
		this.setState({
			user,
			mountainDatabase: user ? firebase.database().ref(user.uid) : null
		},
			() => {
				this.createDatabaseEventListener(user);
			}
		);
	}


  createDatabaseEventListener(user){
    if (user) {
      firebase.database().ref(user.uid).on('value', (snapshot) => {
        const favorites = snapshot.val() || {};
        this.setState({
          favorites: map(favorites, (val, key) => extend(val, { key })),
        });
      });
    } else {
      this.setState({
        favorites: [],
      });
    }
  }







	render() {

		return(
			<BrowserRouter>
				<section>
					<Header user={this.props.user}/>
					<Match exactly pattern="/" render={ () => (
						<HomePage data={this.state.data} searchString={this.state.searchString} />
					)} />
					<Match exactly pattern="/:name" render={ () =>
						<IndividualMountain /> } />

				</section>
			</BrowserRouter>
		)
	}
}

export default Application;
