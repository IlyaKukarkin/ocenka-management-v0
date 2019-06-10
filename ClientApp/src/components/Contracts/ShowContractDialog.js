import React from 'react';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Typography
} from '@material-ui/core';

const styles = theme => ({
    progress: {
        margin: theme.spacing.unit * 2
    },
    dialog: {
        minWidth: '550px'
    }
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class ShowContractDialog extends React.Component {
    constructor(props) {
        super(props);

        this.myHandleClose = this.myHandleClose.bind(this);
    }

    myHandleClose() {
        this.props.onCancelAction();
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

    getAddress = (str, house, flat) => {
        let res = '';

        res = 'ул. ' + str + ', д. ' + house + ', кв. ' + flat;

        return res;
    }

    makeCadastral = (number) => {
        let res = '';

        res = number.substring(0, 2) + ':' + number.substring(2, 4) + ':' + number.substring(4, 11) + ':' + number.substring(11, 13);

        return res;
    }

    render() {
        const { showDialog, Contract, classes } = this.props;

        if (Contract.client === undefined) {
            return (<div/>);
        } else {

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
                        Договор - подробно
                </DialogTitle>
                    <DialogContent className={classes.dialog}>
                        <Typography component={'span'} variant="body1">
                            Договор
                        <ul>
                                <li>Сумма договора: {Contract.contractSumm} руб.</li>
                                <li>Аванс: {Contract.prepaid} руб.</li>
                                <li>Дата начала: {this.convertData(Contract.startDate)}</li>
                                <li>Дата окончания: {this.convertData(Contract.finishDate)}</li>
                            </ul>
                        </Typography>
                        <Typography component={'span'} variant="body1">
                            Клиент
                        {Contract.clientType === 'Indiv' ?
                                <ul>
                                    <li>Фамилия: {Contract.client.surname}</li>
                                    <li>Имя: {Contract.client.name}</li>
                                    <li>Отчество: {Contract.client.patronymic}</li>
                                </ul> :
                                <ul>
                                    <li>Название компании: {Contract.client.companyName}</li>
                                    <li>Эл. почта: {Contract.client.mailAddress}</li>
                                    <li>Счёт для оплаты: {Contract.client.paymentAccount}</li>
                                </ul>
                            }
                        </Typography>
                        <Typography component={'span'} variant="body1">
                            Объект оценки
                        {Contract.objectType === 'Flat' ?
                                <ul>
                                    <li>Кадастровый номер: {this.makeCadastral(Contract.object.cadastralNumber.toString())}</li>
                                    <li>Цель оценки: {Contract.object.aimOfEvaluation}</li>
                                    <li>Площадь: {Contract.object.area}</li>
                                    <li>Кол-во комнат: {Contract.object.numberOfRooms}</li>
                                    <li>Этаж: {Contract.object.floor}</li>
                                    <li>Адрес: {this.getAddress(Contract.object.street, Contract.object.house, Contract.object.numberOfFlat)}</li>
                                </ul> :
                                Contract.objectType === 'Car' ?
                                    <ul>
                                        <li>Кадастровый номер: Нет</li>
                                        <li>Цель оценки: {Contract.object.aimOfEvaluation}</li>
                                        <li>Марка: {Contract.object.mark}</li>
                                        <li>Модель: {Contract.object.model}</li>
                                        <li>Номер: {Contract.object.licenseNumber}</li>
                                    </ul> :
                                    <ul>
                                        <li>Кадастровый номер: {this.makeCadastral(Contract.object.cadastralNumber.toString())}</li>
                                        <li>Цель оценки: {Contract.object.aimOfEvaluation}</li>
                                        <li>Площадь: {Contract.object.area}</li>
                                        <li>Тип использования: {Contract.object.usageType}</li>
                                    </ul>
                            }
                        </Typography>
                        <Typography component={'span'} variant="body1">
                            Оценщик
                        <ul>
                                <li>Фамилия: {Contract.appraiser.surname}</li>
                                <li>Имя: {Contract.appraiser.name}</li>
                                <li>Отчество: {Contract.appraiser.patronymic}</li>
                                <li>Категория: {Contract.appraiser.position}</li>
                            </ul>
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.myHandleClose} color="primary">
                            Закрыть
                    </Button>
                    </DialogActions>
                </Dialog>
            );
        }
    }
}

export default compose(
    withStyles(styles)
)(ShowContractDialog);