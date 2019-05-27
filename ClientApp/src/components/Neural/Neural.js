import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../../store/NeuralReducer';
import { withStyles } from '@material-ui/core/styles';
import {
    Grid, TextField, Button, Typography, CircularProgress
} from '@material-ui/core';

const styles = theme => ({
    cell: {
        minHeight: '62px',
        marginTop: '8px',
        marginBottom: '9px'
    },
    cellFirst: {
        minHeight: '62px',
        marginTop: '20px',
        marginBottom: '9px'
    },
    result: {
        color: '#3f51b5'
    },
    loading: {
        height: '400px',
        marginUp: '180px'
    },
});

class Neural extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            livingArea: '',
            kitchenArea: '',
            numberOfRooms: '',
            floor: '',
            numberOfFloors: '',
            district: '',
            year: '',
            walls: '',
            livingAreaError: false,
            kitchenAreaError: false,
            numberOfRoomsError: false,
            floorError: false,
            numberOfFloorsError: false,
            districtError: false,
            yearError: false,
            wallsError: false,
            livingAreaLabel: "Жилая площадь",
            kitchenAreaLabel: "Площадь кухни",
            numberOfRoomsLabel: "Кол-во комнат",
            floorLabel: "Этаж",
            numberOfFloorsLabel: "Кол-во этажей",
            districtLabel: "Микрорайон",
            yearLabel: "Год постройки",
            wallsLabel: "Тип стен"
        };
    }

    componentWillMount() {
        this.props.GetSettings();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.settings !== nextProps.settings)
            this.setState({ data: nextProps.settings[0] });
    }

    submitHandler() {
        //evt.preventDefault();
        // pass the input field value to the event handler passed
        // as a prop by the parent (App)

        if (!this.validateForm()) {
            let role = 1, extra = this.state.category;
            if (this.state.position === 'Бухгалтер') {
                role = 2;
                extra = this.clearSalary(this.state.salary);
            }

            const resultObject = {
                livingArea: this.state.livingArea, kitchenArea: this.state.kitchenArea, numberOfRooms: this.state.numberOfRooms, floor: this.state.floor,
                numberOfFloors: this.state.numberOfFloors, district: this.state.district, year: this.state.year, walls: this.state.walls,
                refinancingRate: this.state.data.refinancingRate, averageSalary: this.state.data.averageSalary, gdp: this.state.data.gdp, rts: this.state.data.rts,
                dollarPrice: this.state.data.dollarPrice, brentPrice: this.state.data.brentPrice, estateBuilding: this.state.data.estateBuilding, creditsAmount: this.state.data.creditsAmount
            };

            this.props.Calculate(resultObject);
        }
    }

    validateForm() {
        let surname = false, name = false, patronymic = false, login = false, password = false, birthday = false, worksSince = false, position = false, category = false, salary = false;

        return false;

        if (this.state.surname !== "") {
            if (this.state.surname.length > 30) {
                this.setState({ surnameLabel: "Фамилия до 30 символов" });
                this.setState({ surnameError: true });
                surname = true;
            }
        } else {
            this.setState({ surnameLabel: "Введите фамилию" });
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

        if (this.state.login !== "") {
            if (this.state.login.length > 30 || this.state.login.length < 8) {
                this.setState({ loginLabel: "Логин от 8 до 30 символов" });
                this.setState({ loginError: true });
                login = true;
            } else {
                if (/[А-Я]/.test(this.state.login) || /[а-я]/.test(this.state.login)) {
                    this.setState({ loginLabel: "Логин не должен содержать русские буквы" });
                    this.setState({ loginError: true });
                    login = true;
                }
            }
        } else {
            this.setState({ loginLabel: "Введите логин" });
            this.setState({ loginError: true });
            login = true;
        }

        if (this.state.password !== "") {
            if (this.state.password.length > 30) {
                this.setState({ passwordLabel: "Пароль до 30 символов" });
                this.setState({ passwordError: true });
                password = true;
            } else {
                if (this.state.password.length < 8) {
                    this.setState({ passwordLabel: "Пароль от 8 символов" });
                    this.setState({ passwordError: true });
                    password = true;
                } else {
                    let count = 0;

                    count += /[a-z]/.test(this.state.password) ? 1 : 0;
                    count += /[A-Z]/.test(this.state.password) ? 1 : 0;
                    count += /\d/.test(this.state.password) ? 1 : 0;

                    if (count !== 3) {
                        this.setState({ passwordLabel: "Пароль должен содержать цифры, строчные и заглавные латинские буквы" });
                        this.setState({ passwordError: true });
                        password = true;
                    }
                }
            }
        } else {
            this.setState({ passwordLabel: "Введите пароль" });
            this.setState({ passwordError: true });
            password = true;
        }

        if (this.state.birthday !== "") {
            if (this.state.birthday.length < 10) {
                this.setState({ birthdayLabel: "Введите дату рождения полностью" });
                this.setState({ birthdayError: true });
                birthday = true;
            } else {
                const day = +this.state.birthday.substring(0, 2);
                const month = +this.state.birthday.substring(3, 5);
                const year = +this.state.birthday.substring(6, 10);

                if (this.checkData(day, month, year)) {
                    this.setState({ birthdayLabel: "Введите дату рождения корректно" });
                    this.setState({ birthdayError: true });
                    birthday = true;
                }
            }
        } else {
            this.setState({ birthdayLabel: "Введите дату рождения" });
            this.setState({ birthdayError: true });
            birthday = true;
        }

        if (this.state.worksSince !== "") {
            if (this.state.worksSince.length < 10) {
                this.setState({ worksSinceLabel: "Введите год начала работы полностью" });
                this.setState({ worksSinceError: true });
                worksSince = true;
            } else {
                const day = +this.state.worksSince.substring(0, 2);
                const month = +this.state.worksSince.substring(3, 5);
                const year = +this.state.worksSince.substring(6, 10);

                if (this.checkData(day, month, year)) {
                    this.setState({ worksSinceLabel: "Введите год начала работы корректно" });
                    this.setState({ worksSinceError: true });
                    worksSince = true;
                }
            }
        } else {
            this.setState({ worksSinceLabel: "Введите дату начала работы" });
            this.setState({ worksSinceError: true });
            worksSince = true;
        }

        if (this.state.position === "") {
            this.setState({ positionLabel: "Выберите должность" });
            this.setState({ positionError: true });
            position = true;
        } else {
            if (this.state.position === "Оценщик") {
                if (this.state.category === "") {
                    this.setState({ categoryLabel: "Выберите категорию" });
                    this.setState({ categoryError: true });
                    category = true;
                }
            } else {
                if (this.state.salary === "") {
                    this.setState({ salaryLabel: "Введите зарплату" });
                    this.setState({ salaryError: true });
                    salary = true;
                } else {
                    let salaryNumber = this.clearSalary(this.state.salary);

                    if (salaryNumber.includes('.')) {
                        if (salaryNumber.length > 9) {
                            this.setState({ salaryLabel: "Зарплата слишком большая" });
                            this.setState({ salaryError: true });
                            salary = true;
                        }
                    } else {
                        if (salaryNumber.length > 6) {
                            this.setState({ salaryLabel: "Зарплата слишком большая" });
                            this.setState({ salaryError: true });
                            salary = true;
                        }
                    }
                }
            }
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

        if (!login) {
            this.setState({ loginLabel: "Логин" });
            this.setState({ loginError: false });
        }

        if (!password) {
            this.setState({ passwordLabel: "Пароль" });
            this.setState({ passwordError: false });
        }

        if (!birthday) {
            this.setState({ birthdayLabel: "Дата рождения" });
            this.setState({ birthdayError: false });
        }

        if (!worksSince) {
            this.setState({ worksSinceLabel: "Дата начала работы" });
            this.setState({ worksSinceError: false });
        }

        if (!position) {
            this.setState({ positionLabel: "Должность" });
            this.setState({ positionError: false });
        }

        if (!category) {
            this.setState({ categoryLabel: "Категория" });
            this.setState({ categoryError: false });
        }

        if (!salary) {
            this.setState({ salaryLabel: "Зарплата" });
            this.setState({ salaryError: false });
        }

        if (!birthday && !worksSince) {
            if (!this.dateLess(this.state.birthday, this.state.worksSince)) {
                this.setState({ worksSinceLabel: "Дата начала работы раньше или равна дню рождения" });
                this.setState({ worksSinceError: true });
                worksSince = true;
            }
        }

        return (surname || name || patronymic || login || password || birthday || worksSince || position);
    }

    handleChange(event) {
        if (event.target.id === undefined) {
            if (event.target.value === 'Оценщик' || event.target.value === 'Бухгалтер') {
                this.setState({ position: event.target.value });
                this.setState({ categoryLabel: event.target.value === 'Оценщик' ? 'Категория' : 'Зарплата' });
            } else {
                this.setState({ category: event.target.value });
            }
        } else {
            this.setState({
                [event.target.id]: event.target.value
            });
        }
    }

    render() {
        const { classes, isLoading, price } = this.props;
        const { data } = this.state;

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

                    <Grid container spacing={24}>
                        <Grid item xs={6}>
                            <Grid container className={classes.cellFirst} justify="flex-end" alignContent="center">
                                <Grid item xs={9}>
                                    <Typography>Ставка рефинансирования: <b>{data.refinancingRate}</b></Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.cell} justify="flex-end" alignContent="center">
                                <Grid item xs={9}>
                                    <Typography>Средняя зарплата: <b>{data.averageSalary}</b></Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.cell} justify="flex-end" alignContent="center">
                                <Grid item xs={9}>
                                    <Typography>ВВП России: <b>{data.gdp}</b></Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.cell} justify="flex-end" alignItems="center" alignContent="center">
                                <Grid item xs={9}>
                                    <Typography>РТС: <b>{data.rts}</b></Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.cell} justify="flex-end" alignItems="center" alignContent="center">
                                <Grid item xs={9}>
                                    <Typography>Стоимость доллара: <b>{data.dollarPrice}</b></Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.cell} justify="flex-end" alignItems="center" alignContent="center">
                                <Grid item xs={9}>
                                    <Typography>Стоимость нефти: <b>{data.brentPrice}</b></Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.cell} justify="flex-end" alignItems="center" alignContent="center">
                                <Grid item xs={9}>
                                    <Typography>Ввод жилья: <b>{data.estateBuilding}</b></Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.cell} justify="flex-end" alignItems="center" alignContent="center">
                                <Grid item xs={9}>
                                    <Typography>Выданные кредиты: <b>{data.creditsAmount}</b></Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="livingArea"
                                autoFocus
                                label={this.state.livingAreaLabel}
                                value={this.state.livingArea}
                                onChange={(e) => this.handleChange(e)}
                                error={this.state.livingAreaError}
                                margin="normal"
                                fullWidth
                            />
                            <TextField
                                id="kitchenArea"
                                autoFocus
                                label={this.state.kitchenAreaLabel}
                                value={this.state.kitchenArea}
                                onChange={(e) => this.handleChange(e)}
                                error={this.state.kitchenAreaError}
                                margin="normal"
                                fullWidth
                            />
                            <TextField
                                id="numberOfRooms"
                                autoFocus
                                label={this.state.numberOfRoomsLabel}
                                value={this.state.numberOfRooms}
                                onChange={(e) => this.handleChange(e)}
                                error={this.state.numberOfRoomsError}
                                margin="normal"
                                fullWidth
                            />
                            <TextField
                                id="floor"
                                autoFocus
                                label={this.state.floorLabel}
                                value={this.state.floor}
                                onChange={(e) => this.handleChange(e)}
                                error={this.state.floorError}
                                margin="normal"
                                fullWidth
                            />
                            <TextField
                                id="numberOfFloors"
                                autoFocus
                                label={this.state.numberOfFloorsLabel}
                                value={this.state.numberOfFloors}
                                onChange={(e) => this.handleChange(e)}
                                error={this.state.numberOfFloorsError}
                                margin="normal"
                                fullWidth
                            />
                            <TextField
                                id="district"
                                autoFocus
                                label={this.state.districtLabel}
                                value={this.state.district}
                                onChange={(e) => this.handleChange(e)}
                                error={this.state.districtError}
                                margin="normal"
                                fullWidth
                            />
                            <TextField
                                id="year"
                                autoFocus
                                label={this.state.yearLabel}
                                value={this.state.year}
                                onChange={(e) => this.handleChange(e)}
                                error={this.state.yearError}
                                margin="normal"
                                fullWidth
                            />
                            <TextField
                                id="walls"
                                autoFocus
                                label={this.state.wallsLabel}
                                value={this.state.walls}
                                onChange={(e) => this.handleChange(e)}
                                error={this.state.wallsError}
                                margin="normal"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3} />
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary" onClick={() => this.submitHandler()}> Рассчитать </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography className={classes.result} variant="h6">Стоимость квартиры: {price === 0 ? 'Н/Д' : parseInt(price, 10)}</Typography>
                        </Grid>
                    </Grid>
                }
            </div>
        );
    }
}

export default withStyles(styles)(connect(
    state => state.neural,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Neural));
