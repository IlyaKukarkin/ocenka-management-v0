import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/AddressReducer';
import TableCardLayout from './TableCardLayout';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    progress: {
        margin: theme.spacing.unit * 2
    }
});

class Address extends Component {
    componentWillMount() {
        // This method runs when the component is first added to the page
        this.props.GetAddressSet();
    }

    componentWillReceiveProps(nextProps) {
        // This method runs when incoming props (e.g., route params) change
        //this.props.requestWeatherForecasts(startDateIndex);
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <TableCardLayout>
                    {this.props.isLoading ? <CircularProgress className={classes.progress} /> : renderForecastsTable(this.props)}
                </TableCardLayout>
            </div>
        );
    }
}

function renderForecastsTable(props) {
    return (
        <table className='table'>
            <thead>
                <tr>
                    <th>City</th>
                    <th>District</th>
                    <th>Street</th>
                    <th>House</th>
                    <th>Flat</th>
                </tr>
            </thead>
            <tbody>
                {props.addresses.map(address =>
                    <tr key={address.id}>
                        <td>{address.city}</td>
                        <td>{address.district}</td>
                        <td>{address.street}</td>
                        <td>{address.house}</td>
                        <td>{address.numberOfFlat}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default withStyles(styles)(connect(
    state => state.address,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Address));
