import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { actionCreators } from '../store/LoginReducer';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField, Typography
} from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const styles = theme => ({
    error: {
        marginBottom: '4px',
    },
    errorText: {
        color: '#f44336',
    },
});

class LoginDialog extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.myHandleClose = this.myHandleClose.bind(this);
        this.state = {
            login: '',
            password: '',            
            loginError: false,
            passwordError: false,
            loginLabel: "Логин",
            passwordLabel: "Пароль",
        };
    }

    submitHandler(evt) {
        evt.preventDefault();
        // pass the input field value to the event handler passed
        // as a prop by the parent (App)

        if (!this.validateForm()) {
            const resultObject = { login: this.state.login, password: this.state.password }

            this.setState({
                loginError: false,
                passwordError: false,
                loginLabel: "Логин",
                passwordLabel: "Пароль",
            });

            let test = this.props.Login(resultObject);

            test.then((res) => {
                if (res.role !== 0) {
                    this.setState({
                        login: '',
                        password: ''
                    });

                    this.props.onCancelAction();
                }
            });
        }
    }

    validateForm() {
        let login = false, password = false;

        if (this.state.login === "") {
            this.setState({ loginLabel: "Введите логин"});
            this.setState({ loginError: true });
            login = true;
        }

        if (this.state.password === "") {
            this.setState({ passwordLabel: "Введите пароль" });
            this.setState({ passwordError: true });
            password = true;
        }

        if (!login) {
            this.setState({ cityLabel: "Город" });
            this.setState({ cityError: false });
        }

        if (!password) {
            this.setState({ districtLabel: "Район" });
            this.setState({ districtError: false });
        }

        return (login || password);
    }

    handleChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    myHandleClose() {
        this.setState({
            login: '',
            password: '',
            loginError: false,
            passwordError: false,
            loginLabel: "Логин",
            passwordLabel: "Пароль",
        });

        this.props.onCancelAction();
    }

    render() {
        const { showDialog, error, classes } = this.props;

        return (
            <Dialog
                open={showDialog}
                TransitionComponent={Transition}
                onClose={this.myHandleClose}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    Войти в систему
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={this.submitHandler}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="login"
                            label={this.state.loginLabel}
                            value={this.state.login}
                            onChange={this.handleChange}
                            error={this.state.loginError}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="password"
                            label={this.state.passwordLabel}
                            value={this.state.password}
                            onChange={this.handleChange}
                            error={this.state.passwordError}
                            type="password"
                            fullWidth
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <div hidden={error} className={classes.error}>
                        <Typography className={classes.errorText}>Неверный логин или пароль</Typography>
                    </div>
                    <Button onClick={this.myHandleClose} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={this.submitHandler} color="secondary">
                        Войти
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(connect(
    state => state.login,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(LoginDialog));