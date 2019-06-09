import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { actionCreators } from '../../store/NeuralSettingsReducer';
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

const moneyMsk = createNumberMask({
    prefix: '',
    suffix: ' ₽',
    integerLimit: '10000000',
    allowDecimal: true
});

const numberMsk = createNumberMask({
    prefix: '',
    suffix: '',
    integerLimit: '10000000',
    allowDecimal: true
});

function moneyMask(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={moneyMsk}
            placeholderChar={'\u2000'}
            keepCharPositions={true}
            guide={false}
            showMask
        />
    );
}

function numberMask(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={numberMsk}
            placeholderChar={'\u2000'}
            keepCharPositions={true}
            guide={false}
            showMask
        />
    );
}

class NeuralSettings extends React.Component {
    constructor(props) {
        super(props);

        this.closeSavedDialog = this.closeSavedDialog.bind(this);

        this.state = {
            refinancingRate: '',
            gdp: '',
            rts: '',
            dollarPrice: '',
            brentPrice: '',
            estateBuilding: '',
            creditsAmount: '',
            averageSalary: '',
            refinancingRateError: false,
            gdpError: false,
            rtsError: false,
            dollarPriceError: false,
            brentPriceError: false,
            estateBuildingError: false,
            creditsAmountError: false,
            averageSalaryError: false,
            refinancingRateLabel: "Ставка рефинансирования",
            gdpLabel: "ВВП России, млрд руб",
            rtsLabel: "РТС",
            dollarPriceLabel: "Стоимость доллара, руб. за 1 доллар",
            brentPriceLabel: "Стоимость нефти Брент, руб за баррель",
            estateBuildingLabel: "Ввод жилья, тыс. кв. м.",
            creditsAmountLabel: "Выданные кредиты, млрд руб",
            averageSalaryLabel: "Средняя зарплата Перми, руб"
        };
    }

    componentWillMount() {
        this.props.GetSettings();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.settings !== nextProps.settings)
            this.setState({
                refinancingRate: nextProps.settings[0].refinancingRate.toString(),
                gdp: nextProps.settings[0].gdp.toString(),
                rts: nextProps.settings[0].rts.toString(),
                dollarPrice: nextProps.settings[0].dollarPrice.toString(),
                brentPrice: nextProps.settings[0].brentPrice.toString(),
                estateBuilding: nextProps.settings[0].estateBuilding.toString(),
                creditsAmount: nextProps.settings[0].creditsAmount.toString(),
                averageSalary: nextProps.settings[0].averageSalary.toString()
            });
    }

    submitHandler() {
        if (!this.validateForm()) {
            const resultObject = {
                id: 1,
                refinancingRate: this.state.refinancingRate, gdp: this.clearMoney(this.state.gdp), rts: this.state.rts, dollarPrice: this.clearMoney(this.state.dollarPrice),
                brentPrice: this.clearMoney(this.state.brentPrice), estateBuilding: this.state.estateBuilding, creditsAmount: this.state.creditsAmount, averageSalary: this.clearMoney(this.state.averageSalary)
            };

            this.props.SaveSettings(resultObject);
        }
    }

    clearMoney(money) {
        if (money.includes('₽')) {
            return money.substring(0, money.length - 2).replace(/,/g, "");
        }

        return money;
    }

    validateForm() {
        let refinancingRate = false, gdp = false, rts = false, dollarPrice = false, brentPrice = false, estateBuilding = false, creditsAmount = false, averageSalary = false;

        let gdpTemp, dollarTemp, brentTemp, salaryTemp;

        gdpTemp = +this.clearMoney(this.state.gdp);
        dollarTemp = +this.clearMoney(this.state.dollarPrice);
        brentTemp = +this.clearMoney(this.state.brentPrice);
        salaryTemp = +this.clearMoney(this.state.averageSalary);

        if (this.state.refinancingRate !== "") {
            if (+this.state.refinancingRate === 0) {
                this.setState({ refinancingRateLabel: "Ставка рефинансирования не равна нулю" });
                this.setState({ refinancingRateError: true });
                refinancingRate = true;
            }
        } else {
            this.setState({ refinancingRateLabel: "Введите ставку рефинансирования" });
            this.setState({ refinancingRateError: true });
            refinancingRate = true;
        }

        if (this.state.gdp !== "") {
            if (gdpTemp === 0) {
                this.setState({ gdpLabel: "ВВП не равно нулю" });
                this.setState({ gdpError: true });
                gdp = true;
            }
        } else {
            this.setState({ gdpLabel: "Введите ВВП России" });
            this.setState({ gdpError: true });
            gdp = true;
        }

        if (this.state.rts !== "") {
            if (+this.state.rts === 0) {
                this.setState({ rtsLabel: "РТС не равно нулю" });
                this.setState({ rtsError: true });
                rts = true;
            }
        } else {
            this.setState({ rtsLabel: "Введите РТС" });
            this.setState({ rtsError: true });
            rts = true;
        }

        if (this.state.dollarPrice !== "") {
            if (dollarTemp === 0) {
                this.setState({ dollarPriceLabel: "Стоимость доллара не равна нулю" });
                this.setState({ dollarPriceError: true });
                dollarPrice = true;
            }
        } else {
            this.setState({ dollarPriceLabel: "Введите стоимость доллара" });
            this.setState({ dollarPriceError: true });
            dollarPrice = true;
        }

        if (this.state.brentPrice !== "") {
            if (brentTemp === 0) {
                this.setState({ brentPriceLabel: "Стоимость нефти не равна нулю" });
                this.setState({ brentPriceError: true });
                brentPrice = true;
            }
        } else {
            this.setState({ brentPriceLabel: "Введите стоимость нефти" });
            this.setState({ brentPriceError: true });
            brentPrice = true;
        }

        if (this.state.estateBuilding !== "") {
            if (+this.state.estateBuilding === 0) {
                this.setState({ estateBuildingLabel: "Ввод жилья не равен нулю" });
                this.setState({ estateBuildingError: true });
                estateBuilding = true;
            }
        } else {
            this.setState({ estateBuildingLabel: "Введите объём ввода жилья" });
            this.setState({ estateBuildingError: true });
            estateBuilding = true;
        }

        if (this.state.creditsAmount !== "") {
            if (+this.state.creditsAmount === 0) {
                this.setState({ creditsAmountLabel: "Объём выданных кредитов не равен нулю" });
                this.setState({ creditsAmountError: true });
                creditsAmount = true;
            }
        } else {
            this.setState({ creditsAmountLabel: "Введите объём выданных кредитов" });
            this.setState({ creditsAmountError: true });
            creditsAmount = true;
        }

        if (this.state.averageSalary !== "") {
            if (salaryTemp === 0) {
                this.setState({ averageSalaryLabel: "Средняя зарплата не равна нулю" });
                this.setState({ averageSalaryError: true });
                averageSalary = true;
            }
        } else {
            this.setState({ averageSalaryLabel: "Введите среднюю зарплату" });
            this.setState({ averageSalaryError: true });
            averageSalary = true;
        }

        if (!refinancingRate) {
            this.setState({ refinancingRateLabel: "Ставка рефинансирования" });
            this.setState({ refinancingRateError: false });
        }

        if (!gdp) {
            this.setState({ gdpLabel: "ВВП России, млрд руб" });
            this.setState({ gdpError: false });
        }

        if (!rts) {
            this.setState({ rtsLabel: "РТС" });
            this.setState({ rtsError: false });
        }

        if (!dollarPrice) {
            this.setState({ dollarPriceLabel: "Стоимость доллара, руб. за 1 доллар" });
            this.setState({ dollarPriceError: false });
        }

        if (!brentPrice) {
            this.setState({ brentPriceLabel: "Стоимость нефти Брент, руб за баррель" });
            this.setState({ brentPriceError: false });
        }

        if (!estateBuilding) {
            this.setState({ estateBuildingLabel: "Ввод жилья, тыс. кв. м." });
            this.setState({ estateBuildingError: false });
        }

        if (!creditsAmount) {
            this.setState({ creditsAmountLabel: "Выданные кредиты, млрд руб" });
            this.setState({ creditsAmountError: false });
        }

        if (!averageSalary) {
            this.setState({ averageSalaryLabel: "Средняя зарплата Перми, руб" });
            this.setState({ averageSalaryError: false });
        }

        return (refinancingRate || gdp || rts || dollarPrice || brentPrice || estateBuilding || creditsAmount || averageSalary);
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
                                <SettingsSavedDialog onCancelAction={this.closeSavedDialog.bind(this)} showDialog={saved} header={0} />
                                <Typography variant="h5" className={classes.header}>
                                    Настройки нейросети
                                </Typography>
                                <TextField
                                    id="refinancingRate"
                                    autoFocus
                                    label={this.state.refinancingRateLabel}
                                    value={this.state.refinancingRate}
                                    onChange={(e) => this.handleChange(e)}
                                    error={this.state.refinancingRateError}
                                    margin="normal"
                                    InputProps={{
                                        inputComponent: numberMask
                                    }}
                                    fullWidth
                                />
                                <TextField
                                    id="gdp"
                                    autoFocus
                                    label={this.state.gdpLabel}
                                    value={this.state.gdp}
                                    onChange={(e) => this.handleChange(e)}
                                    error={this.state.gdpError}
                                    margin="normal"
                                    InputProps={{
                                        inputComponent: moneyMask
                                    }}
                                    fullWidth
                                />
                                <TextField
                                    id="rts"
                                    autoFocus
                                    label={this.state.rtsLabel}
                                    value={this.state.rts}
                                    onChange={(e) => this.handleChange(e)}
                                    error={this.state.rtsError}
                                    margin="normal"
                                    InputProps={{
                                        inputComponent: numberMask
                                    }}
                                    fullWidth
                                />
                                <TextField
                                    id="dollarPrice"
                                    autoFocus
                                    label={this.state.dollarPriceLabel}
                                    value={this.state.dollarPrice}
                                    onChange={(e) => this.handleChange(e)}
                                    error={this.state.dollarPriceError}
                                    margin="normal"
                                    InputProps={{
                                        inputComponent: moneyMask
                                    }}
                                    fullWidth
                                />
                                <TextField
                                    id="brentPrice"
                                    autoFocus
                                    label={this.state.brentPriceLabel}
                                    value={this.state.brentPrice}
                                    onChange={(e) => this.handleChange(e)}
                                    error={this.state.brentPriceError}
                                    margin="normal"
                                    InputProps={{
                                        inputComponent: moneyMask
                                    }}
                                    fullWidth
                                />
                                <TextField
                                    id="estateBuilding"
                                    autoFocus
                                    label={this.state.estateBuildingLabel}
                                    value={this.state.estateBuilding}
                                    onChange={(e) => this.handleChange(e)}
                                    error={this.state.estateBuildingError}
                                    margin="normal"
                                    InputProps={{
                                        inputComponent: numberMask
                                    }}
                                    fullWidth
                                />
                                <TextField
                                    id="creditsAmount"
                                    autoFocus
                                    label={this.state.creditsAmountLabel}
                                    value={this.state.creditsAmount}
                                    onChange={(e) => this.handleChange(e)}
                                    error={this.state.creditsAmountError}
                                    margin="normal"
                                    InputProps={{
                                        inputComponent: numberMask
                                    }}
                                    fullWidth
                                />
                                <TextField
                                    id="averageSalary"
                                    autoFocus
                                    label={this.state.averageSalaryLabel}
                                    value={this.state.averageSalary}
                                    onChange={(e) => this.handleChange(e)}
                                    error={this.state.averageSalaryError}
                                    margin="normal"
                                    InputProps={{
                                        inputComponent: moneyMask
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
    state => state.neuralSettings,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(NeuralSettings));
