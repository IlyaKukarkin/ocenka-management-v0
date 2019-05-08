import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../../store/AppraiserReducer';
import TableCardLayout from '../TableCardLayout';
import MyTableHead from '../TableHead';
import TableToolbar from '../TableToolbar';
import DeleteDialog from '../DeleteDialog';
import AddAppraiserDialog from './AddAppraiserDialog';
import { withStyles } from '@material-ui/core/styles';
import {
    Table, TableCell, TableRow, TableBody, TablePagination, IconButton, Checkbox
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

const rows = [
    { id: 'idNavigation.surname', numeric: false, label: '5' },
    { id: 'idNavigation.name', numeric: false, label: '6' },
    { id: 'idNavigation.patronymic', numeric: false, label: '7' },
    { id: 'idNavigation.birthday', numeric: false, label: '8' },
    { id: 'idNavigation.worksSince', numeric: false, label: '9' },
    { id: 'position', numeric: false, label: '10' },
];

class Appraisers extends Component {
    constructor(props) {
        super(props);

        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.showDeleteDialog = this.showDeleteDialog.bind(this);
        this.showAddDialog = this.showAddDialog.bind(this);
        this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
        this.handleAddClick = this.handleAddClick.bind(this);
        this.closeAddDialog = this.closeAddDialog.bind(this);
    }

    state = {
        order: 'asc',
        orderBy: 'idNavigation.surname',
        selected: [],
        data: [],
        page: 0,
        rowsPerPage: 5,
        showDeleteDialog: false,
        showAddDialog: false,
    };

    componentWillMount() {
        this.props.GetAppraisersSet();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.appraisers !== nextProps.appraisers)
            this.setState({ data: nextProps.appraisers });
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({ selected: state.data.map(n => n.id) }));
            return;
        }
        this.setState({ selected: [] });
    };

    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({ selected: newSelected });
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    handleDeleteClick = () => {
        const { DeleteAddressSet, DeleteAddressesSet } = this.props;

        this.setState({ showDeleteDialog: false });
        if (this.state.selected.length === 1) {
            DeleteAddressSet(this.state.selected[0]);
        } else {
            DeleteAddressesSet(this.state.selected);
        }
        this.setState({ selected: [] });
    }

    handleAddClick = (data) => {
        this.props.AddAddressSet(data);

        this.setState({ showAddDialog: false });
    }

    showDeleteDialog = () => {
        this.setState({ showDeleteDialog: true });
    }

    showAddDialog = () => {
        this.setState({ showAddDialog: true });
    }

    closeDeleteDialog = () => {
        this.setState({ showDeleteDialog: false });
    }

    closeAddDialog = () => {
        this.setState({ showAddDialog: false });
    }

    handleEditClick = (event, id) => {
        console.dir(id);
    }

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const { classes, isLoading } = this.props;
        const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return (
            <TableCardLayout headerIndex={1} isLoading={isLoading} deleteToolbar={<TableToolbar numSelected={selected.length} deleteClick={this.showDeleteDialog.bind(this)} />} addClick={this.showAddDialog.bind(this)} >
                <DeleteDialog header={1} onDeleteAction={this.handleDeleteClick.bind(this)} onCancelAction={this.closeDeleteDialog.bind(this)} showDialog={this.state.showDeleteDialog} />
                <AddAppraiserDialog onAddAction={this.handleAddClick.bind(this)} onCancelAction={this.closeAddDialog.bind(this)} showDialog={this.state.showAddDialog} />
                <div style={{ width: "100%" }}>
                    <div className={classes.tableWrapper}>

                        <Table className={classes.table}>
                            <MyTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                rowCount={data.length}
                                rows={rows}
                            />
                            <TableBody>
                                {stableSort(data, getSorting(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map(n => {
                                        const isSelected = this.isSelected(n.id);
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                aria-checked={isSelected}
                                                tabIndex={-1}
                                                key={n.id}
                                                selected={isSelected}
                                            >
                                                <TableCell padding="none" className={classes.narrowCell}>
                                                    <Checkbox onClick={event => this.handleClick(event, n.id)} checked={isSelected} color="primary"/>
                                                </TableCell>
                                                <TableCell align="center" className={classes.cell}>{n.idNavigation.surname}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{n.idNavigation.name}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{n.idNavigation.patronymic}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{getDate(n.idNavigation.birthday)}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{getYear(n.idNavigation.worksSince)}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{n.position}</TableCell>
                                                <TableCell align="center" className={classes.narrowCell}>{<IconButton onClick={event => this.handleEditClick(event, n.id)}>
                                                    <Edit fontSize="small" />
                                                </IconButton>}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 52.8 * emptyRows }}>
                                        <TableCell colSpan={8} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                            'aria-label': 'Previous Page',
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'Next Page',
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </div>
            </TableCardLayout>
        );
    }
}

function getDate(date) {
    let result = "";

    result = date.substring(8, 10) + "." + date.substring(5, 7) + "." + date.substring(0, 4);

    return result;
}

function getYear(date) {
    let result = "";

    result = date.substring(0, 4);

    return result;
}

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

export default withStyles(styles)(connect(
    state => state.appraisers,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Appraisers));