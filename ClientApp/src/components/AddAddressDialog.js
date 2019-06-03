import React from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField
} from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AddAddressDialog extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.myHandleClose = this.myHandleClose.bind(this);
        this.state = {
            city: '',
            district: '',
            street: '',
            house: '',
            numberOfFlat: '',
            cityError: false,
            districtError: false,
            streetError: false,
            houseError: false,
            numberOfFlatError: false,
            cityLabel: "Город",
            districtLabel: "Район",
            streetLabel: "Улица",
            houseLabel: "Номер дома",
            numberOfFlatLabel: "Номер квартиры"
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editAddress !== undefined && nextProps.editAddress.city !== undefined && (this.state.city !== nextProps.editAddress.city)) {
            this.setState({
                city: nextProps.editAddress.city,
                district: nextProps.editAddress.district,
                street: nextProps.editAddress.street,
                house: nextProps.editAddress.house,
                numberOfFlat: nextProps.editAddress.numberOfFlat
            });
        }
    }

    submitHandler(evt) {
        evt.preventDefault();
        // pass the input field value to the event handler passed
        // as a prop by the parent (App)

        if (!this.validateForm()) {
            if (this.props.editAddress.id === undefined) {
                const resultObject = { city: this.state.city, district: this.state.district, street: this.state.street, house: this.state.house, numberOfFlat: this.state.numberOfFlat }

                this.props.onAddAction(resultObject);
            } else {
                const resultObject2 = { id: this.props.editAddress.id, city: this.state.city, district: this.state.district, street: this.state.street, house: this.state.house, numberOfFlat: this.state.numberOfFlat }

                this.props.onEditAction(resultObject2);
            }

            this.setState({
                city: '',
                district: '',
                street: '',
                house: '',
                numberOfFlat: '',
                cityError: false,
                districtError: false,
                streetError: false,
                houseError: false,
                numberOfFlatError: false,
                cityLabel: "Город",
                districtLabel: "Район",
                streetLabel: "Улица",
                houseLabel: "Номер дома",
                numberOfFlatLabel: "Номер квартиры"
            });
        }
    }

    validateForm() {
        let city = false, district = false, street = false, house = false, numberOfFlat = false;

        if (this.state.city !== "") {
            if (this.state.city.length > 30) {
                this.setState({ cityLabel: "Город до 30 символов" });
                this.setState({ cityError: true });
                city = true;
            }
        } else {
            this.setState({ cityLabel: "Введите город"});
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

        if (this.state.house !== "") {
            if (this.state.house > 250 || this.state.house < 1 || !Number.isInteger(+this.state.house)) {
                this.setState({ houseLabel: "Номер дома - целое число от 1 до 250" });
                this.setState({ houseError: true });
                house = true;
            }
        } else {
            this.setState({ houseLabel: "Введите номер дома" });
            this.setState({ houseError: true });
            house = true;
        }

        if (this.state.numberOfFlat !== "") {
            if (this.state.numberOfFlat > 1000 || this.state.numberOfFlat < 1 || !Number.isInteger(+this.state.numberOfFlat)) {
                this.setState({ numberOfFlatLabel: "Номер квартиры - целое число от 1 до 1000" });
                this.setState({ numberOfFlatError: true });
                numberOfFlat = true;
            }
        } else {
            this.setState({ numberOfFlatLabel: "Введите номер квартиры" });
            this.setState({ numberOfFlatError: true });
            numberOfFlat = true;
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
            city: '',
            district: '',
            street: '',
            house: '',
            numberOfFlat: '',
            cityError: false,
            districtError: false,
            streetError: false,
            houseError: false,
            numberOfFlatError: false,
            cityLabel: "Город",
            districtLabel: "Район",
            streetLabel: "Улица",
            houseLabel: "Номер дома",
            numberOfFlatLabel: "Номер квартиры"
        });

        this.props.onCancelAction();
    }

    render() {
        const { showDialog, editAddress } = this.props;

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
                    {editAddress.id !== undefined ? "Изменить адрес" : "Добавить адрес"}
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={this.submitHandler}>
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
                            type="number"
                            InputProps={{ inputProps: { min: 1, max: 250 } }}
                            value={this.state.house}
                            onChange={this.handleChange}
                            error={this.state.houseError}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="numberOfFlat"
                            label={this.state.numberOfFlatLabel}
                            type="number"
                            InputProps={{ inputProps: { min: 1, max: 1000 } }}
                            value={this.state.numberOfFlat}
                            onChange={this.handleChange}
                            error={this.state.numberOfFlatError}
                            fullWidth
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.myHandleClose} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={this.submitHandler} color="secondary">
                        {editAddress.id !== undefined ? "Изменить" : "Сохранить"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AddAddressDialog;