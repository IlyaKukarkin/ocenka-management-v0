import React from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField
} from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

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
            const resultObject = { city: this.state.login, district: this.state.password, street: this.state.patronymic, house: this.state.birthday, numberOfFlat: this.state.worksSince }


            this.props.onAddAction(resultObject);

            this.setState({
                login: '',
                password: '',
                loginError: false,
                passwordError: false,
                loginLabel: "Логин",
                passwordLabel: "Пароль",
            });
        }
    }

    validateForm() {
        let city = false, district = false, street = false, house = false, numberOfFlat = false;

        return true;

        if (this.state.login !== "") {
            if (this.state.login.length > 30) {
                this.setState({ surnameLabel: "Город до 30 символов" });
                this.setState({ surnameError: true });
                city = true;
            }
        } else {
            this.setState({ surnameLabel: "Введите фамилию"});
            this.setState({ surnameError: true });
            city = true;
        }

        if (this.state.password !== "") {
            if (this.state.password.length > 30) {
                this.setState({ nameLabel: "Район до 30 символов" });
                this.setState({ nameError: true });
                district = true;
            }
        } else {
            this.setState({ nameLabel: "Введите имя" });
            this.setState({ nameError: true });
            district = true;
        }

        if (this.state.patronymic !== "") {
            if (this.state.patronymic.length > 30) {
                this.setState({ patronymicLabel: "Улица до 30 символов" });
                this.setState({ patronymicError: true });
                street = true;
            }
        } else {
            this.setState({ patronymicLabel: "Введите отчество" });
            this.setState({ patronymicError: true });
            street = true;
        }

        if (this.state.birthday !== "") {
            if (this.state.birthday > 250 || this.state.birthday < 1 || !Number.isInteger(+this.state.birthday)) {
                this.setState({ birthdayLabel: "Номер дома - целое число от 1 до 250" });
                this.setState({ birthdayError: true });
                house = true;
            }
        } else {
            this.setState({ birthdayLabel: "Введите дату рождения" });
            this.setState({ birthdayError: true });
            house = true;
        }

        if (this.state.worksSince !== "") {
            if (this.state.worksSince > 1000 || this.state.worksSince < 1 || !Number.isInteger(+this.state.worksSince)) {
                this.setState({ worksSinceLabel: "Номер квартиры - целое число от 1 до 1000" });
                this.setState({ worksSinceError: true });
                numberOfFlat = true;
            }
        } else {
            this.setState({ worksSinceLabel: "Введите дату начала работы" });
            this.setState({ worksSinceError: true });
            numberOfFlat = true;
        }

        if (this.state.position !== "") {
            if (this.state.position.length > 30) {
                this.setState({ positionLabel: "Улица до 30 символов" });
                this.setState({ positionError: true });
                street = true;
            }
        } else {
            this.setState({ positionLabel: "Введите должность" });
            this.setState({ positionError: true });
            street = true;
        }

        if (!city) {
            this.setState({ cityLabel: "Город" });
            this.setState({ cityError: false });
        }

        if (!district) {
            this.setState({ districtLabel: "Район" });
            this.setState({ districtError: false });
        }

        if (!street) {
            this.setState({ streetLabel: "Улица" });
            this.setState({ streetError: false });
        }

        if (!house) {
            this.setState({ houseLabel: "Номер дома" });
            this.setState({ houseError: false });
        }

        if (!numberOfFlat) {
            this.setState({ numberOfFlatLabel: "Номер квартиры" });
            this.setState({ numberOfFlatError: false });
        }

        return (city || district || street || house || numberOfFlat);
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
        const { showDialog } = this.props;

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

export default LoginDialog;