import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MaskedInput from 'react-text-mask';
import { actionCreators } from '../../store/NeuralReducer';
import { withStyles } from '@material-ui/core/styles';
import {
    Grid, TextField, Button, Typography, CircularProgress, MenuItem
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
        color: '#3f51b5',
        marginTop: '20px',
    },
    loading: {
        height: '400px',
        marginUp: '180px'
    },
    button: {
        marginLeft: '22px',
    },
});

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

        if (!this.validateForm()) {
            let walls, distr = this.getDistrictValue(this.state.district);

            switch (this.state.walls) {
                case 'Блок':
                    walls = '000001';
                    break;
                case 'Шлакоблок':
                    walls = '000010';
                    break;
                case 'Газобетон':
                    walls = '000100';
                    break;
                case 'Монолит':
                    walls = '001000';
                    break;
                case 'Панель':
                    walls = '010000';
                    break;
                case 'Кирпич':
                    walls = '100000';
                    break;
            }

            const resultObject = {
                livingArea: this.state.livingArea, kitchenArea: this.state.kitchenArea, numberOfRooms: this.state.numberOfRooms, floor: this.state.floor,
                numberOfFloors: this.state.numberOfFloors, district: distr, year: this.state.year, walls: walls,
                refinancingRate: this.state.data.refinancingRate, averageSalary: this.state.data.averageSalary, gdp: this.state.data.gdp, rts: this.state.data.rts,
                dollarPrice: this.state.data.dollarPrice, brentPrice: this.state.data.brentPrice, estateBuilding: this.state.data.estateBuilding, creditsAmount: this.state.data.creditsAmount
            };

            this.props.Calculate(resultObject);
        }
    }

    validateForm() {
        let livingArea = false, kitchenArea = false, numberOfRooms = false, floor = false, numberOfFloors = false, district = false, year = false, walls = false;

        if (this.state.livingArea === "") {
            this.setState({ livingAreaLabel: "Введите жилую площадь" });
            this.setState({ livingAreaError: true });
            livingArea = true;
        }

        if (this.state.kitchenArea === "") {
            this.setState({ kitchenAreaLabel: "Введите площадь кухни" });
            this.setState({ kitchenAreaError: true });
            kitchenArea = true;
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

        if (this.state.numberOfFloors === "") {
            this.setState({ numberOfFloorsLabel: "Введите кол-во этажей" });
            this.setState({ numberOfFloorsError: true });
            numberOfFloors = true;
        }

        if (this.state.district === "") {
            this.setState({ districtLabel: "Выберете микрорайон" });
            this.setState({ districtError: true });
            district = true;
        }

        if (this.state.year === "") {
            this.setState({ yearLabel: "Введите год постройки" });
            this.setState({ yearError: true });
            year = true;
        } else {
            const today = new Date();
            const yyyy = today.getFullYear();

            if (this.state.year > yyyy || this.state.year < 1945) {
                this.setState({ yearLabel: `Год от 1945 до ${yyyy}` });
                this.setState({ yearError: true });
                year = true;
            }
        }

        if (this.state.walls === "") {
            this.setState({ wallsLabel: "Выберете тип стен" });
            this.setState({ wallsError: true });
            walls = true;
        }

        if (!livingArea) {
            this.setState({ livingAreaLabel: "Жилая площадь" });
            this.setState({ livingAreaError: false });
        }

        if (!kitchenArea) {
            this.setState({ kitchenAreaLabel: "Площадь кухни" });
            this.setState({ kitchenAreaError: false });
        }

        if (!numberOfRooms) {
            this.setState({ numberOfRoomsLabel: "Кол-во комнат" });
            this.setState({ numberOfRoomsError: false });
        }

        if (!floor) {
            this.setState({ floorLabel: "Этаж" });
            this.setState({ floorError: false });
        }

        if (!numberOfFloors) {
            this.setState({ numberOfFloorsLabel: "Кол-во этажей" });
            this.setState({ numberOfFloorsError: false });
        }

        if (!district) {
            this.setState({ districtLabel: "Микрорайон" });
            this.setState({ districtError: false });
        }

        if (!year) {
            this.setState({ yearLabel: "Год постройки" });
            this.setState({ yearError: false });
        }

        if (!walls) {
            this.setState({ wallsLabel: "Тип стен" });
            this.setState({ wallsError: false });
        }

        if (!floor && !numberOfFloors) {
            if (+this.state.floor > +this.state.numberOfFloors) {
                this.setState({ floorLabel: "Этаж больше чем этажность здания" });
                this.setState({ floorError: true });
                floor = true;
            }
        }

        return (livingArea || kitchenArea || numberOfRooms || floor || numberOfFloors || district || year || walls);
    }

    handleChange(event) {
        if (event.target.id === undefined) {
            if (event.target.value === 'Блок' || event.target.value === 'Шлакоблок' || event.target.value === 'Газобетон' || event.target.value === 'Монолит' || event.target.value === 'Панель' || event.target.value === 'Кирпич') {
                this.setState({ walls: event.target.value });
            } else {
                this.setState({ district: event.target.value });
            }
        } else {
            this.setState({
                [event.target.id]: event.target.value
            });
        }
    }

    getDistrictValue(distr) {
        switch (distr) {
            case 'Центр':
            case 'Разгуляй':
                return '1000000';
            case 'Данилиха':
            case 'Парковый':
            case 'Плоский':
            case 'Светлый':
            case 'Новоплоский':
            case 'Городские горки':
            case 'Садовый':
            case 'Громовский':
            case 'Зелёное хозяйство':
            case 'Островский':
            case 'Свердловский':
                return '0100000';
            case 'Балатово':
            case 'Комплекс ПГТУ':
            case 'Ива':
            case 'Рабочий посёлок':
            case 'Юбилейный':
                return '0010000';
            case 'Акулова':
            case 'Железнодорожный':
            case 'Комсомольский':
            case 'Пролетарский':
            case 'Ераничи':
            case 'Нагорный':
            case 'Верхняя курья':
            case 'Висим':
            case 'Запруд':
            case 'Владимирский':
            case 'Краснова':
            case 'Крохалева':
            case 'Южный':
                return '0001000';
            case 'Заостровка':
            case 'Нижняя курья':
            case 'Новые водники':
            case 'Старые водники':
            case 'Судозаводский':
            case 'Вышка 2':
            case 'Верхние Муллы':
            case 'Закамск':
            case 'Октябрьский':
            case 'Гайва':
            case 'Домостроительный':
            case 'КамГЭС':
            case 'Камский':
            case 'Кислотные дачи':
            case 'Левшино':
            case 'Молодёжный':
            case 'Чапаевский':
            case 'Энергетик':
            case 'Липовая гора':
            case 'Ремзавод':
            case 'Первомайский':
                return '0000010';
            case 'Хмели':
            case 'Крым':
            case 'Бумкомбинат':
            case 'Голованово':
            case 'Заозерье':
            case 'Новые ляды':
            case 'Чусовской водозабор':
                return '0000001';
        }
    }

    render() {
        const { classes, isLoading, price } = this.props;
        const { data } = this.state;

        const distr = [
            { value: 'Центр', label: 'Центр' }, { value: 'Разгуляй', label: 'Разгуляй' },
            { value: 'Данилиха', label: 'Данилиха' }, { value: 'Парковый', label: 'Парковый' },
            { value: 'Плоский', label: 'Плоский' }, { value: 'Светлый', label: 'Светлый' },
            { value: 'Новоплоский', label: 'Новоплоский' }, { value: 'Городские горки', label: 'Городские горки' },
            { value: 'Садовый', label: 'Садовый' }, { value: 'Громовский', label: 'Громовский' },
            { value: 'Зелёное хозяйство', label: 'Зелёное хозяйство' }, { value: 'Островский', label: 'Островский' },
            { value: 'Свердловский', label: 'Свердловский' },
            { value: 'Балатово', label: 'Балатово' }, { value: 'Комплекс ПГТУ', label: 'Комплекс ПГТУ' },
            { value: 'Ива', label: 'Ива' }, { value: 'Рабочий посёлок', label: 'Рабочий посёлок' },
            { value: 'Юбилейный', label: 'Юбилейный' },
            { value: 'Акулова', label: 'Акулова' }, { value: 'Железнодорожный', label: 'Железнодорожный' },
            { value: 'Комсомольский', label: 'Комсомольский' }, { value: 'Пролетарский', label: 'Пролетарский' },
            { value: 'Ераничи', label: 'Ераничи' }, { value: 'Нагорный', label: 'Нагорный' },
            { value: 'Верхняя курья', label: 'Верхняя курья' }, { value: 'Висим', label: 'Висим' },
            { value: 'Запруд', label: 'Запруд' }, { value: 'Владимирский', label: 'Владимирский' },
            { value: 'Краснова', label: 'Краснова' }, { value: 'Крохалева', label: 'Крохалева' },
            { value: 'Южный', label: 'Южный' },
            { value: 'Заостровка', label: 'Заостровка' }, { value: 'Нижняя курья', label: 'Нижняя курья' },
            { value: 'Новые водники', label: 'Новые водники' }, { value: 'Старые водники', label: 'Старые водники' },
            { value: 'Судозаводский', label: 'Судозаводский' }, { value: 'Вышка 2', label: 'Вышка 2' },
            { value: 'Верхние Муллы', label: 'Верхние Муллы' }, { value: 'Закамск', label: 'Закамск' },
            { value: 'Октябрьский', label: 'Октябрьский' }, { value: 'Гайва', label: 'Гайва' },
            { value: 'Домостроительный', label: 'Домостроительный' }, { value: 'КамГЭС', label: 'КамГЭС' },
            { value: 'Камский', label: 'Камский' }, { value: 'Кислотные дачи', label: 'Кислотные дачи' },
            { value: 'Левшино', label: 'Левшино' }, { value: 'Молодёжный', label: 'Молодёжный' },
            { value: 'Чапаевский', label: 'Чапаевский' }, { value: 'Энергетик', label: 'Энергетик' },
            { value: 'Липовая гора', label: 'Липовая гора' }, { value: 'Ремзавод', label: 'Ремзавод' },
            { value: 'Первомайский', label: 'Первомайский' },
            { value: 'Хмели', label: 'Хмели' }, { value: 'Крым', label: 'Крым' },
            { value: 'Бумкомбинат', label: 'Бумкомбинат' }, { value: 'Голованово', label: 'Голованово' },
            { value: 'Заозерье', label: 'Заозерье' }, { value: 'Новые ляды', label: 'Новые ляды' },
            { value: 'Чусовской водозабор', label: 'Чусовской водозабор' }
        ];
        const walls = [
            { value: 'Блок', label: 'Блок' }, { value: 'Шлакоблок', label: 'Шлакоблок' }, { value: 'Газобетон', label: 'Газобетон' },
            { value: 'Монолит', label: 'Монолит' }, { value: 'Панель', label: 'Панель' }, { value: 'Кирпич', label: 'Кирпич' }];

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
                        <Grid item xs={5}>
                            <Grid container className={classes.cellFirst} justify="flex-end" alignContent="center">
                                <Grid item xs>
                                    <Typography>Ставка рефинансирования: <b>{data.refinancingRate}</b></Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.cell} justify="flex-end" alignContent="center">
                                <Grid item xs>
                                    <Typography>Средняя зарплата: <b>{data.averageSalary}</b></Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.cell} justify="flex-end" alignContent="center">
                                <Grid item xs>
                                    <Typography>ВВП России: <b>{data.gdp}</b></Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.cell} justify="flex-end" alignItems="center" alignContent="center">
                                <Grid item xs>
                                    <Typography>РТС: <b>{data.rts}</b></Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.cell} justify="flex-end" alignItems="center" alignContent="center">
                                <Grid item xs>
                                    <Typography>Стоимость доллара: <b>{data.dollarPrice}</b></Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.cell} justify="flex-end" alignItems="center" alignContent="center">
                                <Grid item xs>
                                    <Typography>Стоимость нефти: <b>{data.brentPrice}</b></Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.cell} justify="flex-end" alignItems="center" alignContent="center">
                                <Grid item xs>
                                    <Typography>Ввод жилья: <b>{data.estateBuilding}</b></Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.cell} justify="flex-end" alignItems="center" alignContent="center">
                                <Grid item xs>
                                    <Typography>Выданные кредиты: <b>{data.creditsAmount}</b></Typography>
                                </Grid>
                            </Grid>
                            <Grid container justify="flex-end" alignItems="center" alignContent="center">
                                <Grid item xs>
                                    <Button variant="contained" color="primary" onClick={() => this.submitHandler()}> Рассчитать </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={7}>
                            <TextField
                                id="livingArea"
                                autoFocus
                                label={this.state.livingAreaLabel}
                                value={this.state.livingArea}
                                onChange={(e) => this.handleChange(e)}
                                error={this.state.livingAreaError}
                                margin="normal"
                                InputProps={{
                                    inputComponent: AreaMask
                                }}
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
                                InputProps={{
                                    inputComponent: AreaMask
                                }}
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
                                InputProps={{
                                    inputComponent: RoomsMask
                                }}
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
                                InputProps={{
                                    inputComponent: FloorMask
                                }}
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
                                InputProps={{
                                    inputComponent: FloorMask
                                }}
                                fullWidth
                            />
                            <TextField
                                id="district"
                                select
                                autoFocus
                                label={this.state.districtLabel}
                                value={this.state.district}
                                onChange={(e) => this.handleChange(e)}
                                error={this.state.districtError}
                                margin="normal"
                                fullWidth
                            >
                                {distr.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0)).map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id="year"
                                autoFocus
                                label={this.state.yearLabel}
                                value={this.state.year}
                                onChange={(e) => this.handleChange(e)}
                                error={this.state.yearError}
                                margin="normal"
                                InputProps={{
                                    inputComponent: YearMask
                                }}
                                fullWidth
                            />
                            <TextField
                                id="walls"
                                select
                                autoFocus
                                label={this.state.wallsLabel}
                                value={this.state.walls}
                                onChange={(e) => this.handleChange(e)}
                                error={this.state.wallsError}
                                margin="normal"
                                fullWidth
                            >
                                {walls.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0)).map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Typography className={classes.result} variant="h6">Стоимость квартиры (руб): {price === 0 ? 'Н/Д' : parseInt(price, 10)}</Typography>
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
