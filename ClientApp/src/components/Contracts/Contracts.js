import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../../store/ContractReducer';
import TableCardLayout from '../TableCardLayout';
import MyTableHead from '../TableHead';
import TableToolbar from '../TableToolbar';
import DeleteDialog from '../DeleteDialog';
import CreateFileDialog from '../CreateFileDialog';
import ErrorFileDialog from '../ErrorFileDialog';
import ErrorExportDialog from '../ErrorExportDialog';
import AddContractDialog from './AddContractDialog';
import ShowContractDialog from './ShowContractDialog';
import { withStyles } from '@material-ui/core/styles';
import {
    Table, TableCell, TableRow, TableBody, TablePagination, IconButton, Checkbox
} from '@material-ui/core';
import { Edit, Info } from '@material-ui/icons';

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
    doubleNarrowCell: {
        minWidth: '136px'
    },
    cell: {
        padding: '0',
        maxWidth: '125px',
        whiteSpace: "normal",
        wordWrap: "break-word"
    }
});

const rows = [
    { id: 'contractSumm', numeric: false, label: '22' },
    { id: 'prepaid', numeric: false, label: '23' },
    { id: 'startDate', numeric: false, label: '24' },
    { id: 'finishDate', numeric: false, label: '25' },
    { id: 'surname', numeric: false, label: '26' },
    { id: 'appraiser', numeric: false, label: '27' },
];

class Contracts extends Component {
    constructor(props) {
        super(props);

        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.showDeleteDialog = this.showDeleteDialog.bind(this);
        this.showAddDialog = this.showAddDialog.bind(this);
        this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
        this.handleAddClick = this.handleAddClick.bind(this);
        this.closeAddDialog = this.closeAddDialog.bind(this);
        this.closeMoreDialog = this.closeMoreDialog.bind(this);
        this.closeFileDialog = this.closeFileDialog.bind(this);
        this.closeErrorFileDialog = this.closeErrorFileDialog.bind(this);
        this.closeErrorExportDialog = this.closeErrorExportDialog.bind(this);
        this.handleExcelClick = this.handleExcelClick.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
    }

    state = {
        order: 'asc',
        orderBy: 'contractSumm',
        selected: [],
        data: [],
        page: 0,
        search: '',
        rowsPerPage: 5,
        showDeleteDialog: false,
        showAddDialog: false,
        showMoreDialog: false,
        showErrorExportDialog: false,
        editContract: {
            id: '',
            contractSumm: '',
            prepaid: '',
            startDate: '',
            finishDate: '',
            clientId: '',
            objectId: '',
            appraiserId: '',
            client: {},
            objectType: '',
            object: {},
            appraiser: {},
        }
    };

    componentWillMount() {
        this.props.GetContractsSet();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.contracts !== nextProps.contracts) {
            this.setState({ data: nextProps.contracts });
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
        const { DeleteContractSet, DeleteContractsSet } = this.props;

        this.setState({ showDeleteDialog: false });
        if (this.state.selected.length === 1) {
            DeleteContractSet(this.state.selected[0]);
        } else {
            DeleteContractsSet(this.state.selected);
        }
        this.setState({ selected: [] });
    }

    handleAddClick = (data) => {
        let addContract = this.props.AddContractSet(data);

        addContract.then(con => {
            this.props.GetContractsSet();

            this.setState({ showAddDialog: false });
        });
    }

    handleEditClick = (data) => {
        this.props.ClearEditContract();

        let editContract = this.props.EditContractSet(data);

        editContract.then(con => {
            this.props.GetContractsSet();

            this.setState({ showAddDialog: false });
        });
    }

    showDeleteDialog = () => {
        this.setState({ showDeleteDialog: true });
    }

    showAddDialog = () => {
        this.props.ClearEditContract();
        this.props.GetListsSet();

        this.setState({ showAddDialog: true });
    }

    closeDeleteDialog = () => {
        this.setState({ showDeleteDialog: false });
    }

    closeAddDialog = () => {
        this.props.ClearEditContract();

        this.setState({ showAddDialog: false });
    }

    closeMoreDialog = () => {
        this.props.ClearMoreContract();
        
        this.setState({ showMoreDialog: false });
    }

    startEditClick = (event, id) => {
        let contract = this.findContract(id);

        let getContract = this.props.GetEditContract(contract);

        getContract.then((client) => {
            this.setState({ showAddDialog: true });
            this.props.GetListsSet();
        });
    }

    startMoreClick = (event, id) => {
        let contract = this.findContract(id);

        let getContract = this.props.GetMoreContract(contract);

        getContract.then((client) => {
            this.setState({ showMoreDialog: true });
        });
    }

    findContract = (id) => {
        for (let i = 0; i < this.props.contracts.length; i++) {
            if (this.props.contracts[i].id === id) {
                return this.props.contracts[i];
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
        const { classes, isLoading, fileSaved, fileError, editContract, moreContract, addIsLoading, indivList, entList, flatList, carList, parcelList, apprList } = this.props;
        const { data, order, orderBy, selected, rowsPerPage, page, showAddDialog, showMoreDialog, showDeleteDialog, search, showErrorExportDialog } = this.state;

        return (
            <TableCardLayout id={"clnt"} headerIndex={5} isLoading={isLoading} onSearchChange={this.handleSearchChange.bind(this)} excelClick={this.handleExcelClick.bind(this)} deleteToolbar={<TableToolbar numSelected={selected.length} deleteClick={this.showDeleteDialog.bind(this)} />} addClick={this.showAddDialog.bind(this)} >
                <DeleteDialog header={5} onDeleteAction={this.handleDeleteClick.bind(this)} onCancelAction={this.closeDeleteDialog.bind(this)} showDialog={showDeleteDialog} />
                <AddContractDialog
                    isLoading={addIsLoading} indivList={indivList} entList={entList} flatList={flatList} carList={carList} parcelList={parcelList} apprList={apprList}
                    onAddAction={this.handleAddClick.bind(this)} onEditAction={this.handleEditClick.bind(this)} onCancelAction={this.closeAddDialog.bind(this)}
                    showDialog={showAddDialog} editContract={editContract}
                />
                <ShowContractDialog onCancelAction={this.closeMoreDialog.bind(this)} showDialog={showMoreDialog} Contract={moreContract} />
                <CreateFileDialog onCancelAction={this.closeFileDialog.bind(this)} showDialog={fileSaved} header={5} />
                <ErrorFileDialog onCancelAction={this.closeErrorFileDialog.bind(this)} showDialog={fileError} header={5} />
                <ErrorExportDialog onCancelAction={this.closeErrorExportDialog.bind(this)} showDialog={showErrorExportDialog} header={5} />
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
                                    .filter(cntr => cntr.contractSumm.toString().toLowerCase().includes(search.toLowerCase()) || cntr.prepaid.toString().toLowerCase().includes(search.toLowerCase()) || cntr.startDate.includes(search.toLowerCase()) || cntr.finishDate.includes(search.toLowerCase()) || (cntr.client.surname && cntr.client.surname.toLowerCase().includes(search.toLowerCase())) || (cntr.client.companyName && cntr.client.companyName.toLowerCase().includes(search.toLowerCase())) || cntr.appraiser.surname.toLowerCase().includes(search.toLowerCase()))
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
                                                <TableCell align="center" className={classes.cell}>{n.contractSumm}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{n.prepaid}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{getDate(n.startDate)}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{getDate(n.finishDate)}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{n.clientType === 'Indiv' ? getFio(n.client.surname, n.client.name, n.client.patronymic) : n.client.companyName}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{getFio(n.appraiser.surname, n.appraiser.name, n.appraiser.patronymic)}</TableCell>
                                                <TableCell align="center" className={classes.doubleNarrowCell}>{
                                                    <div>
                                                        <IconButton onClick={event => this.startMoreClick(event, n.id)}>
                                                            <Info fontSize="small" />
                                                        </IconButton>
                                                        <IconButton onClick={event => this.startEditClick(event, n.id)}>
                                                            <Edit fontSize="small" />
                                                        </IconButton>
                                                    </div>
                                                }</TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </div>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.filter(cntr => cntr.contractSumm.toString().toLowerCase().includes(search.toLowerCase()) || cntr.prepaid.toString().toLowerCase().includes(search.toLowerCase()) || cntr.startDate.includes(search.toLowerCase()) || cntr.finishDate.includes(search.toLowerCase()) || (cntr.client.surname && cntr.client.surname.toLowerCase().includes(search.toLowerCase())) || (cntr.client.companyName && cntr.client.companyName.toLowerCase().includes(search.toLowerCase())) || cntr.appraiser.surname.toLowerCase().includes(search.toLowerCase())).length}
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

function getFio(surname, name, patronymic) {
    let result = "";

    result = surname + " " + name.substring(0, 1).toUpperCase() + ". " + patronymic.substring(0, 1).toUpperCase() + ".";

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
    state => state.contracts,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Contracts));
