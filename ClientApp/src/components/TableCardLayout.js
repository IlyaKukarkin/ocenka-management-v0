import React, { Component, Fragment } from 'react';
import {
    Card, CardContent, Typography, CssBaseline, Grid, Button, CircularProgress
} from '@material-ui/core';
import { Add, SaveAlt } from '@material-ui/icons';
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
    header: {
        width: '100%',
        marginBottom: 12,
    },
    content: {
        width: '100%',        
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    progress: {
        margin: theme.spacing.unit * 2
    },
    loading: {
        height: '400px',
        marginUp: '180px'
    }
})

const headers = ["Адреса", "Оценщики"];

class TableCardLayout extends Component {

    render() {
        const { classes, children, headerIndex, isLoading, header, addClick } = this.props;

        return <Fragment>
            <CssBaseline />

            <Card className={classes.card}>
                <CardContent>
                    <div className={classes.header}>
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                        >
                            <Grid item xs>
                                <Typography variant="h5" style={{ marginLeft: '40px' }}>
                                    <b>{headers[headerIndex]}</b>
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                {header}
                            </Grid>
                            <Grid container xs justify="flex-end">
                                <Button color="primary" onClick={addClick}>
                                    <Add className={classes.leftIcon} />
                                    Добавить
                                </Button>
                                <Button color="secondary">
                                    <SaveAlt className={classes.leftIcon} />
                                    В Эксель
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                    <div className={classes.content}>
                        {isLoading ? <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                            className={classes.loading}
                        >
                            <CircularProgress className={classes.progress} />
                        </Grid> :
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                            >
                                {children}
                            </Grid>}
                    </div>                    
                </CardContent>
            </Card>
        </Fragment>
    }
}

export default compose(
    withStyles(styles)
)(TableCardLayout);