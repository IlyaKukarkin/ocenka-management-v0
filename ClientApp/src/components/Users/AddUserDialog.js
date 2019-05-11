import React from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField
} from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
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
            birthday: '',
            worksSince: '',
            position: '',
            surnameError: false,
            nameError: false,
            patronymicError: false,
            birthdayError: false,
            worksSinceError: false,
            positionError: false,
            surnameLabel: "Фамилия",
            nameLabel: "Имя",
            patronymicLabel: "Отчество",
            birthdayLabel: "Дата рождения",
            worksSinceLabel: "Дата начала работы",
            positionLabel: "Должность"
        };
    }

    submitHandler(evt) {
        evt.preventDefault();
        // pass the input field value to the event handler passed
        // as a prop by the parent (App)

        if (!this.validateForm()) {
            const resultObject = { city: this.state.surname, district: this.state.name, street: this.state.patronymic, house: this.state.birthday, numberOfFlat: this.state.worksSince }


            this.props.onAddAction(resultObject);

            this.setState({
                surname: '',
                name: '',
                patronymic: '',
                birthday: '',
                worksSince: '',
                position: '',
                surnameError: false,
                nameError: false,
                patronymicError: false,
                birthdayError: false,
                worksSinceError: false,
                positionError: false,
                surnameLabel: "Фамилия",
                nameLabel: "Имя",
                patronymicLabel: "Отчество",
                birthdayLabel: "Дата рождения",
                worksSinceLabel: "Дата начала работы",
                positionLabel: "Должность"
            });
        }
    }

    validateForm() {
        let city = false, district = false, street = false, house = false, numberOfFlat = false;

        if (this.state.surname !== "") {
            if (this.state.surname.length > 30) {
                this.setState({ surnameLabel: "Город до 30 символов" });
                this.setState({ surnameError: true });
                city = true;
            }
        } else {
            this.setState({ surnameLabel: "Введите фамилию"});
            this.setState({ surnameError: true });
            city = true;
        }

        if (this.state.name !== "") {
            if (this.state.name.length > 30) {
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
            surname: '',
            name: '',
            patronymic: '',
            birthday: '',
            worksSince: '',
            position: '',
            surnameError: false,
            nameError: false,
            patronymicError: false,
            birthdayError: false,
            worksSinceError: false,
            positionError: false,
            surnameLabel: "Фамилия",
            nameLabel: "Имя",
            patronymicLabel: "Отчество",
            birthdayLabel: "Дата рождения",
            worksSinceLabel: "Дата начала работы",
            positionLabel: "Должность"
        });

        this.props.onCancelAction();
    }

    render() {
        const { showDialog } = this.props;

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
                    Добавить оценщика
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
                            id="birthday"
                            label={this.state.birthdayLabel}
                            value={this.state.birthday}
                            onChange={this.handleChange}
                            error={this.state.birthdayError}
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
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="position"
                            label={this.state.positionLabel}
                            value={this.state.position}
                            onChange={this.handleChange}
                            error={this.state.positionError}
                            fullWidth
                        />
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