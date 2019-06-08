import React from 'react';
import MaskedInput from 'react-text-mask';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField, MenuItem
} from '@material-ui/core';

const styles = theme => ({
    dialog: {
        maxWidth: '508px'
    }
});

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

function insertInString(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

function makeCadastral(str) {
    return str.substr(0, 2) + ":" + str.substr(2, 2) + ":" + str.substr(4, 7) + ":" + str.substr(11, 2);
}

function clearCadastral(str) {
    return str.substr(0, 2) + str.substr(3, 2) + str.substr(6, 7) + str.substr(14, 2);
}

class AddParcelDialog extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleAimChange = this.handleAimChange.bind(this);
        this.handleUsageChange = this.handleUsageChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.myHandleClose = this.myHandleClose.bind(this);
        this.state = {
            cadastralNumber: '',
            aimOfEvaluation: '',
            area: '',
            usageType: '',
            cadastralNumberError: false,
            aimOfEvaluationError: false,
            areaError: false,
            usageTypeError: false,
            cadastralNumberLabel: "Кадастровый номер",
            aimOfEvaluationLabel: "Цель оценки",
            areaLabel: "Площадь",
            usageTypeLabel: "Тип использования",
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editParcel !== undefined && nextProps.editParcel.cadastralNumber !== undefined && (this.state.cadastralNumber !== nextProps.editParcel.cadastralNumber || this.state.area !== nextProps.editParcel.area)) {
            this.setState({
                cadastralNumber: makeCadastral(nextProps.editParcel.cadastralNumber.toString()),
                aimOfEvaluation: nextProps.editParcel.aimOfEvaluation,
                area: nextProps.editParcel.area,
                usageType: nextProps.editParcel.usageType,
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
            if (this.props.editParcel === undefined || this.props.editParcel.id === undefined) {
                const resultObject = {
                    cadastralNumber: clearCadastral(this.state.cadastralNumber), aimOfEvaluation: this.state.aimOfEvaluation, area: this.state.area, usageType: this.state.usageType
                }

                this.props.onAddAction(resultObject);
            } else {
                const resultObject2 = {
                    id: this.props.editParcel.id,
                    cadastralNumber: clearCadastral(this.state.cadastralNumber), aimOfEvaluation: this.state.aimOfEvaluation, area: this.state.area, usageType: this.state.usageType
                }

                this.props.onEditAction(resultObject2);
            }

            this.setState({
                cadastralNumber: '',
                aimOfEvaluation: '',
                area: '',
                usageType: '',
                cadastralNumberError: false,
                aimOfEvaluationError: false,
                areaError: false,
                usageTypeError: false,
                cadastralNumberLabel: "Кадастровый номер",
                aimOfEvaluationLabel: "Цель оценки",
                areaLabel: "Площадь",
                usageTypeLabel: "Тип использования",
            });
        }
    }

    validateForm() {
        let cadastralNumber = false, aimOfEvaluation = false, area = false, usageType = false;

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

        if (this.state.usageType === "") {
            this.setState({ usageTypeLabel: "Выберите тип использования" });
            this.setState({ usageTypeError: true });
            usageType = true;
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

        if (!usageType) {
            this.setState({ usageTypeLabel: "Тип использования" });
            this.setState({ usageTypeError: false });
        }

        return (cadastralNumber || aimOfEvaluation || area || usageType);
    }

    handleChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleUsageChange(event) {
        this.setState({
            usageType: event.target.value
        });
    }

    handleAimChange(event) {
        this.setState({
            aimOfEvaluation: event.target.value
        });
    }

    myHandleClose() {
        this.setState({
            cadastralNumber: '',
            aimOfEvaluation: '',
            area: '',
            usageType: '',
            cadastralNumberError: false,
            aimOfEvaluationError: false,
            areaError: false,
            usageTypeError: false,
            cadastralNumberLabel: "Кадастровый номер",
            aimOfEvaluationLabel: "Цель оценки",
            areaLabel: "Площадь",
            usageTypeLabel: "Тип использования",
        });

        this.props.onCancelAction();
    }

    render() {
        const { showDialog, editParcel } = this.props;

        const aims = [{ value: 'Банк', label: 'Банк' }, { value: 'Наследство', label: 'Наследство' }, { value: 'Суд', label: 'Суд' }];
        const types = [
            { value: 'Индивидуальное жилищное строительство', label: 'Индивидуальное жилищное строительство' },
            { value: 'Ведение личного подсобного хозяйства', label: 'Ведение личного подсобного хозяйства' },
            { value: 'Дачное строительство', label: 'Дачное строительство' },
            { value: 'Садоводство', label: 'Садоводство' },
        ];

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
                    {editParcel !== undefined && editParcel.id !== undefined ? "Изменить участок" : "Добавить участок"}
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
                            onChange={this.handleAimChange}
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
                            select
                            margin="dense"
                            id="usageType"
                            label={this.state.usageTypeLabel}
                            value={this.state.usageType}
                            onChange={this.handleUsageChange}
                            error={this.state.usageTypeError}
                            fullWidth
                        >
                            {types.map(option => (
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
                        {editParcel !== undefined && editParcel.id !== undefined ? "Изменить" : "Сохранить"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default compose(
    withStyles(styles)
)(AddParcelDialog);