import React from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField
} from '@material-ui/core';

class LoginButton extends React.Component {
    
    render() {
        const { onButtonClick } = this.props;

        return (
            <Button color="inherit" onClick={onButtonClick}>Войти</Button>
        );
    }
}

export default LoginButton;