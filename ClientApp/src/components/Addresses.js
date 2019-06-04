import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/AddressReducer';
import TableCardLayout from './TableCardLayout';
import MyTableHead from './TableHead';
import TableToolbar from './TableToolbar';
import DeleteDialog from './DeleteDialog';
import AddAddressDialog from './AddAddressDialog';
import CreateFileDialog from './CreateFileDialog';
import ErrorFileDialog from './ErrorFileDialog';
import ErrorExportDialog from './ErrorExportDialog';
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
    { id: 'city', numeric: false, disablePadding: true, label: '0' },
    { id: 'district', numeric: false, disablePadding: true, label: '1' },
    { id: 'street', numeric: false, disablePadding: true, label: '2' },
    { id: 'house', numeric: true, disablePadding: true, label: '3' },
    { id: 'numberOfFlat', numeric: true, disablePadding: true, label: '4' },
];

class Address extends Component {
    constructor(props) {
        super(props);

        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.showDeleteDialog = this.showDeleteDialog.bind(this);
        this.showAddDialog = this.showAddDialog.bind(this);
        this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
        this.handleAddClick = this.handleAddClick.bind(this);
        this.closeAddDialog = this.closeAddDialog.bind(this);
        this.closeFileDialog = this.closeFileDialog.bind(this);
        this.closeErrorFileDialog = this.closeErrorFileDialog.bind(this);
        this.closeErrorExportDialog = this.closeErrorExportDialog.bind(this);
        this.handleExcelClick = this.handleExcelClick.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
    }

    state = {
        order: 'asc',
        orderBy: 'city',
        selected: [],
        data: this.props.addresses,
        page: 0,
        search: '',
        emptyRows: 0,
        rowsPerPage: 5,
        showDeleteDialog: false,
        showAddDialog: false,
        showErrorExportDialog: false,
        editAddress: {
            id: '',
            city: '',
            district: '',
            street: '',
            house: '',
            numberOfFlat: '',
        }
    };

    componentWillMount() {
        this.props.GetAddressSet();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.addresses !== nextProps.addresses) {
            this.setState({ data: nextProps.addresses });
            const emptyRows = this.state.rowsPerPage - Math.min(this.state.rowsPerPage, nextProps.addresses.length - this.state.page * this.state.rowsPerPage);
            this.setState({ emptyRows: emptyRows });
        }
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
        this.props.ClearEditAddress();

        this.setState({ showAddDialog: true });
    }

    closeDeleteDialog = () => {
        this.setState({ showDeleteDialog: false });
    }

    closeAddDialog = () => {
        this.props.ClearEditAddress();

        this.setState({ showAddDialog: false });
    }

    handleEditClick = (data) => {
        this.props.ClearEditAddress();

        this.props.EditAddressSet(data);

        this.setState({ showAddDialog: false });
    }

    startEditClick = (event, id) => {
        let address = this.findAddress(id);

        let getAddress = this.props.StartEditAddress(address);

        getAddress.then((user) => {
            this.setState({ showAddDialog: true });
        });
    }

    findAddress = (id) => {
        for (let i = 0; i < this.props.addresses.length; i++) {
            if (this.props.addresses[i].id === id) {
                return this.props.addresses[i];
            }
        }
    }

    handleSearchChange = (value) => {
        this.setState({ search: value });
        const emptyRows = this.state.rowsPerPage - Math.min(this.state.rowsPerPage, this.state.data.length - this.state.page * this.state.rowsPerPage);
        this.setState({ emptyRows: emptyRows });
    }

    handleExcelClick = () => {
        if (this.state.selected.length !== 0) {
            const res = { ids: this.state.selected };
            this.props.ToExcel(res);
        } else {
            this.setState({ showErrorExportDialog: true });
        }
    }

    closeErrorExportDialog = () => {
        this.setState({ showErrorExportDialog: false });
    }

    closeFileDialog = () => {
        this.props.ToExcelClose();
    }

    closeErrorFileDialog = () => {
        this.props.ToExcelErrorClose();
    }

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const { classes, isLoading, fileSaved, fileError, editAddress } = this.props;
        const { data, order, orderBy, selected, rowsPerPage, page, emptyRows, search, showAddDialog, showDeleteDialog, showErrorExportDialog } = this.state;

        return (
            <TableCardLayout headerIndex={0} isLoading={isLoading} onSearchChange={this.handleSearchChange.bind(this)} excelClick={this.handleExcelClick.bind(this)} deleteToolbar={<TableToolbar numSelected={selected.length} deleteClick={this.showDeleteDialog.bind(this)} />} addClick={this.showAddDialog.bind(this)} >
                <DeleteDialog header={0} onDeleteAction={this.handleDeleteClick.bind(this)} onCancelAction={this.closeDeleteDialog.bind(this)} showDialog={showDeleteDialog} />
                <AddAddressDialog onAddAction={this.handleAddClick.bind(this)} onEditAction={this.handleEditClick.bind(this)} onCancelAction={this.closeAddDialog.bind(this)} showDialog={showAddDialog} editAddress={editAddress} />
                <CreateFileDialog onCancelAction={this.closeFileDialog.bind(this)} showDialog={fileSaved} header={2} />
                <ErrorFileDialog onCancelAction={this.closeErrorFileDialog.bind(this)} showDialog={fileError} header={2} />
                <ErrorExportDialog onCancelAction={this.closeErrorExportDialog.bind(this)} showDialog={showErrorExportDialog} header={2} />
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
                                    .filter(adr => adr.city.includes(search) || adr.district.includes(search) || adr.street.includes(search) || adr.house.toString().includes(search) || adr.numberOfFlat.toString().includes(search))
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
                                                <TableCell align="center" className={classes.cell}>{n.city}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{n.district}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{n.street}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{n.house}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{n.numberOfFlat}</TableCell>
                                                <TableCell align="center" className={classes.narrowCell}>{<IconButton onClick={event => this.startEditClick(event, n.id)}>
                                                    <Edit fontSize="small" />
                                                </IconButton>}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 52.8 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.filter(adr => adr.city.includes(search) || adr.district.includes(search) || adr.street.includes(search) || adr.house.toString().includes(search) || adr.numberOfFlat.toString().includes(search)).length}
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
    state => state.address,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Address));
