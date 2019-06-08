import React, { Component, Fragment } from 'react';
import {
    Card, CardContent, Typography, CssBaseline, Grid, Button, CircularProgress, IconButton, Input, ClickAwayListener
} from '@material-ui/core';
import { Add, SaveAlt, Search } from '@material-ui/icons';
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
    },
    buttons: {
        minWidth: '224px'
    },
    search: {
        maxWidth: '130px',
        paddingLeft: '5px'
    }
})

const headers = ["Адреса", "Оценщики", "Пользователи", "Клиенты", "Квартиры", "Договоры", "Зарплата", "Участки", "Автомобили"];

class TableCardLayout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSearchbar: false,
            searchValue: "",
        };
    }

    showSearchbar = () => {
        this.setState({ showSearchbar: true });
    }

    hideSearchbar = () => {
        this.setState({ showSearchbar: false });
    }

    handleChange = event => {
        this.setState({ searchValue: event.target.value });
        this.props.onSearchChange(event.target.value);
    };

    render() {
        const { classes, children, headerIndex, isLoading, deleteToolbar, addClick, isPartial, excelClick, excelDisable } = this.props;
        const { showSearchbar } = this.state;

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
                                <Typography variant="h5">
                                    <b>{headers[headerIndex]}</b>
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                {!showSearchbar ? <IconButton onClick={this.showSearchbar} style={{ padding: '6px' }}>
                                    <Search fontSize="inherit" />
                                </IconButton> :
                                    <ClickAwayListener onClickAway={this.hideSearchbar}><Input placeholder="Поиск" onChange={this.handleChange} value={this.state.searchValue} id="search" className={classes.search} /></ClickAwayListener>}
                            </Grid>
                            <Grid item xs>
                                {!isPartial && deleteToolbar}
                            </Grid>
                            <Grid container xs justify="flex-end" className={classes.buttons}>
                                {
                                    !isPartial && <Button color="primary" onClick={addClick}>
                                    <Add className={classes.leftIcon} />
                                        Добавить
                                    </Button>
                                }
                                <Button color="secondary" onClick={excelClick} disabled={excelDisable}>
                                    <SaveAlt className={classes.leftIcon} />
                                    В Excel
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