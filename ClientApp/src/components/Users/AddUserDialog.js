import React from 'react';
import MaskedInput from 'react-text-mask';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField, MenuItem, IconButton, InputAdornment, FormControl, Input, InputLabel
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
            placeholderChar={'\u2000'}
            keepCharPositions={true}
            guide={false}
            showMask
        />
    );
}

class AddUserDialog extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.myHandleClose = this.myHandleClose.bind(this);
        this.state = {
            surname: '',
            name: '',
            patronymic: '',
            login: '',
            password: '',
            birthday: '',
            worksSince: '',
            position: '',
            surnameError: false,
            nameError: false,
            patronymicError: false,
            loginError: false,
            passwordError: false,
            birthdayError: false,
            worksSinceError: false,
            positionError: false,
            surnameLabel: "Фамилия",
            nameLabel: "Имя",
            patronymicLabel: "Отчество",
            loginLabel: "Логин",
            passwordLabel: "Пароль",
            birthdayLabel: "Дата рождения",
            worksSinceLabel: "Дата начала работы",
            positionLabel: "Должность",
            showPassword: false
        };
    }

    submitHandler(evt) {
        evt.preventDefault();
        // pass the input field value to the event handler passed
        // as a prop by the parent (App)

        if (!this.validateForm()) {
            let role = 1;
            if (this.state.position === 'Бухгалтер') {
                role = 2;
            }

            const resultObject = {
                surname: this.state.surname, name: this.state.name, patronymic: this.state.patronymic,
                login: this.state.login, password: this.state.password, birthday: this.state.birthday,
                worksSince: this.state.worksSince, roleId: role
            }


            this.props.onAddAction(resultObject);

            this.setState({
                surname: '',
                name: '',
                patronymic: '',
                login: '',
                password: '',
                birthday: '',
                worksSince: '',
                position: '',
                surnameError: false,
                nameError: false,
                patronymicError: false,
                loginError: false,
                passwordError: false,
                birthdayError: false,
                worksSinceError: false,
                positionError: false,
                surnameLabel: "Фамилия",
                nameLabel: "Имя",
                patronymicLabel: "Отчество",
                loginLabel: "Логин",
                passwordLabel: "Пароль",
                birthdayLabel: "Дата рождения",
                worksSinceLabel: "Дата начала работы",
                positionLabel: "Должность",
                showPassword: false
            });
        }
    }

    checkData(day, month, year) {
        const today = new Date();
        const yyyy = today.getFullYear();

        if ((day < 1) || (day > 31) || (month < 1) || (month > 12) || (year < 1945) || (year > yyyy)) {
            return true;
        } else {
            switch (month) {
                case 2:
                    if (year % 4 === 0) {
                        if (day > 29) { return true; }
                    } else {
                        if (day > 28) { return true; }
                    }
                    break;
                case 4:
                    if (day > 30) { return true; }
                    break;
                case 6:
                    if (day > 30) { return true; }
                    break;
                case 9:
                    if (day > 30) { return true; }
                    break;
                case 11:
                    if (day > 30) { return true; }
                    break;
            }
        }

        return false;
    }

    dateLess(firstDate, secondDate) {
        const day1 = +firstDate.substring(0, 2);
        const month1 = +firstDate.substring(3, 5);
        const year1 = +firstDate.substring(6, 10);

        const day2 = +secondDate.substring(0, 2);
        const month2 = +secondDate.substring(3, 5);
        const year2 = +secondDate.substring(6, 10);

        if (year1 < year2) {
            return true;
        } else {
            if (year1 === year2) {
                if (month1 < month2) {
                    return true;
                } else {
                    if (month1 === month2) {
                        if (day1 < day2) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            }
        }

        return false;
    }

    validateForm() {
        let surname = false, name = false, patronymic = false, login = false, password = false, birthday = false, worksSince = false, position = false;

        if (this.state.surname !== "") {
            if (this.state.surname.length > 30) {
                this.setState({ surnameLabel: "Фамилия до 30 символов" });
                this.setState({ surnameError: true });
                surname = true;
            }
        } else {
            this.setState({ surnameLabel: "Введите фамилию"});
            this.setState({ surnameError: true });
            surname = true;
        }

        if (this.state.name !== "") {
            if (this.state.name.length > 30) {
                this.setState({ nameLabel: "Имя до 30 символов" });
                this.setState({ nameError: true });
                name = true;
            }
        } else {
            this.setState({ nameLabel: "Введите имя" });
            this.setState({ nameError: true });
            name = true;
        }

        if (this.state.patronymic !== "") {
            if (this.state.patronymic.length > 30) {
                this.setState({ patronymicLabel: "Отчество до 30 символов" });
                this.setState({ patronymicError: true });
                patronymic = true;
            }
        } else {
            this.setState({ patronymicLabel: "Введите отчество" });
            this.setState({ patronymicError: true });
            patronymic = true;
        }

        if (this.state.login !== "") {
            if (this.state.login.length > 30 || this.state.login.length < 8) {
                this.setState({ loginLabel: "Логин от 8 до 30 символов" });
                this.setState({ loginError: true });
                login = true;
            } else {
                if (/[А-Я]/.test(this.state.login) || /[а-я]/.test(this.state.login)) {
                    this.setState({ loginLabel: "Логин не должен содержать русские буквы" });
                    this.setState({ loginError: true });
                    login = true;
                }
            }
        } else {
            this.setState({ loginLabel: "Введите логин" });
            this.setState({ loginError: true });
            login = true;
        }

        if (this.state.password !== "") {
            if (this.state.password.length > 30) {
                this.setState({ passwordLabel: "Пароль до 30 символов" });
                this.setState({ passwordError: true });
                password = true;
            } else {
                if (this.state.password.length < 8) {
                    this.setState({ passwordLabel: "Пароль от 8 символов" });
                    this.setState({ passwordError: true });
                    password = true;
                } else {
                    let count = 0;

                    count += /[a-z]/.test(this.state.password) ? 1 : 0;
                    count += /[A-Z]/.test(this.state.password) ? 1 : 0;
                    count += /\d/.test(this.state.password) ? 1 : 0;

                    if (count !== 3) {
                        this.setState({ passwordLabel: "Пароль должен содержать цифры, строчные и заглавные латинские буквы" });
                        this.setState({ passwordError: true });
                        password = true;
                    }
                }
            }
        } else {
            this.setState({ passwordLabel: "Введите пароль" });
            this.setState({ passwordError: true });
            password = true;
        }

        if (this.state.birthday !== "") {
            if (this.state.birthday.length < 10) {
                this.setState({ birthdayLabel: "Введите дату рождения полностью" });
                this.setState({ birthdayError: true });
                birthday = true;
            } else {
                const day = +this.state.birthday.substring(0, 2);
                const month = +this.state.birthday.substring(3, 5);
                const year = +this.state.birthday.substring(6, 10);

                if (this.checkData(day, month, year)) {
                    this.setState({ birthdayLabel: "Введите дату рождения корректно" });
                    this.setState({ birthdayError: true });
                    birthday = true;
                }
            }
        } else {
            this.setState({ birthdayLabel: "Введите дату рождения" });
            this.setState({ birthdayError: true });
            birthday = true;
        }

        if (this.state.worksSince !== "") {
            if (this.state.worksSince.length < 10) {
                this.setState({ worksSinceLabel: "Введите год начала работы полностью" });
                this.setState({ worksSinceError: true });
                worksSince = true;
            } else {
                const day = +this.state.worksSince.substring(0, 2);
                const month = +this.state.worksSince.substring(3, 5);
                const year = +this.state.worksSince.substring(6, 10);

                if (this.checkData(day, month, year)) {
                    this.setState({ worksSinceLabel: "Введите год начала работы корректно" });
                    this.setState({ worksSinceError: true });
                    worksSince = true;
                }
            }
        } else {
            this.setState({ worksSinceLabel: "Введите дату начала работы" });
            this.setState({ worksSinceError: true });
            worksSince = true;
        }

        if (this.state.position === "") {
            this.setState({ positionLabel: "Выберите должность" });
            this.setState({ positionError: true });
            position = true;
        }

        if (!surname) {
            this.setState({ surnameLabel: "Фамилия" });
            this.setState({ surnameError: false });
        }

        if (!name) {
            this.setState({ nameLabel: "Имя" });
            this.setState({ nameError: false });
        }

        if (!patronymic) {
            this.setState({ patronymicLabel: "Отчество" });
            this.setState({ patronymicError: false });
        }

        if (!login) {
            this.setState({ loginLabel: "Логин" });
            this.setState({ loginError: false });
        }

        if (!password) {
            this.setState({ passwordLabel: "Пароль" });
            this.setState({ passwordError: false });
        }

        if (!birthday) {
            this.setState({ birthdayLabel: "Дата рождения" });
            this.setState({ birthdayError: false });
        }

        if (!worksSince) {
            this.setState({ worksSinceLabel: "Дата начала работы" });
            this.setState({ worksSinceError: false });
        }

        if (!position) {
            this.setState({ positionLabel: "Должность" });
            this.setState({ positionError: false });
        }

        if (!birthday && !worksSince) {
            if (!this.dateLess(this.state.birthday, this.state.worksSince)) {
                this.setState({ worksSinceLabel: "Дата начала работы раньше или равна дню рождения" });
                this.setState({ worksSinceError: true });
                worksSince = true;
            }
        }

        return (surname || name || patronymic || login || password || birthday || worksSince || position);
    }

    handleChange(event) {
        if (event.target.id === undefined) {
            this.setState({ position: event.target.value });
        } else {
            this.setState({
                [event.target.id]: event.target.value
            });
        }
    }

    handleClickShowPassword = () => {
        const val = !this.state.showPassword;
        this.setState({
            showPassword: val
        });
    };

    myHandleClose() {
        this.setState({
            surname: '',
            name: '',
            patronymic: '',
            login: '',
            password: '',
            birthday: '',
            worksSince: '',
            position: '',
            surnameError: false,
            nameError: false,
            patronymicError: false,
            loginError: false,
            passwordError: false,
            birthdayError: false,
            worksSinceError: false,
            positionError: false,
            surnameLabel: "Фамилия",
            nameLabel: "Имя",
            patronymicLabel: "Отчество",
            loginLabel: "Логин",
            passwordLabel: "Пароль",
            birthdayLabel: "Дата рождения",
            worksSinceLabel: "Дата начала работы",
            positionLabel: "Должность",
            showPassword: false
        });

        this.props.onCancelAction();
    }

    render() {
        const { showDialog } = this.props;

        const positions = [{ value: 'Оценщик', label: 'Оценщик' }, { value: 'Бухгалтер', label: 'Бухгалтер' }];

        return (
            <Dialog
                open={showDialog}
                onClose={this.myHandleClose}
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    Добавить пользователя
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={this.submitHandler}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="surname"
                            label={this.state.surnameLabel}
                            value={this.state.surname}
                            onChange={this.handleChange}
                            error={this.state.surnameError}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label={this.state.nameLabel}
                            value={this.state.name}
                            onChange={this.handleChange}
                            error={this.state.nameError}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="patronymic"
                            label={this.state.patronymicLabel}
                            value={this.state.patronymic}
                            onChange={this.handleChange}
                            error={this.state.patronymicError}
                            fullWidth
                        />
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
                        <FormControl fullWidth={true}>
                            <InputLabel
                                htmlFor="adornment-password"
                                error={this.state.passwordError}>
                                {this.state.passwordLabel}
                            </InputLabel>
                            <Input
                                id="password"
                                type={this.state.showPassword ? 'text' : 'password'}
                                value={this.state.password}
                                onChange={this.handleChange}
                                error={this.state.passwordError}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton aria-label="Toggle password visibility" onClick={this.handleClickShowPassword}>
                                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="birthday"
                            label={this.state.birthdayLabel}
                            value={this.state.birthday}
                            onChange={this.handleChange}
                            error={this.state.birthdayError}
                            InputProps={{
                                inputComponent: TextMaskCustom
                            }}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="worksSince"
                            label={this.state.worksSinceLabel}
                            value={this.state.worksSince}
                            onChange={this.handleChange}
                            error={this.state.worksSinceError}
                            InputProps={{
                                inputComponent: TextMaskCustom
                            }}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            select
                            margin="dense"
                            id="position"
                            label={this.state.positionLabel}
                            value={this.state.position}
                            onChange={this.handleChange}
                            error={this.state.positionError}
                            fullWidth
                        >
                            {positions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.myHandleClose} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={this.submitHandler} color="secondary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AddUserDialog;