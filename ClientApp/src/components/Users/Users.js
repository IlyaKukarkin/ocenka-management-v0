import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../../store/UserReducer';
import TableCardLayout from '../TableCardLayout';
import MyTableHead from '../TableHead';
import TableToolbar from '../TableToolbar';
import DeleteDialog from '../DeleteDialog';
import CreateFileDialog from '../CreateFileDialog';
import ErrorFileDialog from '../ErrorFileDialog';
import ErrorExportDialog from '../ErrorExportDialog';
import AddUserDialog from './AddUserDialog';
import RoleText from '../Home/RoleText';
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
    { id: 'surname', numeric: false, label: '11' },
    { id: 'login', numeric: false, label: '12' },
    { id: 'birthday', numeric: false, label: '13' },
    { id: 'worksSince', numeric: false, label: '14' },
    { id: 'roleId', numeric: true, label: '15' },
];

class Users extends Component {
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
        editUser: {
            id: '',
            surname: '',
            name: '',
            patronymic: '',
            login: '',
            password: '',
            birthday: '',
            worksSince: '',
            position: '',
            category: '',
            salary: '',
        }
    };

    componentWillMount() {
        this.props.GetUsersSet();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.users !== nextProps.users) {
            this.setState({ data: nextProps.users });
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
        const { DeleteUserSet, DeleteUsersSet } = this.props;

        this.setState({ showDeleteDialog: false });
        if (this.state.selected.length === 1) {
            if (this.state.selected[0] !== 3003) {
                DeleteUserSet(this.state.selected[0]);
            }
        } else {
            let arr = this.removeDirector(this.state.selected);
            DeleteUsersSet(arr);
        }
        this.setState({ selected: [] });
    }

    removeDirector = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === 3003) {
                arr.splice(i, 1);
                return arr;
            }
        }
        return arr;
    }

    handleAddClick = (data) => {
        this.props.AddUserSet(data);

        this.setState({ showAddDialog: false });
    }

    handleEditClick = (data) => {
        this.props.ClearEditUser();

        this.props.EditUserSet(data);

        this.setState({ showAddDialog: false });
    }

    showDeleteDialog = () => {
        this.setState({ showDeleteDialog: true });
    }

    showAddDialog = () => {
        this.props.ClearEditUser();

        this.setState({ showAddDialog: true });
    }

    closeDeleteDialog = () => {
        this.setState({ showDeleteDialog: false });
    }

    closeAddDialog = () => {
        this.props.ClearEditUser();

        this.setState({ showAddDialog: false });
    }

    startEditClick = (event, id) => {
        let user = this.findUser(id);

        let getUser = this.props.GetEditUser(user);

        getUser.then((user) => {
            this.setState({ showAddDialog: true });
        });
    }

    findUser = (id) => {
        for (let i = 0; i < this.props.users.length; i++) {
            if (this.props.users[i].id === id) {
                return this.props.users[i];
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

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const { classes, isLoading, fileSaved, fileError, editUser } = this.props;
        const { data, order, orderBy, selected, rowsPerPage, page, showAddDialog, showDeleteDialog, search, showErrorExportDialog } = this.state;

        return (
            <TableCardLayout id={"usr"} headerIndex={2} isLoading={isLoading} onSearchChange={this.handleSearchChange.bind(this)} excelClick={this.handleExcelClick.bind(this)} deleteToolbar={<TableToolbar numSelected={selected.length} deleteClick={this.showDeleteDialog.bind(this)} />} addClick={this.showAddDialog.bind(this)} >
                <DeleteDialog header={2} onDeleteAction={this.handleDeleteClick.bind(this)} onCancelAction={this.closeDeleteDialog.bind(this)} showDialog={showDeleteDialog} />
                <AddUserDialog onAddAction={this.handleAddClick.bind(this)} onEditAction={this.handleEditClick.bind(this)} onCancelAction={this.closeAddDialog.bind(this)} showDialog={showAddDialog} editUser={editUser} />
                <CreateFileDialog onCancelAction={this.closeFileDialog.bind(this)} showDialog={fileSaved} header={1} />
                <ErrorFileDialog onCancelAction={this.closeErrorFileDialog.bind(this)} showDialog={fileError} header={1} />
                <ErrorExportDialog onCancelAction={this.closeErrorExportDialog.bind(this)} showDialog={showErrorExportDialog} header={1} />
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
                                    .filter(apr => apr.surname.includes(search) || apr.name.includes(search) || apr.patronymic.includes(search) || apr.birthday.includes(search) || apr.worksSince.includes(search) || apr.login.includes(search))
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
                                                <TableCell align="center" className={classes.cell}>{getFio(n.surname, n.name, n.patronymic)}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{n.login}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{getDate(n.birthday)}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{getYear(n.worksSince)}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{getRole(n.roleId)}</TableCell>
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
                        count={data.filter(apr => apr.surname.includes(search) || apr.name.includes(search) || apr.patronymic.includes(search) || apr.birthday.includes(search) || apr.worksSince.includes(search) || apr.login.includes(search)).length}
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

function getFio(surname, name, patronymic) {
    let result = "";

    result = surname + " " + name.substring(0, 1).toUpperCase() + ". " + patronymic.substring(0, 1).toUpperCase() + ".";

    return result;
}

function getRole(role) {
    let result = 0;

    switch (role) {
        case 1:
            result = 0;
            break;
        case 2:
            result = 1;
            break;
        case 3:
            result = 2;
            break;
        default:
            result = 0;
            break;
    }

    return <RoleText textIndex={result} />;
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
    state => state.users,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Users));
