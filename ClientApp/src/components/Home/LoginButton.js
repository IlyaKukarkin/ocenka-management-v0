import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../store/LoginReducer';
import {
    Button
} from '@material-ui/core';

class LoginButton extends React.Component {

    logoutClick = () => {
        this.props.Logout();

        this.props.exitClick();
    }
    
    render() {
        const { loginClick, role } = this.props;

        return (
            <Button color="inherit" onClick={role === 0 ? loginClick : this.logoutClick}>{role === 0 ? "Войти" : "Выйти"}</Button>
        );
    }
}

export default connect(
    state => state.login,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(LoginButton);