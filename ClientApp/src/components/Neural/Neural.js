import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../../store/NeuralReducer';
import { withStyles } from '@material-ui/core/styles';
import {
    Grid, TextField, Button
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';

const styles = theme => ({
    table: {
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    progress: {
        margin: theme.spacing.unit * 2
    },
    narrowCell: {
        width: '30px'
    },
    cell: {
        padding: '0',
        maxWidth: '125px',
        whiteSpace: "normal",
        wordWrap: "break-word"
    }
});

class Neural extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        calculating: true,
        data: [],
        price: 0
    };

    componentWillMount() {
        this.props.GetSettings();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.settings !== nextProps.settings)
            this.setState({ data: nextProps.settings[0] });
    }

    handleCalculateClick = () => {
        console.dir('Calculate!');
    }

    render() {
        const { classes, isLoading } = this.props;
        const { data, price } = this.state;

        return (
            <div>
                <Grid container spacing={24} justify="center" alignItems="center">
                    <Grid item xs={6} justify="center" alignItems="center" alignContent="center">
                        <TextField
                            id="refinancingRate"
                            label="Ставка рефинансирования"
                            value={this.state.data.refinancingRate}
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            InputProps={{
                                readOnly: true,
                            }}
                            id="averageSalary"
                            label="Disabled"
                            value="7.5"
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            InputProps={{
                                readOnly: true,
                            }}
                            id="gdp"
                            label="Disabled"
                            value="Hello World"
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            InputProps={{
                                readOnly: true,
                            }}
                            id="rts"
                            label="Disabled"
                            value="Hello World"
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            InputProps={{
                                readOnly: true,
                            }}
                            id="dollarPrice"
                            label="Disabled"
                            value="Hello World"
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            InputProps={{
                                readOnly: true,
                            }}
                            id="brentPrice"
                            label="Disabled"
                            value="Hello World"
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            InputProps={{
                                readOnly: true,
                            }}
                            id="estateBuilding"
                            label="Disabled"
                            value="Hello World"
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            InputProps={{
                                readOnly: true,
                            }}
                            id="creditsAmount"
                            label="Disabled"
                            value="Hello World"
                            margin="normal"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6} justify="center" alignItems="center" alignContent="center">
                        <TextField
                            id="standard-disabled"
                            label="Disabled"
                            defaultValue="Hello World"
                            className={classes.textField}
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            id="standard-disabled"
                            label="Disabled"
                            defaultValue="Hello World"
                            className={classes.textField}
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            id="standard-disabled"
                            label="Disabled"
                            defaultValue="Hello World"
                            className={classes.textField}
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            id="standard-disabled"
                            label="Disabled"
                            defaultValue="Hello World"
                            className={classes.textField}
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            id="standard-disabled"
                            label="Disabled"
                            defaultValue="Hello World"
                            className={classes.textField}
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            id="standard-disabled"
                            label="Disabled"
                            defaultValue="Hello World"
                            className={classes.textField}
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            id="standard-disabled"
                            label="Disabled"
                            defaultValue="Hello World"
                            className={classes.textField}
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            id="standard-disabled"
                            label="Disabled"
                            defaultValue="Hello World"
                            className={classes.textField}
                            margin="normal"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        
                    </Grid>
                    <Grid item xs={3}>
                        <Button> Рассчитать </Button>
                    </Grid>
                    <Grid item xs={3}>
                        
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(connect(
    state => state.neural,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Neural));
