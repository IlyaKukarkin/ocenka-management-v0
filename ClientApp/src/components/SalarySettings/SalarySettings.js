import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { actionCreators } from '../../store/SalarySettingsReducer';
import { withStyles } from '@material-ui/core/styles';
import {
    Grid, TextField, Button, CircularProgress, Typography
} from '@material-ui/core';
import SettingsSavedDialog from '../SettingsSavedDialog';

const styles = theme => ({
    header: {
        marginBottom: '20px'
    },
    button: {
        marginTop: '20px'
    },
    loading: {
        height: '400px',
        marginUp: '180px'
    },
});

const percentMsk = createNumberMask({
    prefix: '',
    suffix: ' %',
    integerLimit: '10000000',
    allowDecimal: true
});

function percentMask(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={percentMsk}
            placeholderChar={'\u2000'}
            keepCharPositions={true}
            guide={false}
            showMask
        />
    );
}

class SalarySettings extends React.Component {
    constructor(props) {
        super(props);

        this.closeSavedDialog = this.closeSavedDialog.bind(this);

        this.state = {
            carPercent: '',
            flatPercent: '',
            parcelPercent: '',
            carPercentError: false,
            flatPercentError: false,
            parcelPercentError: false,
            carPercentLabel: "Процент за оценку автомобиля",
            flatPercentLabel: "Процент за оценку квартиры",
            parcelPercentLabel: "Процент за оценку участка",
        };
    }

    componentWillMount() {
        this.props.GetSettings();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.settings !== nextProps.settings)
            this.setState({
                carPercent: nextProps.settings[0].carPercent.toString(),
                flatPercent: nextProps.settings[0].flatPercent.toString(),
                parcelPercent: nextProps.settings[0].parcelPercent.toString()
            });
    }

    submitHandler() {
        if (!this.validateForm()) {
            const resultObject = {
                id: 1,
                carPercent: this.clearPercent(this.state.carPercent), flatPercent: this.clearPercent(this.state.flatPercent), parcelPercent: this.clearPercent(this.state.parcelPercent),
                car: 0, flat: 0, parcel: 0
            };

            this.props.SaveSettings(resultObject);
        }
    }

    clearPercent(percent) {
        if (percent.includes('%')) {
            return percent.substring(0, percent.length - 2).replace(/,/g, "");
        }

        return percent;
    }

    validateForm() {
        let carPercent = false, flatPercent = false, parcelPercent = false;

        let carTemp, parcelTemp, flatTemp;

        carTemp = +this.clearPercent(this.state.carPercent);
        parcelTemp = +this.clearPercent(this.state.flatPercent);
        flatTemp = +this.clearPercent(this.state.parcelPercent);

        if (this.state.carPercent !== "") {
            if (carTemp > 100 || carTemp < 0) {
                this.setState({ carPercentLabel: "Процент за автомобиль от 0 до 100" });
                this.setState({ carPercentError: true });
                carPercent = true;
            }
        } else {
            this.setState({ carPercentLabel: "Введите процент за автомобиль" });
            this.setState({ carPercentError: true });
            carPercent = true;
        }

        if (this.state.flatPercent !== "") {
            if (flatTemp > 100 || flatTemp < 0) {
                this.setState({ flatPercentLabel: "Процент за квартиру от 0 до 100" });
                this.setState({ flatPercentError: true });
                flatPercent = true;
            }
        } else {
            this.setState({ flatPercentLabel: "Введите процент за квартиру" });
            this.setState({ flatPercentError: true });
            flatPercent = true;
        }

        if (this.state.parcelPercent !== "") {
            if (parcelTemp > 100 || parcelTemp < 0) {
                this.setState({ parcelPercentLabel: "Процент за участок от 0 до 100" });
                this.setState({ parcelPercentError: true });
                parcelPercent = true;
            }
        } else {
            this.setState({ parcelPercentLabel: "Введите процент за участок" });
            this.setState({ parcelPercentError: true });
            parcelPercent = true;
        }

        if (!carPercent) {
            this.setState({ carPercentLabel: "Процент за оценку автомобиля" });
            this.setState({ carPercentError: false });
        }

        if (!flatPercent) {
            this.setState({ flatPercentLabel: "Процент за оценку квартиры" });
            this.setState({ flatPercentError: false });
        }

        if (!parcelPercent) {
            this.setState({ parcelPercentLabel: "Процент за оценку участка" });
            this.setState({ parcelPercentError: false });
        }

        return (carPercent || flatPercent || parcelPercent);
    }

    handleChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    closeSavedDialog = () => {
        this.props.SaveClose();
    }

    render() {
        const { classes, isLoading, saved } = this.props;

        return (
            <div>
                {isLoading ? <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    className={classes.loading}
                >
                    <CircularProgress className={classes.progress} />
                </Grid> :

                    <Grid container justify="center" alignItems="center">
                        <Grid item xs={2} />
                        <Grid item xs >
                            <Grid container justify="center" alignItems="center" >
                                <SettingsSavedDialog onCancelAction={this.closeSavedDialog.bind(this)} showDialog={saved} header={1} />
                                <Typography variant="h5" className={classes.header}>
                                    Настройки зарплаты оценщиков
                                </Typography>
                                <TextField
                                    id="carPercent"
                                    autoFocus
                                    label={this.state.carPercentLabel}
                                    value={this.state.carPercent}
                                    onChange={(e) => this.handleChange(e)}
                                    error={this.state.carPercentError}
                                    margin="normal"
                                    InputProps={{
                                        inputComponent: percentMask
                                    }}
                                    fullWidth
                                />
                                <TextField
                                    id="flatPercent"
                                    autoFocus
                                    label={this.state.flatPercentLabel}
                                    value={this.state.flatPercent}
                                    onChange={(e) => this.handleChange(e)}
                                    error={this.state.flatPercentError}
                                    margin="normal"
                                    InputProps={{
                                        inputComponent: percentMask
                                    }}
                                    fullWidth
                                />
                                <TextField
                                    id="parcelPercent"
                                    autoFocus
                                    label={this.state.parcelPercentLabel}
                                    value={this.state.parcelPercent}
                                    onChange={(e) => this.handleChange(e)}
                                    error={this.state.parcelPercentError}
                                    margin="normal"
                                    InputProps={{
                                        inputComponent: percentMask
                                    }}
                                    fullWidth
                                />
                                <Button variant="contained" color="primary" onClick={() => this.submitHandler()} className={classes.button}> Сохранить </Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={2} />
                    </Grid>
                }
            </div>
        );
    }
}

export default withStyles(styles)(connect(
    state => state.salarySettings,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(SalarySettings));
