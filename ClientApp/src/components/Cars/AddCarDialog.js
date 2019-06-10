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

function NumberMask(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/[АВЕКМНОРСТУХ]/, /[0-9]/, /[0-9]/, /[0-9]/, /[АВЕКМНОРСТУХ]/, /[АВЕКМНОРСТУХ]/]}
            placeholderChar={'\u2000'}
            keepCharPositions={true}
            guide={false}
            showMask
        />
    );
}

function YearMask(props) {
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

function insertInString(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

function makeCadastral(str) {
    return str.substr(0, 2) + ":" + str.substr(2, 2) + ":" + str.substr(4, 7) + ":" + str.substr(11, 2);
}

function clearCadastral(str) {
    return str.substr(0, 2) + str.substr(3, 2) + str.substr(6, 7) + str.substr(14, 2);
}

class AddCarDialog extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleAimChange = this.handleAimChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.myHandleClose = this.myHandleClose.bind(this);
        this.state = {
            mark: '',
            aimOfEvaluation: '',
            model: '',
            licenseNumber: '',
            year: '',
            markError: false,
            aimOfEvaluationError: false,
            modelError: false,
            licenseNumberError: false,
            yearError: false,
            markLabel: "Марка",
            aimOfEvaluationLabel: "Цель оценки",
            modelLabel: "Модель",
            licenseNumberLabel: "Регистрационный знак",
            yearLabel: "Год выпуска",
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editCar !== undefined && nextProps.editCar.mark !== undefined && (this.state.mark !== nextProps.editCar.mark || this.state.model !== nextProps.editCar.model)) {
            this.setState({
                mark: nextProps.editCar.mark,
                aimOfEvaluation: nextProps.editCar.aimOfEvaluation,
                model: nextProps.editCar.model,
                licenseNumber: nextProps.editCar.licenseNumber,
                year: nextProps.editCar.year.toString(),
            });
        }
    }

    submitHandler(evt) {
        evt.preventDefault();
        // pass the input field value to the event handler passed
        // as a prop by the parent (App)

        if (!this.validateForm()) {
            if (this.props.editCar === undefined || this.props.editCar.id === undefined) {
                const resultObject = {
                    mark: this.state.mark, aimOfEvaluation: this.state.aimOfEvaluation, model: this.state.model,
                    licenseNumber: this.state.licenseNumber, year: this.state.year, cadastralNumber: 0
                }

                this.props.onAddAction(resultObject);
            } else {
                const resultObject2 = {
                    id: this.props.editCar.id,
                    mark: this.state.mark, aimOfEvaluation: this.state.aimOfEvaluation, model: this.state.model,
                    licenseNumber: this.state.licenseNumber, year: this.state.year, cadastralNumber: 0
                }

                this.props.onEditAction(resultObject2);
            }

            this.setState({
                mark: '',
                aimOfEvaluation: '',
                model: '',
                licenseNumber: '',
                year: '',
                markError: false,
                aimOfEvaluationError: false,
                modelError: false,
                licenseNumberError: false,
                yearError: false,
                markLabel: "Марка",
                aimOfEvaluationLabel: "Цель оценки",
                modelLabel: "Модель",
                licenseNumberLabel: "Регистрационный знак",
                yearLabel: "Год выпуска",
            });
        }
    }

    validateForm() {
        let mark = false, aimOfEvaluation = false, model = false, licenseNumber = false, year = false;

        if (this.state.mark === "") {
            this.setState({ markLabel: "Введите марку"});
            this.setState({ markError: true });
            mark = true;
        }

        if (this.state.aimOfEvaluation === "") {
            this.setState({ aimOfEvaluationLabel: "Выберете цель оценки" });
            this.setState({ aimOfEvaluationError: true });
            aimOfEvaluation = true;
        }

        if (this.state.model === "") {
            this.setState({ modelLabel: "Введите модель" });
            this.setState({ modelError: true });
            model = true;
        }

        if (this.state.licenseNumber !== "") {
            if (this.state.licenseNumber.length !== 6) {
                this.setState({ licenseNumberLabel: "Введите регистрационный знак полностью" });
                this.setState({ licenseNumberError: true });
                licenseNumber = true;
            }
        } else {
            this.setState({ licenseNumberLabel: "Введите регистрационный знак" });
            this.setState({ licenseNumberError: true });
            licenseNumber = true;
        }

        if (this.state.year !== "") {
            if (this.state.year.length !== 4) {
                this.setState({ yearLabel: "Введите год выпуска полностью" });
                this.setState({ yearError: true });
                year = true;
            } else {
                const today = new Date();
                const yy = today.getFullYear();
                if (this.state.year < 1945 || this.state.year > yy) {
                    this.setState({ yearLabel: `Год выпуска от 1945 до ${yy}` });
                    this.setState({ yearError: true });
                    year = true;
                }
            }
        } else {
            this.setState({ yearLabel: "Введите год выпуска" });
            this.setState({ yearError: true });
            year = true;
        }

        if (!mark) {
            this.setState({ markLabel: "Марка" });
            this.setState({ markError: false });
        }

        if (!aimOfEvaluation) {
            this.setState({ aimOfEvaluationLabel: "Цель оценки" });
            this.setState({ aimOfEvaluationError: false });
        }

        if (!model) {
            this.setState({ modelLabel: "Модель" });
            this.setState({ modelError: false });
        }

        if (!licenseNumber) {
            this.setState({ licenseNumberLabel: "Регистрационный знак" });
            this.setState({ licenseNumberError: false });
        }

        if (!year) {
            this.setState({ yearLabel: "Год выпуска" });
            this.setState({ yearError: false });
        }

        return (mark || aimOfEvaluation || model || licenseNumber || year);
    }

    handleChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleAimChange(event) {
        this.setState({
            aimOfEvaluation: event.target.value
        });
    }

    myHandleClose() {
        this.setState({
            mark: '',
            aimOfEvaluation: '',
            model: '',
            licenseNumber: '',
            year: '',
            markError: false,
            aimOfEvaluationError: false,
            modelError: false,
            licenseNumberError: false,
            yearError: false,
            markLabel: "Марка",
            aimOfEvaluationLabel: "Цель оценки",
            modelLabel: "Модель",
            licenseNumberLabel: "Регистрационный знак",
            yearLabel: "Год выпуска",
        });

        this.props.onCancelAction();
    }

    render() {
        const { showDialog, editCar } = this.props;

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
                    {editCar !== undefined && editCar.id !== undefined ? "Изменить автомобиль" : "Добавить автомобиль"}
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={this.submitHandler}>
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
                            id="mark"
                            label={this.state.markLabel}
                            value={this.state.mark}
                            onChange={this.handleChange}
                            error={this.state.markError}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="model"
                            label={this.state.modelLabel}
                            value={this.state.model}
                            onChange={this.handleChange}
                            error={this.state.modelError}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="licenseNumber"
                            label={this.state.licenseNumberLabel}
                            value={this.state.licenseNumber}
                            onChange={this.handleChange}
                            error={this.state.licenseNumberError}
                            InputProps={{
                                inputComponent: NumberMask
                            }}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="year"
                            label={this.state.yearLabel}
                            value={this.state.year}
                            onChange={this.handleChange}
                            error={this.state.yearError}
                            InputProps={{
                                inputComponent: YearMask
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
                        {editCar !== undefined && editCar.id !== undefined ? "Изменить" : "Сохранить"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default compose(
    withStyles(styles)
)(AddCarDialog);