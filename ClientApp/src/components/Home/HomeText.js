import React from 'react';
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

const text = ['Добро пожаловать!', 'Для доступа к функциям системы необходимо авторизоваться.', 'Возможности системы:', 'Сохранять информацию о договорах и клентах компании',
    'Осуществлять поиск по базе данных', 'Экспортировать данные в файл Эксель', 'Оценивать стоимость квартиры с помощью нейросети', 'Выполнил: студент группы ПИ-15-1 -',
    ' Кукаркин Илья Андреевич', 'Руководитель: к.ф.- м.н., доцент кафедры информационных технологий в бизнесе -', ' Сухов Александр Олегович'];

const HomeText = props => (
    <div>
        <Typography component={'span'} variant="h4" className={props.classes.header}>
            {text[0]}
        </Typography>
        <Typography component={'span'} variant="body1" className={props.classes.loginInfo}>
            <strong>{text[1]}</strong>
        </Typography>
        <Typography component={'span'} variant="body1" className={props.classes.body}>
            {text[2]}
            <ul>
                <li>{text[3]}</li>
                <li>{text[4]}</li>
                <li>{text[5]}</li>
                <li>{text[6]}</li>
            </ul>  
        </Typography>
        <Typography component={'span'} variant="body1">
            <p>{text[7]}<strong>{text[8]}</strong></p>
            <p>{text[9]}<strong>{text[10]}</strong></p>
        </Typography>
    </div>
);

export default withStyles(styles)(connect()(HomeText));
