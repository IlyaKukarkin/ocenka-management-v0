import React, { Component, Fragment } from 'react';
import {
    Card, CardContent, Typography, CssBaseline
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';

const styles = theme => ({
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
})

class TableCardLayout extends Component {

    render() {
        const { classes, children } = this.props;

        return <Fragment>
            <CssBaseline />

            <Card className={classes.card}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Word of the Day
                    </Typography>
                    {children}
                </CardContent> 
            </Card>
        </Fragment>
    }
}

export default compose(
    withStyles(styles)
)(TableCardLayout);