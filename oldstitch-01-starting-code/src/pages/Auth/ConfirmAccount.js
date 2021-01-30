import React, { Component } from 'react';

import './ConfirmAccount.css';

class AuthPage extends Component {
  componentDidMount() {
    const queryUrl = window.location.search;
    const queryParams = new URLSearchParams(queryUrl);
    // eslint-disable-next-line
    const token = queryParams.get('token');
    // eslint-disable-next-line
    const tokenId = queryParams.get('tokenId');
    console.log('Account confirmed');
    this.props.history.replace('/');
  }

  render() {
    return (
      <main className='confirm-account-page'>
        <p>Confirming Account...</p>
      </main>
    );
  }
}
export default AuthPage;
