import React from 'react';
import MaskedInput from 'react-text-mask';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField
} from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

function InnMask(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
            placeholderChar={'\u2000'}
            keepCharPositions={true}
            guide={false}
            showMask
        />
    );
}

function BinMask(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
            placeholderChar={'\u2000'}
            keepCharPositions={true}
            guide={false}
            showMask
        />
    );
}

function AccountMask(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
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

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

class AddEntityDialog extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.myHandleClose = this.myHandleClose.bind(this);
        this.state = {
            companyName: '',
            bin: '',
            inn: '',
            mailAddress: '',
            paymentAccount: '',
            city: '',
            district: '',
            street: '',
            house: '',
            numberOfFlat: '',
            companyNameError: false,
            binError: false,
            innError: false,
            mailAddressError: false,
            paymentAccountError: false,
            cityError: false,
            districtError: false,
            streetError: false,
            houseError: false,
            numberOfFlatError: false,
            companyNameLabel: "Название компании",
            binLabel: "ОГРН",
            innLabel: "ИНН",
            mailAddressLabel: "Адрес почты",
            paymentAccountLabel: "Расчётный счёт",
            cityLabel: "Город",
            districtLabel: "Район",
            streetLabel: "Улица",
            houseLabel: "Номер дома",
            numberOfFlatLabel: "Номер квартиры"
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editEntity !== undefined && nextProps.editEntity.companyName !== undefined && (this.state.companyName !== nextProps.editEntity.companyName || this.state.mailAddress !== nextProps.editEntity.mailAddress)) {
            this.setState({
                companyName: nextProps.editEntity.companyName,
                bin: nextProps.editEntity.bin.toString(),
                inn: nextProps.editEntity.inn.toString(),
                mailAddress: nextProps.editEntity.mailAddress,
                paymentAccount: nextProps.editEntity.paymentAccount.toString(),
                city: nextProps.editEntity.city,
                district: nextProps.editEntity.district,
                street: nextProps.editEntity.street,
                house: nextProps.editEntity.house,
                numberOfFlat: nextProps.editEntity.numberOfFlat,
            });
        }
    }

    submitHandler(evt) {
        evt.preventDefault();
        // pass the input field value to the event handler passed
        // as a prop by the parent (App)

        if (!this.validateForm()) {
            if (this.props.editEntity === undefined || this.props.editEntity.id === undefined) {
                const resultObject = {
                    companyName: this.state.companyName, bin: this.state.bin, inn: this.state.inn,
                    mailAddress: this.state.mailAddress, paymentAccount: this.state.paymentAccount,
                    city: this.state.city, district: this.state.district, street: this.state.street,
                    house: this.state.house, numberOfFlat: this.state.numberOfFlat
                }

                this.props.onAddAction(resultObject);
            } else {
                const resultObject2 = {
                    id: this.props.editEntity.id, legalAddressId: this.props.editEntity.legalAddressId,
                    companyName: this.state.companyName, bin: this.state.bin, inn: this.state.inn,
                    mailAddress: this.state.mailAddress, paymentAccount: this.state.paymentAccount,
                    city: this.state.city, district: this.state.district, street: this.state.street,
                    house: this.state.house, numberOfFlat: this.state.numberOfFlat
                }

                this.props.onEditAction(resultObject2);
            }

            this.setState({
                companyName: '',
                bin: '',
                inn: '',
                mailAddress: '',
                paymentAccount: '',
                city: '',
                district: '',
                street: '',
                house: '',
                numberOfFlat: '',
                companyNameError: false,
                binError: false,
                innError: false,
                mailAddressError: false,
                paymentAccountError: false,
                cityError: false,
                districtError: false,
                streetError: false,
                houseError: false,
                numberOfFlatError: false,
                companyNameLabel: "Название компании",
                binLabel: "ОГРН",
                innLabel: "ИНН",
                mailAddressLabel: "Адрес почты",
                paymentAccountLabel: "Расчётный счёт",
                cityLabel: "Город",
                districtLabel: "Район",
                streetLabel: "Улица",
                houseLabel: "Номер дома",
                numberOfFlatLabel: "Номер квартиры"
            });
        }
    }

    validateForm() {
        let companyName = false, bin = false, inn = false, mailAddress = false, paymentAccount = false, city = false, district = false, street = false, house = false, numberOfFlat = false;

        if (this.state.companyName !== "") {
            if (this.state.companyName.length > 30) {
                this.setState({ companyNameLabel: "Название компании до 30 символов" });
                this.setState({ companyNameError: true });
                companyName = true;
            }
        } else {
            this.setState({ companyNameLabel: "Введите название компании"});
            this.setState({ companyNameError: true });
            companyName = true;
        }

        if (this.state.bin !== "") {
            if (this.state.bin.length !== 13) {
                this.setState({ binLabel: "Введите ОГРН полностью" });
                this.setState({ binError: true });
                bin = true;
            }
        } else {
            this.setState({ binLabel: "Введите ОГРН" });
            this.setState({ binError: true });
            bin = true;
        }

        if (this.state.inn !== "") {
            if (this.state.inn.length !== 12) {
                this.setState({ innLabel: "Введите ИНН полностью" });
                this.setState({ innError: true });
                inn = true;
            }
        } else {
            this.setState({ innLabel: "Введите ИНН" });
            this.setState({ innError: true });
            inn = true;
        }

        if (this.state.mailAddress !== "") {
            if (!validateEmail(this.state.mailAddress)) {
                this.setState({ mailAddressLabel: "Введите корректный почтовый адрес" });
                this.setState({ mailAddressError: true });
                mailAddress = true;
            }
        } else {
            this.setState({ mailAddressLabel: "Введите почтовый адрес" });
            this.setState({ mailAddressError: true });
            mailAddress = true;
        }

        if (this.state.paymentAccount !== "") {
            if (this.state.paymentAccount.length !== 20) {
                this.setState({ paymentAccountLabel: "Введите расчётный счёт полностью" });
                this.setState({ paymentAccountError: true });
                paymentAccount = true;
            }
        } else {
            this.setState({ paymentAccountLabel: "Введите расчётный счёт" });
            this.setState({ paymentAccountError: true });
            paymentAccount = true;
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

        if (!companyName) {
            this.setState({ companyNameLabel: "Название компании" });
            this.setState({ companyNameError: false });
        }

        if (!bin) {
            this.setState({ binLabel: "ОГРН" });
            this.setState({ binError: false });
        }

        if (!inn) {
            this.setState({ innLabel: "ИНН" });
            this.setState({ innError: false });
        }

        if (!mailAddress) {
            this.setState({ mailAddressLabel: "Почтовый адрес" });
            this.setState({ mailAddressError: false });
        }

        if (!paymentAccount) {
            this.setState({ paymentAccountLabel: "Расчётный счёт" });
            this.setState({ paymentAccountError: false });
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

        return (companyName || bin || inn || mailAddress || paymentAccount || city || district || street || house || numberOfFlat);
    }

    handleChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    myHandleClose() {
        this.setState({
            companyName: '',
            bin: '',
            inn: '',
            mailAddress: '',
            paymentAccount: '',
            city: '',
            district: '',
            street: '',
            house: '',
            numberOfFlat: '',
            companyNameError: false,
            binError: false,
            innError: false,
            mailAddressError: false,
            paymentAccountError: false,
            cityError: false,
            districtError: false,
            streetError: false,
            houseError: false,
            numberOfFlatError: false,
            companyNameLabel: "Название компании",
            binLabel: "ОГРН",
            innLabel: "ИНН",
            mailAddressLabel: "Адрес почты",
            paymentAccountLabel: "Расчётный счёт",
            cityLabel: "Город",
            districtLabel: "Район",
            streetLabel: "Улица",
            houseLabel: "Номер дома",
            numberOfFlatLabel: "Номер квартиры"
        });

        this.props.onCancelAction();
    }

    render() {
        const { showDialog, editEntity } = this.props;

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
                    {editEntity !== undefined && editEntity.id !== undefined ? "Изменить клиента" : "Добавить клиента"}
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={this.submitHandler}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="companyName"
                            label={this.state.companyNameLabel}
                            value={this.state.companyName}
                            onChange={this.handleChange}
                            error={this.state.companyNameError}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="bin"
                            label={this.state.binLabel}
                            value={this.state.bin}
                            onChange={this.handleChange}
                            error={this.state.binError}
                            InputProps={{
                                inputComponent: BinMask
                            }}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="inn"
                            label={this.state.innLabel}
                            value={this.state.inn}
                            onChange={this.handleChange}
                            error={this.state.innError}
                            InputProps={{
                                inputComponent: InnMask
                            }}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="mailAddress"
                            label={this.state.mailAddressLabel}
                            value={this.state.mailAddress}
                            onChange={this.handleChange}
                            error={this.state.mailAddressError}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="paymentAccount"
                            label={this.state.paymentAccountLabel}
                            value={this.state.paymentAccount}
                            onChange={this.handleChange}
                            error={this.state.paymentAccountError}
                            InputProps={{
                                inputComponent: AccountMask
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
                        {editEntity !== undefined && editEntity.id !== undefined ? "Изменить" : "Сохранить"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AddEntityDialog;