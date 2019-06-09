import React from 'react';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField, MenuItem, CircularProgress, Grid
} from '@material-ui/core';

const styles = theme => ({
    progress: {
        margin: theme.spacing.unit * 2
    },
    loading: {
        height: '400px',
        marginUp: '180px',
        minWidth: '550px'
    }
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const numberMask = createNumberMask({
    prefix: '',
    suffix: ' ₽',
    integerLimit: '10000000',
    allowDecimal: true
});

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

function MoneyMask(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={numberMask}
            placeholderChar={'\u2000'}
            keepCharPositions={true}
            guide={false}
            showMask
        />
    );
}

class AddContractDialog extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleAppraiserChange = this.handleAppraiserChange.bind(this);
        this.handleClientTypeChange = this.handleClientTypeChange.bind(this);
        this.handleClientChange = this.handleClientChange.bind(this);
        this.handleObjectTypeChange = this.handleObjectTypeChange.bind(this);
        this.handleObjectChange = this.handleObjectChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.myHandleClose = this.myHandleClose.bind(this);
        this.state = {
            contractSumm: '',
            prepaid: '',
            startDate: '',
            finishDate: '',
            clientType: '',
            objectType: '',
            appraiserId: '',
            clientId: '',
            objectId: '',
            contractSummError: false,
            prepaidError: false,
            startDateError: false,
            finishDateError: false,
            clientTypeError: false,
            objectTypeError: false,
            appraiserIdError: false,
            clientIdError: false,
            objectIdError: false,
            contractSummLabel: "Сумма договора",
            prepaidLabel: "Аванс",
            startDateLabel: "Дата начала",
            finishDateLabel: "Дата окончания",
            clientTypeLabel: "Тип клиента",
            objectTypeLabel: "Тип объекта оценки",
            appraiserIdLabel: "Оценщик",
            clientIdLabel: "Клиент",
            objectIdLabel: "Объект оценки",
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editContract !== undefined && nextProps.editContract.contractSumm !== undefined && (this.state.contractSumm !== nextProps.editContract.contractSumm || this.state.objectType !== nextProps.editContract.objectType || this.state.clientType !== nextProps.editContract.clientType)) {
            this.setState({
                contractSumm: nextProps.editContract.contractSumm.toString(),
                prepaid: nextProps.editContract.prepaid.toString(),
                startDate: this.convertData(nextProps.editContract.startDate),
                finishDate: this.convertData(nextProps.editContract.finishDate),
                clientType: nextProps.editContract.clientType,
                objectType: nextProps.editContract.objectType,
                appraiserId: nextProps.editContract.appraiserId,
                clientId: nextProps.editContract.clientId,
                objectId: nextProps.editContract.objectId,
                numberOfFlat: nextProps.editContract.numberOfFlat,
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
            if (this.props.editContract === undefined || this.props.editContract.id === undefined) {
                const resultObject = {
                    contractSumm: this.clearMoney(this.state.contractSumm), prepaid: this.clearMoney(this.state.prepaid), startDate: this.replaceDayAndMonth(this.state.startDate), finishDate: this.replaceDayAndMonth(this.state.finishDate),
                    clientType: this.state.clientType, objectType: this.state.objectType, appraiserId: this.state.appraiserId, clientId: this.state.clientId, objectId: this.state.objectId,
                    number: 1, stage: 'Создан'
                }

                this.props.onAddAction(resultObject);
            } else {
                const resultObject2 = {
                    id: this.props.editContract.id,
                    contractSumm: this.clearMoney(this.state.contractSumm), prepaid: this.clearMoney(this.state.prepaid), startDate: this.replaceDayAndMonth(this.state.startDate), finishDate: this.replaceDayAndMonth(this.state.finishDate),
                    clientType: this.state.clientType, objectType: this.state.objectType, appraiserId: this.state.appraiserId, clientId: this.state.clientId, objectId: this.state.objectId,
                    number: 1, stage: 'Создан'
                }

                this.props.onEditAction(resultObject2);
            }

            this.setState({
                contractSumm: '',
                prepaid: '',
                startDate: '',
                finishDate: '',
                clientType: '',
                objectType: '',
                appraiserId: '',
                clientId: '',
                objectId: '',
                contractSummError: false,
                prepaidError: false,
                startDateError: false,
                finishDateError: false,
                clientTypeError: false,
                objectTypeError: false,
                appraiserIdError: false,
                clientIdError: false,
                objectIdError: false,
                contractSummLabel: "Сумма договора",
                prepaidLabel: "Аванс",
                startDateLabel: "Дата начала",
                finishDateLabel: "Дата окончания",
                clientTypeLabel: "Тип клиента",
                objectTypeLabel: "Тип объекта оценки",
                appraiserIdLabel: "Оценщик",
                clientIdLabel: "Клиент",
                objectIdLabel: "Объект оценки",
            });
        }
    }

    checkData(day, month, year) {
        if ((day < 1) || (day > 31) || (month < 1) || (month > 12)) {
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

    checkDataToday(day, month, year) {
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();

        if ((year < yyyy) && (month < mm) && (day < dd)) {
            return true;
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

    clearMoney(money) {
        if (money.includes('₽')) {
            return money.substring(0, money.length - 2).replace(/,/g, "");
        }

        return money;
    }

    validateForm() {
        let contractSumm = false, prepaid = false, startDate = false, finishDate = false, clientType = false, objectType = false, appraiserId = false, clientId = false, objectId = false;

        if (this.state.contractSumm !== "") {
            let summNumber = this.clearMoney(this.state.contractSumm);

            if (summNumber.includes('.')) {
                if (summNumber.length > 8) {
                    this.setState({ contractSummLabel: "Сумма слишком большая" });
                    this.setState({ contractSummError: true });
                    contractSumm = true;
                }
            } else {
                if (summNumber.length > 5) {
                    this.setState({ contractSummLabel: "Сумма слишком большая" });
                    this.setState({ contractSummError: true });
                    contractSumm = true;
                }
            }
        } else {
            this.setState({ contractSummLabel: "Введите сумму договора"});
            this.setState({ contractSummError: true });
            contractSumm = true;
        }

        if (this.state.prepaid !== "") {
            let prepaidNumber = this.clearMoney(this.state.prepaid);

            if (prepaidNumber.includes('.')) {
                if (prepaidNumber.length > 8) {
                    this.setState({ prepaidLabel: "Аванс слишком большой" });
                    this.setState({ prepaidError: true });
                    prepaid = true;
                }
            } else {
                if (prepaidNumber.length > 5) {
                    this.setState({ prepaidLabel: "Аванс слишком большой" });
                    this.setState({ prepaidError: true });
                    prepaid = true;
                }
            }
        } else {
            this.setState({ prepaidLabel: "Введите аванс" });
            this.setState({ prepaidError: true });
            prepaid = true;
        }

        if (this.state.startDate !== "") {
            if (this.state.startDate.length < 10) {
                this.setState({ startDateLabel: "Введите дату начала полностью" });
                this.setState({ startDateError: true });
                startDate = true;
            } else {
                const day = +this.state.startDate.substring(0, 2);
                const month = +this.state.startDate.substring(3, 5);
                const year = +this.state.startDate.substring(6, 10);

                if (this.checkData(day, month, year)) {
                    this.setState({ startDateLabel: "Введите дату начала корректно" });
                    this.setState({ startDateError: true });
                    startDate = true;
                } else {
                    if (this.checkDataToday(day, month, year)) {
                        this.setState({ startDateLabel: "Дата начала должна быть сегодня или в будущем" });
                        this.setState({ startDateError: true });
                        startDate = true;
                    }
                }
            }
        } else {
            this.setState({ startDateLabel: "Введите дату начала" });
            this.setState({ startDateError: true });
            startDate = true;
        }

        if (this.state.finishDate !== "") {
            if (this.state.finishDate.length < 10) {
                this.setState({ startDafinishDateLabelteLabel: "Введите дату окончания полностью" });
                this.setState({ finishDateError: true });
                finishDate = true;
            } else {
                const day = +this.state.finishDate.substring(0, 2);
                const month = +this.state.finishDate.substring(3, 5);
                const year = +this.state.finishDate.substring(6, 10);

                if (this.checkData(day, month, year)) {
                    this.setState({ finishDateLabel: "Введите дату окончания корректно" });
                    this.setState({ finishDateError: true });
                    finishDate = true;
                } else {
                    if (this.checkDataToday(day, month, year)) {
                        this.setState({ finishDateLabel: "Дата окончания должна быть сегодня или в будущем" });
                        this.setState({ finishDateError: true });
                        finishDate = true;
                    }
                }
            }
        } else {
            this.setState({ finishDateLabel: "Введите дату окончания" });
            this.setState({ finishDateError: true });
            finishDate = true;
        }

        if (this.state.clientType === "") {
            this.setState({ clientTypeLabel: "Выберите тип клиента" });
            this.setState({ clientTypeError: true });
            clientType = true;
        }

        if (this.state.objectType === "") {
            this.setState({ objectTypeLabel: "Введите тип объекта оценки" });
            this.setState({ objectTypeError: true });
            objectType = true;
        }

        if (this.state.appraiserId !== "") {
            if (this.state.appraiserId === 'Empty') {
                this.setState({ appraiserIdLabel: "Добавтье оценщика в базу данных" });
                this.setState({ appraiserIdError: true });
                appraiserId = true;
            }
        } else {
            this.setState({ appraiserIdLabel: "Выберете оценщика" });
            this.setState({ appraiserIdError: true });
            appraiserId = true;
        }

        if (this.state.clientId !== "") {
            if (this.state.clientId === 'Empty') {
                this.setState({ clientIdLabel: "Выберете другой тип клиента" });
                this.setState({ clientIdError: true });
                clientId = true;
            }
        } else {
            this.setState({ clientIdLabel: "Выберете клиента" });
            this.setState({ clientIdError: true });
            clientId = true;
        }

        if (this.state.objectId !== "") {
            if (this.state.objectId === 'Empty') {
                this.setState({ objectIdLabel: "Выберете другой объект оценки" });
                this.setState({ objectIdError: true });
                objectId = true;
            }
        } else {
            this.setState({ objectIdLabel: "Выберете объект оценки" });
            this.setState({ objectIdError: true });
            objectId = true;
        }

        if (!contractSumm) {
            this.setState({ contractSummLabel: "Сумма договора" });
            this.setState({ contractSummError: false });
        }

        if (!prepaid) {
            this.setState({ prepaidLabel: "Аванс" });
            this.setState({ prepaidError: false });
        }

        if (!startDate) {
            this.setState({ startDateLabel: "Дата начала" });
            this.setState({ startDateError: false });
        }

        if (!finishDate) {
            this.setState({ finishDateLabel: "Дата окончания" });
            this.setState({ finishDateError: false });
        }

        if (!clientType) {
            this.setState({ clientTypeLabel: "Тип клиента" });
            this.setState({ clientTypeError: false });
        }

        if (!objectType) {
            this.setState({ objectTypeLabel: "Тип объекта оценки" });
            this.setState({ objectTypeError: false });
        }

        if (!appraiserId) {
            this.setState({ appraiserIdLabel: "Оценщик" });
            this.setState({ appraiserIdError: false });
        }

        if (!clientId) {
            this.setState({ clientIdLabel: "Клиент" });
            this.setState({ clientIdError: false });
        }

        if (!objectId) {
            this.setState({ objectIdLabel: "Объект оценки" });
            this.setState({ objectIdError: false });
        }

        if (!startDate && !finishDate) {
            if (!this.dateLess(this.state.startDate, this.state.finishDate)) {
                this.setState({ finishDateLabel: "Дата окончания работы раньше или равна дате начала" });
                this.setState({ finishDateError: true });
                finishDate = true;
            }
        }

        return (contractSumm || prepaid || startDate || finishDate || clientType || objectType || appraiserId || clientId || objectId);
    }

    handleChange(event) {
        if (event.target.id === undefined) {
            this.setState({ prepaid: event.target.value });
        } else {
            this.setState({
                [event.target.id]: event.target.value
            });
        }
    }

    handleAppraiserChange(event) {
        this.setState({ appraiserId: event.target.value });
    }

    handleClientTypeChange(event) {
        this.setState({ clientType: event.target.value, clientId: '' });
    }

    handleClientChange(event) {
        this.setState({ clientId: event.target.value });
    }

    handleObjectTypeChange(event) {
        this.setState({ objectType: event.target.value, objectId: '' });
    }

    handleObjectChange(event) {
        this.setState({ objectId: event.target.value });
    }

    myHandleClose() {
        this.setState({
            contractSumm: '',
            prepaid: '',
            startDate: '',
            finishDate: '',
            clientType: '',
            objectType: '',
            appraiserId: '',
            clientId: '',
            objectId: '',
            contractSummError: false,
            prepaidError: false,
            startDateError: false,
            finishDateError: false,
            clientTypeError: false,
            objectTypeError: false,
            appraiserIdError: false,
            clientIdError: false,
            objectIdError: false,
            contractSummLabel: "Сумма договора",
            prepaidLabel: "Аванс",
            startDateLabel: "Дата начала",
            finishDateLabel: "Дата окончания",
            clientTypeLabel: "Тип клиента",
            objectTypeLabel: "Тип объекта оценки",
            appraiserIdLabel: "Оценщик",
            clientIdLabel: "Клиент",
            objectIdLabel: "Объект оценки",
        });

        this.props.onCancelAction();
    }

    render() {
        const { classes, showDialog, editContract, isLoading, indivList, entList, flatList, carList, parcelList, apprList } = this.props;
        const { clientType, objectType } = this.state;

        const client = [{ value: 'Indiv', label: 'Физ. Лицо' }, { value: 'Ent', label: 'Юр. Лицо' }];
        const object = [{ value: 'Flat', label: 'Квартира' }, { value: 'Parcel', label: 'Участок' }, { value: 'Car', label: 'Автомобиль' }];

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
                    {editContract !== undefined && editContract.id !== undefined ? "Изменить договор" : "Добавить договор"}
                </DialogTitle>
                <DialogContent>
                    {isLoading ? <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        className={classes.loading}
                    >
                        <CircularProgress className={classes.progress} />
                    </Grid> :
                        <form onSubmit={this.submitHandler}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="contractSumm"
                                label={this.state.contractSummLabel}
                                value={this.state.contractSumm}
                                onChange={this.handleChange}
                                error={this.state.contractSummError}
                                InputProps={{
                                    inputComponent: MoneyMask
                                }}
                                fullWidth
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="prepaid"
                                label={this.state.prepaidLabel}
                                value={this.state.prepaid}
                                onChange={this.handleChange}
                                error={this.state.prepaidError}
                                InputProps={{
                                    inputComponent: MoneyMask
                                }}
                                fullWidth
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="startDate"
                                label={this.state.startDateLabel}
                                value={this.state.startDate}
                                onChange={this.handleChange}
                                error={this.state.startDateError}
                                InputProps={{
                                    inputComponent: DateMask
                                }}
                                fullWidth
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="finishDate"
                                label={this.state.finishDateLabel}
                                value={this.state.finishDate}
                                onChange={this.handleChange}
                                error={this.state.finishDateError}
                                InputProps={{
                                    inputComponent: DateMask
                                }}
                                fullWidth
                            />
                            <TextField
                                autoFocus
                                select
                                margin="dense"
                                id="clientType"
                                label={this.state.clientTypeLabel}
                                value={this.state.clientType}
                                onChange={this.handleClientTypeChange}
                                error={this.state.clientTypeError}
                                fullWidth
                            >
                                {client.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            {clientType === 'Indiv' ?
                                <TextField
                                    autoFocus
                                    select
                                    disabled={this.state.clientType === ''}
                                    margin="dense"
                                    id="clientId"
                                    label={this.state.clientIdLabel}
                                    value={this.state.clientId}
                                    onChange={this.handleClientChange}
                                    error={this.state.clientIdError}
                                    fullWidth
                                >
                                    {indivList.length !== 0 ? indivList.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    )) : <MenuItem key={'Empty'} value={'Empty'}>
                                            Нет в базе
                                        </MenuItem>}
                                </TextField> :
                                <TextField
                                    autoFocus
                                    select
                                    disabled={this.state.clientType === ''}
                                    margin="dense"
                                    id="clientId2"
                                    label={this.state.clientIdLabel}
                                    value={this.state.clientId}
                                    onChange={this.handleClientChange}
                                    error={this.state.clientIdError}
                                    fullWidth
                                >
                                    {entList.length !== 0 ? entList.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    )) : <MenuItem key={'Empty'} value={'Empty'}>
                                            Нет в базе
                                        </MenuItem>
                                    }
                                </TextField>
                            }
                            <TextField
                                autoFocus
                                select
                                margin="dense"
                                id="objectType"
                                label={this.state.objectTypeLabel}
                                value={this.state.objectType}
                                onChange={this.handleObjectTypeChange}
                                error={this.state.objectTypeError}
                                fullWidth
                            >
                                {object.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            {objectType === 'Flat' ?
                                <TextField
                                    autoFocus
                                    select
                                    disabled={this.state.objectType === ''}
                                    margin="dense"
                                    id="objectId"
                                    label={this.state.objectIdLabel}
                                    value={this.state.objectId}
                                    onChange={this.handleObjectChange}
                                    error={this.state.objectIdError}
                                    fullWidth
                                >
                                    {flatList.length !== 0 ? flatList.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    )) : <MenuItem key={'Empty'} value={'Empty'}>
                                            Нет в базе
                                        </MenuItem>}
                                </TextField> :
                                objectType === 'Car' ?
                                    <TextField
                                        autoFocus
                                        select
                                        disabled={this.state.objectType === ''}
                                        margin="dense"
                                        id="objectId2"
                                        label={this.state.objectIdLabel}
                                        value={this.state.objectId}
                                        onChange={this.handleObjectChange}
                                        error={this.state.objectIdError}
                                        fullWidth
                                    >
                                        {carList.length !== 0 ? carList.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        )) : <MenuItem key={'Empty'} value={'Empty'}>
                                                Нет в базе
                                        </MenuItem>}
                                    </TextField> :
                                    <TextField
                                        autoFocus
                                        select
                                        disabled={this.state.objectType === ''}
                                        margin="dense"
                                        id="objectId3"
                                        label={this.state.objectIdLabel}
                                        value={this.state.objectId}
                                        onChange={this.handleObjectChange}
                                        error={this.state.objectIdError}
                                        fullWidth
                                    >
                                        {parcelList.length !== 0 ? parcelList.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        )) : <MenuItem key={'Empty'} value={'Empty'}>
                                                Нет в базе
                                        </MenuItem>
                                        }
                                    </TextField>
                            }
                            <TextField
                                autoFocus
                                select
                                margin="dense"
                                id="appraiserId"
                                label={this.state.appraiserIdLabel}
                                value={this.state.appraiserId}
                                onChange={this.handleAppraiserChange}
                                error={this.state.appraiserIdError}
                                fullWidth
                            >
                                {apprList.length !== 0 ? apprList.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                )) : <MenuItem key={'Empty'} value={'Empty'}>
                                        Нет в базе
                                        </MenuItem>}
                            </TextField>
                        </form>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.myHandleClose} color="primary">
                        Отмена
                    </Button>
                    <Button disabled={isLoading} onClick={this.submitHandler} color="secondary">
                        {editContract !== undefined && editContract.id !== undefined ? "Изменить" : "Сохранить"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default compose(
    withStyles(styles)
)(AddContractDialog);