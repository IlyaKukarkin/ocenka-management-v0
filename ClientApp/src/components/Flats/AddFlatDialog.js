import React from 'react';
import MaskedInput from 'react-text-mask';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField, MenuItem
} from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

function CadastralNumber(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/[0-9]/, /[0-9]/, ':', /[0-9]/, /[0-9]/, ':', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ':', /[0-9]/, /[0-9]/]}
            placeholderChar={'\u2000'}
            keepCharPositions={true}
            guide={false}
            showMask
        />
    );
}

function AreaMask(props) {
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

function FloorMask(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/[0-9]/, /[0-9]/]}
            placeholderChar={'\u2000'}
            keepCharPositions={true}
            guide={false}
            showMask
        />
    );
}

function RoomsMask(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/[0-9]/]}
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

function insertInString(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

function makeCadastral(str) {
    return str.substr(0, 2) + ":" + str.substr(2, 2) + ":" + str.substr(4, 7) + ":" + str.substr(11, 2);
}

function clearCadastral(str) {
    return str.substr(0, 2) + str.substr(3, 2) + str.substr(6, 7) + str.substr(14, 2);
}

class AddFlatDialog extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.myHandleClose = this.myHandleClose.bind(this);
        this.state = {
            cadastralNumber: '',
            aimOfEvaluation: '',
            area: '',
            numberOfRooms: '',
            floor: '',
            city: '',
            district: '',
            street: '',
            house: '',
            numberOfFlat: '',
            cadastralNumberError: false,
            aimOfEvaluationError: false,
            areaError: false,
            numberOfRoomsError: false,
            floorError: false,
            cityError: false,
            districtError: false,
            streetError: false,
            houseError: false,
            numberOfFlatError: false,
            cadastralNumberLabel: "Кадастровый номер",
            aimOfEvaluationLabel: "Цель оценки",
            areaLabel: "Площадь",
            numberOfRoomsLabel: "Кол-во комнат",
            floorLabel: "Этаж",
            cityLabel: "Город",
            districtLabel: "Район",
            streetLabel: "Улица",
            houseLabel: "Номер дома",
            numberOfFlatLabel: "Номер квартиры"
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editFlat !== undefined && nextProps.editFlat.cadastralNumber !== undefined && (this.state.cadastralNumber !== nextProps.editFlat.cadastralNumber || this.state.city !== nextProps.editFlat.city || this.state.floor !== nextProps.editFlat.floor)) {
            this.setState({
                cadastralNumber: makeCadastral(nextProps.editFlat.cadastralNumber.toString()),
                aimOfEvaluation: nextProps.editFlat.aimOfEvaluation,
                area: nextProps.editFlat.area,
                numberOfRooms: nextProps.editFlat.numberOfRooms,
                floor: nextProps.editFlat.floor,
                city: nextProps.editFlat.city,
                district: nextProps.editFlat.district,
                street: nextProps.editFlat.street,
                house: nextProps.editFlat.house,
                numberOfFlat: nextProps.editFlat.numberOfFlat,
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
            if (this.props.editFlat === undefined || this.props.editFlat.id === undefined) {
                const resultObject = {
                    cadastralNumber: clearCadastral(this.state.cadastralNumber), aimOfEvaluation: this.state.aimOfEvaluation, area: this.state.area,
                    numberOfRooms: this.state.numberOfRooms, floor: this.state.floor,
                    city: this.state.city, district: this.state.district, street: this.state.street, house: this.state.house, numberOfFlat: this.state.numberOfFlat
                }

                this.props.onAddAction(resultObject);
            } else {
                const resultObject2 = {
                    id: this.props.editFlat.id,
                    cadastralNumber: clearCadastral(this.state.cadastralNumber), aimOfEvaluation: this.state.aimOfEvaluation, area: this.state.area,
                    numberOfRooms: this.state.numberOfRooms, floor: this.state.floor,
                    city: this.state.city, district: this.state.district, street: this.state.street, house: this.state.house, numberOfFlat: this.state.numberOfFlat,
                    addressId: this.props.editFlat.addressId
                }

                this.props.onEditAction(resultObject2);
            }

            this.setState({
                cadastralNumber: '',
                aimOfEvaluation: '',
                area: '',
                numberOfRooms: '',
                floor: '',
                city: '',
                district: '',
                street: '',
                house: '',
                numberOfFlat: '',
                cadastralNumberError: false,
                aimOfEvaluationError: false,
                areaError: false,
                numberOfRoomsError: false,
                floorError: false,
                cityError: false,
                districtError: false,
                streetError: false,
                houseError: false,
                numberOfFlatError: false,
                cadastralNumberLabel: "Кадастровый номер",
                aimOfEvaluationLabel: "Цель оценки",
                areaLabel: "Площадь",
                numberOfRoomsLabel: "Кол-во комнат",
                floorLabel: "Этаж",
                cityLabel: "Город",
                districtLabel: "Район",
                streetLabel: "Улица",
                houseLabel: "Номер дома",
                numberOfFlatLabel: "Номер квартиры"
            });
        }
    }

    validateForm() {
        let cadastralNumber = false, aimOfEvaluation = false, area = false, numberOfRooms = false, floor = false, city = false, district = false, street = false, house = false, numberOfFlat = false;

        if (this.state.cadastralNumber !== "") {
            if (this.state.cadastralNumber.length !== 16) {
                this.setState({ cadastralNumberLabel: "Введите кадастровый номер полностью" });
                this.setState({ cadastralNumberError: true });
                cadastralNumber = true;
            }
        } else {
            this.setState({ cadastralNumberLabel: "Введите кадастровый номер"});
            this.setState({ cadastralNumberError: true });
            cadastralNumber = true;
        }

        if (this.state.aimOfEvaluation === "") {
            this.setState({ aimOfEvaluationLabel: "Выберете цель оценки" });
            this.setState({ aimOfEvaluationError: true });
            aimOfEvaluation = true;
        }

        if (this.state.area === "") {
            this.setState({ areaLabel: "Введите площадь" });
            this.setState({ areaError: true });
            area = true;
        }

        if (this.state.numberOfRooms === "") {
            this.setState({ numberOfRoomsLabel: "Введите кол-во комнат" });
            this.setState({ numberOfRoomsError: true });
            numberOfRooms = true;
        }

        if (this.state.floor === "") {
            this.setState({ floorLabel: "Введите этаж" });
            this.setState({ floorError: true });
            floor = true;
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

        if (!cadastralNumber) {
            this.setState({ cadastralNumberLabel: "Кадастровый номер" });
            this.setState({ cadastralNumberError: false });
        }

        if (!aimOfEvaluation) {
            this.setState({ aimOfEvaluationLabel: "Цель оценки" });
            this.setState({ aimOfEvaluationError: false });
        }

        if (!area) {
            this.setState({ areaLabel: "Площадь" });
            this.setState({ areaError: false });
        }

        if (!numberOfRooms) {
            this.setState({ numberOfRoomsLabel: "Кол-во комнат" });
            this.setState({ numberOfRoomsError: false });
        }

        if (!floor) {
            this.setState({ floorLabel: "Этаж" });
            this.setState({ floorError: false });
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

        return (cadastralNumber || aimOfEvaluation || area || numberOfRooms || floor || city || district || street || house || numberOfFlat);
    }

    handleChange(event) {
        if (event.target.id === undefined) {
            this.setState({ aimOfEvaluation: event.target.value });
        } else {
            this.setState({
                [event.target.id]: event.target.value
            });
        }
    }

    myHandleClose() {
        this.setState({
            cadastralNumber: '',
            aimOfEvaluation: '',
            area: '',
            numberOfRooms: '',
            floor: '',
            city: '',
            district: '',
            street: '',
            house: '',
            numberOfFlat: '',
            cadastralNumberError: false,
            aimOfEvaluationError: false,
            areaError: false,
            numberOfRoomsError: false,
            floorError: false,
            cityError: false,
            districtError: false,
            streetError: false,
            houseError: false,
            numberOfFlatError: false,
            cadastralNumberLabel: "Кадастровый номер",
            aimOfEvaluationLabel: "Цель оценки",
            areaLabel: "Площадь",
            numberOfRoomsLabel: "Кол-во комнат",
            floorLabel: "Этаж",
            cityLabel: "Город",
            districtLabel: "Район",
            streetLabel: "Улица",
            houseLabel: "Номер дома",
            numberOfFlatLabel: "Номер квартиры"
        });

        this.props.onCancelAction();
    }

    render() {
        const { showDialog, editFlat } = this.props;

        const aims = [{ value: 'Банк', label: 'Банк' }, { value: 'Наследство', label: 'Наследство' }, { value: 'Суд', label: 'Суд' }];

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
                    {editFlat !== undefined && editFlat.id !== undefined ? "Изменить квартиру" : "Добавить квартиру"}
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={this.submitHandler}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="cadastralNumber"
                            label={this.state.cadastralNumberLabel}
                            value={this.state.cadastralNumber}
                            onChange={this.handleChange}
                            error={this.state.cadastralNumberError}
                            InputProps={{
                                inputComponent: CadastralNumber
                            }}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            select
                            margin="dense"
                            id="aimOfEvaluation"
                            label={this.state.aimOfEvaluationLabel}
                            value={this.state.aimOfEvaluation}
                            onChange={this.handleChange}
                            error={this.state.aimOfEvaluationError}
                            fullWidth
                        >
                            {aims.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="area"
                            label={this.state.areaLabel}
                            value={this.state.area}
                            onChange={this.handleChange}
                            error={this.state.areaError}
                            InputProps={{
                                inputComponent: AreaMask
                            }}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="numberOfRooms"
                            label={this.state.numberOfRoomsLabel}
                            value={this.state.numberOfRooms}
                            onChange={this.handleChange}
                            error={this.state.numberOfRoomsError}
                            InputProps={{
                                inputComponent: RoomsMask
                            }}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="floor"
                            label={this.state.floorLabel}
                            value={this.state.floor}
                            onChange={this.handleChange}
                            error={this.state.floorError}
                            InputProps={{
                                inputComponent: FloorMask
                            }}
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
                        {editFlat !== undefined && editFlat.id !== undefined ? "Изменить" : "Сохранить"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AddFlatDialog;