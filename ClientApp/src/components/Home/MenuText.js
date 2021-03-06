﻿import React from 'react';
import { connect } from 'react-redux';
import {
    Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    header: {
        marginBottom: '40px'
    },
    loginInfo: {
        marginBottom: '25px',
    },
    body: {
        marginBottom: '45px',
    },
});

const text = [
    'Главная', 'Договоры', 'Физ. лица', 'Договоры', 'Оценщики', 'Нейросеть', 'Пользователи', 'Зарплата', 'Настройки нейросети',
    'Адреса', 'Квартиры', 'Автомобили', 'Участки', 'Юр. лица', 'Настройки зарплаты'
];

const MenuText = props => (
    <Typography>
        {text[props.textIndex]}
    </Typography>
);

export default withStyles(styles)(connect()(MenuText));
