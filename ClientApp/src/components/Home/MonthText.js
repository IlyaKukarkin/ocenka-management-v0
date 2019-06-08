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
    month: {
        paddingRight: '20px',
        paddingLeft: '20px'
    }
});

const text = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const MonthText = props => (
    <Typography className={props.classes.month}>
        {text[props.textIndex]}
    </Typography>
);

export default withStyles(styles)(connect()(MonthText));
