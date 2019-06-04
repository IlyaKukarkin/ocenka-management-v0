import React from 'react';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField, MenuItem, IconButton, InputAdornment, FormControl, Input, InputLabel
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

function DateMask(props) {
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

function NumberMask(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/]}
            placeholderChar={'\u2000'}
            keepCharPositions={true}
            guide={false}
            showMask
        />
    );
}

function SeriesMask(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/]}
            placeholderChar={'\u2000'}
            keepCharPositions={true}
            guide={false}
            showMask
        />
    );
}

function DivisionMask(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/]}
            placeholderChar={'\u2000'}
            keepCharPositions={true}
            guide={false}
            showMask
        />
    );
}

function FlatMask(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
            placeholderChar={'\u2000'}
            keepCharPositions={true}
            guide={false}
            showMask
        />
    );
}

function HouseMask(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/[0-9]/, /[0-9]/, /[0-9]/]}
            placeholderChar={'\u2000'}
            keepCharPositions={true}
            guide={false}
            showMask
        />
    );
}

class AddClientDialog extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.myHandleClose = this.myHandleClose.bind(this);
        this.state = {
            surname: '',
            name: '',
            patronymic: '',
            series: '',
            number: '',
            dateOfBirth: '',
            dateOfIssue: '',
            divisionCode: '',
            issuedBy: '',
            city: '',
            district: '',
            street: '',
            house: '',
            numberOfFlat: '',
            surnameError: false,
            nameError: false,
            patronymicError: false,
            seriesError: false,
            numberError: false,
            dateOfBirthError: false,
            dateOfIssueError: false,
            divisionCodeError: false,
            issuedByError: false,
            cityError: false,
            districtError: false,
            streetError: false,
            houseError: false,
            numberOfFlatError: false,
            surnameLabel: "Фамилия",
            nameLabel: "Имя",
            patronymicLabel: "Отчество",
            seriesLabel: "Серия паспорта",
            numberLabel: "Номер паспорта",
            dateOfBirthLabel: "Дата рождения",
            dateOfIssueLabel: "Дата выдачи паспорта",
            divisionCodeLabel: "Код подразделения",
            issuedByLabel: "Паспорт выдан",
            cityLabel: "Город",
            districtLabel: "Район",
            streetLabel: "Улица",
            houseLabel: "Номер дома",
            numberOfFlatLabel: "Номер квартиры"
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editClient !== undefined && nextProps.editClient.surname !== undefined && (this.state.surname !== nextProps.editClient.surname || this.state.series !== nextProps.editClient.series || this.state.number !== nextProps.editClient.number)) {
            this.setState({
                surname: nextProps.editClient.surname,
                name: nextProps.editClient.name,
                patronymic: nextProps.editClient.patronymic,
                series: nextProps.editClient.series,
                number: nextProps.editeditClientUser.number,
                dateOfBirth: this.convertData(nextProps.editClient.dateOfBirth),
                dateOfIssue: this.convertData(nextProps.editClient.dateOfIssue),
                divisionCode: nextProps.editClient.divisionCode,
                issuedBy: nextProps.editClient.issuedBy,
                city: nextProps.editClient.city,
                district: nextProps.editClient.district,
                street: nextProps.editClient.street,
                house: nextProps.editClient.house,
                numberOfFlat: nextProps.editClient.numberOfFlat,
            });
        }
    }

    convertData = (data) => {
        let res = '';
        let year, m, d;

        year = data.substring(0, 4);
        m = data.substring(5, 7);
        d = data.substring(8, 10);

        res = d + '/' + m + '/' + year;

        return res;
    }

    replaceDayAndMonth = (data) => {
        let res, day, mon, year;

        day = data.substring(0, 2);
        mon = data.substring(3, 5);
        year = data.substring(6, 10);

        res = mon + '/' + day + '/' + year;

        return res;
    }

    submitHandler(evt) {
        evt.preventDefault();
        // pass the input field value to the event handler passed
        // as a prop by the parent (App)

        if (!this.validateForm()) {
            if (this.props.editClient === undefined || this.props.editClient.id === undefined) {
                const resultObject = {
                    surname: this.state.surname, name: this.state.name, patronymic: this.state.patronymic,
                    series: this.state.series.replace(' ', ''), number: this.state.number.replace(' ', ''), dateOfBirth: this.replaceDayAndMonth(this.state.dateOfBirth),
                    dateOfIssue: this.replaceDayAndMonth(this.state.dateOfIssue), divisionCode: this.state.divisionCode.replace('-', ''), issuedBy: this.state.issuedBy,
                    city: this.state.city, district: this.state.district, street: this.state.street,
                    house: this.state.house, numberOfFlat: this.state.numberOfFlat
                }

                this.props.onAddAction(resultObject);
            } else {
                const resultObject2 = {
                    id: this.props.editClient.id,
                    surname: this.state.surname, name: this.state.name, patronymic: this.state.patronymic,
                    series: this.state.series.replace(' ', ''), number: this.state.number.replace(' ', ''), dateOfBirth: this.replaceDayAndMonth(this.state.dateOfBirth),
                    dateOfIssue: this.replaceDayAndMonth(this.state.dateOfIssue), divisionCode: this.state.divisionCode.replace('-', ''), issuedBy: this.state.issuedBy,
                    city: this.state.city, district: this.state.district, street: this.state.street,
                    house: this.state.house, numberOfFlat: this.state.numberOfFlat
                }

                this.props.onEditAction(resultObject2);
            }

            this.setState({
                surname: '',
                name: '',
                patronymic: '',
                series: '',
                number: '',
                dateOfBirth: '',
                dateOfIssue: '',
                divisionCode: '',
                issuedBy: '',
                city: '',
                district: '',
                street: '',
                house: '',
                numberOfFlat: '',
                surnameError: false,
                nameError: false,
                patronymicError: false,
                seriesError: false,
                numberError: false,
                dateOfBirthError: false,
                dateOfIssueError: false,
                divisionCodeError: false,
                issuedByError: false,
                cityError: false,
                districtError: false,
                streetError: false,
                houseError: false,
                numberOfFlatError: false,
                surnameLabel: "Фамилия",
                nameLabel: "Имя",
                patronymicLabel: "Отчество",
                seriesLabel: "Серия паспорта",
                numberLabel: "Номер паспорта",
                dateOfBirthLabel: "Дата рождения",
                dateOfIssueLabel: "Дата выдачи паспорта",
                divisionCodeLabel: "Код подразделения",
                issuedByLabel: "Паспорт выдан",
                cityLabel: "Город",
                districtLabel: "Район",
                streetLabel: "Улица",
                houseLabel: "Номер дома",
                numberOfFlatLabel: "Номер квартиры"
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
        let surname = false, name = false, patronymic = false, series = false, number = false, dateOfBirth = false, dateOfIssue = false, divisionCode = false, issuedBy = false, city = false, district = false, street = false, house = false, numberOfFlat = false;

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

        if (this.state.series !== "") {
            if (this.state.series.length !== 5) {
                this.setState({ seriesLabel: "Введите номер паспорта полностью" });
                this.setState({ seriesError: true });
                series = true;
            }
        } else {
            this.setState({ seriesLabel: "Введите номер паспорта" });
            this.setState({ seriesError: true });
            series = true;
        }

        if (this.state.number !== "") {
            if (this.state.number.length !== 7) {
                this.setState({ numberLabel: "Введите номер паспорта полностью" });
                this.setState({ numberError: true });
                number = true;
            }
        } else {
            this.setState({ numberLabel: "Введите номер паспорта" });
            this.setState({ numberError: true });
            number = true;
        }

        if (this.state.dateOfBirth !== "") {
            if (this.state.dateOfBirth.length < 10) {
                this.setState({ dateOfBirthLabel: "Введите дату рождения полностью" });
                this.setState({ dateOfBirthError: true });
                dateOfBirth = true;
            } else {
                const day = +this.state.dateOfBirth.substring(0, 2);
                const month = +this.state.dateOfBirth.substring(3, 5);
                const year = +this.state.dateOfBirth.substring(6, 10);

                if (this.checkData(day, month, year)) {
                    this.setState({ dateOfBirthLabel: "Введите дату рождения корректно" });
                    this.setState({ dateOfBirthError: true });
                    dateOfBirth = true;
                }
            }
        } else {
            this.setState({ dateOfBirthLabel: "Введите дату рождения" });
            this.setState({ dateOfBirthError: true });
            dateOfBirth = true;
        }

        if (this.state.dateOfIssue !== "") {
            if (this.state.dateOfIssue.length < 10) {
                this.setState({ dateOfIssueLabel: "Введите дату выдачи паспорта полностью" });
                this.setState({ dateOfIssueError: true });
                dateOfIssue = true;
            } else {
                const day = +this.state.dateOfIssue.substring(0, 2);
                const month = +this.state.dateOfIssue.substring(3, 5);
                const year = +this.state.dateOfIssue.substring(6, 10);

                if (this.checkData(day, month, year)) {
                    this.setState({ dateOfIssueLabel: "Введите дату выдачи паспорта корректно" });
                    this.setState({ dateOfIssueError: true });
                    dateOfIssue = true;
                }
            }
        } else {
            this.setState({ dateOfIssueLabel: "Введите дату выдачи паспорта" });
            this.setState({ dateOfIssueError: true });
            dateOfIssue = true;
        }

        if (this.state.divisionCode !== "") {
            if (this.state.divisionCode.length !== 7) {
                this.setState({ divisionCodeLabel: "Введите код подразделения полностью" });
                this.setState({ divisionCodeError: true });
                divisionCode = true;
            }
        } else {
            this.setState({ divisionCodeLabel: "Введите код подразделения" });
            this.setState({ divisionCodeError: true });
            divisionCode = true;
        }

        if (this.state.issuedBy !== "") {
            if (this.state.issuedBy.length > 250) {
                this.setState({ issuedByLabel: "Кем выдан до 250 символов" });
                this.setState({ issuedByError: true });
                issuedBy = true;
            }
        } else {
            this.setState({ issuedByLabel: "Введите кем выдан паспорт" });
            this.setState({ issuedByError: true });
            issuedBy = true;
        }

        if (this.state.city !== "") {
            if (this.state.city.length > 30) {
                this.setState({ cityLabel: "Город до 30 символов" });
                this.setState({ cityError: true });
                city = true;
            }
        } else {
            this.setState({ cityLabel: "Введите город" });
            this.setState({ cityError: true });
            city = true;
        }

        if (this.state.district !== "") {
            if (this.state.city.district > 30) {
                this.setState({ districtLabel: "Район до 30 символов" });
                this.setState({ districtError: true });
                district = true;
            }
        } else {
            this.setState({ districtLabel: "Введите район" });
            this.setState({ districtError: true });
            district = true;
        }

        if (this.state.street !== "") {
            if (this.state.street.length > 30) {
                this.setState({ streetLabel: "Улица до 30 символов" });
                this.setState({ streetError: true });
                street = true;
            }
        } else {
            this.setState({ streetLabel: "Введите улицу" });
            this.setState({ streetError: true });
            street = true;
        }

        if (this.state.house === "") {
            this.setState({ houseLabel: "Введите номер дома" });
            this.setState({ houseError: true });
            house = true;
        }

        if (this.state.numberOfFlat === "") {
            this.setState({ numberOfFlatLabel: "Введите номер квартиры" });
            this.setState({ numberOfFlatError: true });
            numberOfFlat = true;
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

        if (!series) {
            this.setState({ seriesLabel: "Серия паспорта" });
            this.setState({ seriesError: false });
        }

        if (!number) {
            this.setState({ numberLabel: "Номер паспорта" });
            this.setState({ numberError: false });
        }

        if (!dateOfBirth) {
            this.setState({ dateOfBirthLabel: "Дата рождения" });
            this.setState({ dateOfBirthError: false });
        }

        if (!dateOfIssue) {
            this.setState({ dateOfIssueLabel: "Дата выдачи паспорта" });
            this.setState({ dateOfIssueError: false });
        }

        if (!divisionCode) {
            this.setState({ divisionCodeLabel: "Код подразделения" });
            this.setState({ divisionCodeError: false });
        }

        if (!issuedBy) {
            this.setState({ issuedByLabel: "Паспорт выдан" });
            this.setState({ issuedByError: false });
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

        if (!dateOfBirth && !dateOfIssue) {
            if (!this.dateLess(this.state.dateOfBirth, this.state.dateOfIssue)) {
                this.setState({ dateOfIssueLabel: "Дата выдачи паспорта раньше или равна дате рождения" });
                this.setState({ dateOfIssueError: true });
                dateOfIssue = true;
            }
        }

        return (surname || name || patronymic || series || number || dateOfBirth || dateOfIssue || divisionCode || issuedBy || city || district || street || house || numberOfFlat);
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
            series: '',
            number: '',
            dateOfBirth: '',
            dateOfIssue: '',
            divisionCode: '',
            issuedBy: '',
            city: '',
            district: '',
            street: '',
            house: '',
            numberOfFlat: '',
            surnameError: false,
            nameError: false,
            patronymicError: false,
            seriesError: false,
            numberError: false,
            dateOfBirthError: false,
            dateOfIssueError: false,
            divisionCodeError: false,
            issuedByError: false,
            cityError: false,
            districtError: false,
            streetError: false,
            houseError: false,
            numberOfFlatError: false,
            surnameLabel: "Фамилия",
            nameLabel: "Имя",
            patronymicLabel: "Отчество",
            seriesLabel: "Серия паспорта",
            numberLabel: "Номер паспорта",
            dateOfBirthLabel: "Дата рождения",
            dateOfIssueLabel: "Дата выдачи паспорта",
            divisionCodeLabel: "Код подразделения",
            issuedByLabel: "Паспорт выдан",
            cityLabel: "Город",
            districtLabel: "Район",
            streetLabel: "Улица",
            houseLabel: "Номер дома",
            numberOfFlatLabel: "Номер квартиры"
        });

        this.props.onCancelAction();
    }

    render() {
        const { showDialog, editClient } = this.props;

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
                    {editClient !== undefined && editClient.id !== undefined ? "Изменить клиента" : "Добавить клиента"}
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
                            id="series"
                            label={this.state.seriesLabel}
                            value={this.state.series}
                            onChange={this.handleChange}
                            error={this.state.seriesError}
                            InputProps={{
                                inputComponent: SeriesMask
                            }}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="number"
                            label={this.state.numberLabel}
                            value={this.state.number}
                            onChange={this.handleChange}
                            error={this.state.numberError}
                            InputProps={{
                                inputComponent: NumberMask
                            }}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="dateOfBirth"
                            label={this.state.dateOfBirthLabel}
                            value={this.state.dateOfBirth}
                            onChange={this.handleChange}
                            error={this.state.dateOfBirthError}
                            InputProps={{
                                inputComponent: DateMask
                            }}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="dateOfIssue"
                            label={this.state.dateOfIssueLabel}
                            value={this.state.dateOfIssue}
                            onChange={this.handleChange}
                            error={this.state.dateOfIssueError}
                            InputProps={{
                                inputComponent: DateMask
                            }}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="divisionCode"
                            label={this.state.divisionCodeLabel}
                            value={this.state.divisionCode}
                            onChange={this.handleChange}
                            error={this.state.divisionCodeError}
                            InputProps={{
                                inputComponent: DivisionMask
                            }}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="issuedBy"
                            label={this.state.issuedByLabel}
                            value={this.state.issuedBy}
                            onChange={this.handleChange}
                            error={this.state.issuedByError}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="city"
                            label={this.state.cityLabel}
                            value={this.state.city}
                            onChange={this.handleChange}
                            error={this.state.cityError}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="district"
                            label={this.state.districtLabel}
                            value={this.state.district}
                            onChange={this.handleChange}
                            error={this.state.districtError}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="street"
                            label={this.state.streetLabel}
                            value={this.state.street}
                            onChange={this.handleChange}
                            error={this.state.streetError}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="house"
                            label={this.state.houseLabel}
                            value={this.state.house}
                            onChange={this.handleChange}
                            error={this.state.houseError}
                            InputProps={{
                                inputComponent: HouseMask
                            }}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="numberOfFlat"
                            label={this.state.numberOfFlatLabel}
                            value={this.state.numberOfFlat}
                            onChange={this.handleChange}
                            error={this.state.numberOfFlatError}
                            InputProps={{
                                inputComponent: FlatMask
                            }}
                            fullWidth
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.myHandleClose} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={this.submitHandler} color="secondary">
                        {editClient !== undefined && editClient.id !== undefined ? "Изменить" : "Сохранить"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AddClientDialog;