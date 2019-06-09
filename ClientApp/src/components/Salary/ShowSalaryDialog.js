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

class ShowSalaryDialog extends React.Component {
    constructor(props) {
        super(props);

        this.myHandleClose = this.myHandleClose.bind(this);
    }

    myHandleClose() {
        this.props.onCancelAction();
    }

    render() {
        const { showDialog, Salary, classes } = this.props;

        if (Salary.salary === '') {
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
                        Зарплата - подробно
                </DialogTitle>
                    <DialogContent className={classes.dialog}>
                        <Typography component={'span'} variant="body1">
                            Оценщик
                        <ul>
                                <li>Фамилия: {Salary.surname}</li>
                                <li>Имя: {Salary.name}</li>
                                <li>Отчество: {Salary.patronymic}</li>
                                <li>Выполнил договоров: {Salary.contractsCount}</li>
                                <li>Зарплата: {Salary.salary} руб.</li>
                            </ul>
                        </Typography>
                        <Typography component={'span'} variant="body1">
                            Автомобили
                            {Salary.contractsCar.length !== 0 ?
                                renderContracts(Salary.contractsCar)
                                 :
                                <ul>
                                    <li>Нет</li>
                                </ul>
                            }
                        </Typography>
                        <Typography component={'span'} variant="body1">
                            Квартиры
                            {Salary.contractsFlat.length !== 0 ?
                                renderContracts(Salary.contractsFlat)
                                :
                                <ul>
                                    <li>Нет</li>
                                </ul>
                            }
                        </Typography>
                        <Typography component={'span'} variant="body1">
                            Участки
                            {Salary.contractsParcel.length !== 0 ?
                                renderContracts(Salary.contractsParcel)
                                :
                                <ul>
                                    <li>Нет</li>
                                </ul>
                            }
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

function renderContracts(contracts) {
    return contracts.map((contract, index) => (
        <Contract key={index} contract={contract} />
    ));
}

const convertData = (data) => {
    let res = '';
    let year, m, d;

    year = data.substring(0, 4);
    m = data.substring(5, 7);
    d = data.substring(8, 10);

    res = d + '/' + m + '/' + year;

    return res;
}

const Contract = ({ contract }) => {
    return (
        <ul>
            <li>Сумма договора: {contract.contractSumm}</li>
            <li>Дата начала: {convertData(contract.startDate)}</li>
            <li>Дата окончания: {convertData(contract.finishDate)}</li>
        </ul>
    );
};

export default compose(
    withStyles(styles)
)(ShowSalaryDialog);