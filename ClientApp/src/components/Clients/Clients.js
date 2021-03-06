import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../../store/ClientReducer';
import TableCardLayout from '../TableCardLayout';
import MyTableHead from '../TableHead';
import TableToolbar from '../TableToolbar';
import DeleteDialog from '../DeleteDialog';
import CreateFileDialog from '../CreateFileDialog';
import ErrorFileDialog from '../ErrorFileDialog';
import ErrorExportDialog from '../ErrorExportDialog';
import DeleteErrorDialog from '../DeleteErrorDialog';
import AddClientDialog from './AddClientDialog';
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
    { id: 'surname', numeric: false, label: '5' },
    { id: 'name', numeric: false, label: '6' },
    { id: 'patrinymic', numeric: false, label: '7' },
    { id: 'dateOfBirth', numeric: false, label: '8' },
    { id: 'street', numeric: false, label: '2' },
];

class Clients extends Component {
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
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.closeDeleteErrorDialog = this.closeDeleteErrorDialog.bind(this);
    }

    state = {
        order: 'asc',
        orderBy: 'surname',
        selected: [],
        data: [],
        page: 0,
        search: '',
        rowsPerPage: 5,
        showDeleteDialog: false,
        showAddDialog: false,
        showErrorExportDialog: false,
        editClient: {
            id: '',
            surname: '',
            name: '',
            patronymic: '',
            series: '',
            number: '',
            dateOfBirth: '',
            dateOfIssue: '',
            divisionCode: '',
            issuedBy: '',
            city: '',
            district: '',
            street: '',
            house: '',
            numberOfFlat: '',
        }
    };

    componentWillMount() {
        this.props.GetClientsSet();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.clients !== nextProps.clients) {
            this.setState({ data: nextProps.clients });
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
        const { DeleteClientSet, DeleteClientsSet } = this.props;

        this.setState({ showDeleteDialog: false });
        if (this.state.selected.length === 1) {
            DeleteClientSet(this.state.selected[0]);
        } else {
            DeleteClientsSet(this.state.selected);
        }
        this.setState({ selected: [] });
    }

    handleAddClick = (data) => {
        this.props.AddClientSet(data);

        this.setState({ showAddDialog: false });
    }

    handleEditClick = (data) => {
        this.props.ClearEditClient();

        this.props.EditClientSet(data);

        this.setState({ showAddDialog: false });
    }

    showDeleteDialog = () => {
        this.setState({ showDeleteDialog: true });
    }

    showAddDialog = () => {
        this.props.ClearEditClient();

        this.setState({ showAddDialog: true });
    }

    closeDeleteDialog = () => {
        this.setState({ showDeleteDialog: false });
    }

    closeAddDialog = () => {
        this.props.ClearEditClient();

        this.setState({ showAddDialog: false });
    }

    startEditClick = (event, id) => {
        let client = this.findClient(id);

        let getClient = this.props.GetEditClient(client);

        getClient.then((client) => {
            this.setState({ showAddDialog: true });
        });
    }

    findClient = (id) => {
        for (let i = 0; i < this.props.clients.length; i++) {
            if (this.props.clients[i].id === id) {
                return this.props.clients[i];
            }
        }
    }

    handleSearchChange = (value) => {
        this.setState({ search: value });
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

    closeDeleteErrorDialog = () => {
        this.props.DeleteErrorClose();
    }

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const { classes, isLoading, fileSaved, fileError, editClient, deleteError } = this.props;
        const { data, order, orderBy, selected, rowsPerPage, page, showAddDialog, showDeleteDialog, search, showErrorExportDialog } = this.state;

        return (
            <TableCardLayout id={"clnt"} headerIndex={3} isLoading={isLoading} onSearchChange={this.handleSearchChange.bind(this)} excelClick={this.handleExcelClick.bind(this)} deleteToolbar={<TableToolbar numSelected={selected.length} deleteClick={this.showDeleteDialog.bind(this)} />} addClick={this.showAddDialog.bind(this)} >
                <DeleteDialog header={3} onDeleteAction={this.handleDeleteClick.bind(this)} onCancelAction={this.closeDeleteDialog.bind(this)} showDialog={showDeleteDialog} />
                <AddClientDialog onAddAction={this.handleAddClick.bind(this)} onEditAction={this.handleEditClick.bind(this)} onCancelAction={this.closeAddDialog.bind(this)} showDialog={showAddDialog} editClient={editClient} />
                <CreateFileDialog onCancelAction={this.closeFileDialog.bind(this)} showDialog={fileSaved} header={3} />
                <ErrorFileDialog onCancelAction={this.closeErrorFileDialog.bind(this)} showDialog={fileError} header={3} />
                <ErrorExportDialog onCancelAction={this.closeErrorExportDialog.bind(this)} showDialog={showErrorExportDialog} header={3} />
                <DeleteErrorDialog onCancelAction={this.closeDeleteErrorDialog.bind(this)} showDialog={deleteError} header={3} />
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
                                    .filter(clnt => clnt.surname.toLowerCase().includes(search.toLowerCase()) || clnt.name.toLowerCase().includes(search.toLowerCase()) || clnt.patronymic.toLowerCase().includes(search.toLowerCase()) || clnt.dateOfBirth.includes(search.toLowerCase()) || clnt.street.toLowerCase().includes(search.toLowerCase()) || clnt.house.toString().includes(search.toLowerCase()))
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
                                                <TableCell align="center" className={classes.cell}>{n.surname}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{n.name}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{n.patronymic}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{getDate(n.dateOfBirth)}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{getAddress(n.street, n.house)}</TableCell>
                                                <TableCell align="center" className={classes.narrowCell}>{<IconButton onClick={event => this.startEditClick(event, n.id)}>
                                                    <Edit fontSize="small" />
                                                </IconButton>}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </div>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.filter(clnt => clnt.surname.toLowerCase().includes(search.toLowerCase()) || clnt.name.toLowerCase().includes(search.toLowerCase()) || clnt.patronymic.toLowerCase().includes(search.toLowerCase()) || clnt.dateOfBirth.includes(search.toLowerCase()) || clnt.street.toLowerCase().includes(search.toLowerCase()) || clnt.house.toString().includes(search.toLowerCase())).length}
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

function getAddress(street, house) {
    let result = "";

    result = street + ", " + house;

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
    state => state.clients,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Clients));
