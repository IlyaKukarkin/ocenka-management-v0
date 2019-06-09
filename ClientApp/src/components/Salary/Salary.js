import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../../store/SalaryReducer';
import TableCardLayout from '../TableCardLayout';
import MyTableHead from '../TableHead';
import TableToolbar from '../TableToolbar';
import CreateFileDialog from '../CreateFileDialog';
import ErrorFileDialog from '../ErrorFileDialog';
import ShowSalaryDialog from './ShowSalaryDialog';
import MonthText from '../Home/MonthText';
import { withStyles } from '@material-ui/core/styles';
import {
    Table, TableCell, TableRow, TableBody, IconButton, Checkbox, Grid
} from '@material-ui/core';
import { Info, NavigateNext, NavigateBefore } from '@material-ui/icons';

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
    },
    month: {
        paddingRight: '20px',
        paddingLeft: '20px'
    }
});

const rows = [
    { id: 'surname', numeric: false, label: '27' },
    { id: 'contractsCount', numeric: false, label: '28' },
    { id: 'salary', numeric: false, label: '29' },
]

class Salary extends Component {
    constructor(props) {
        super(props);

        this.closeFileDialog = this.closeFileDialog.bind(this);
        this.closeErrorFileDialog = this.closeErrorFileDialog.bind(this);
        this.handleExcelClick = this.handleExcelClick.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.closeMoreDialog = this.closeMoreDialog.bind(this);
    }

    state = {
        order: 'asc',
        orderBy: 'surname',
        data: [],
        page: 0,
        currMonth: 0,
        search: '',
        showErrorExportDialog: false,
        showMoreDialog: false,
        editSalary: {
            month: '',
            surname: '',
            name: '',
            patronymic: '',
            contractsCount: '',
            contracts: {},
            salary: '',
        }
    };

    componentWillMount() {
        this.props.GetSalary(0);

        this.getCurrentMonth();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.salary !== nextProps.salary) {
            this.setState({ data: nextProps.salary });
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

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleEditClick = (data) => {
        this.props.ClearEditSalary();

        this.setState({ showMoreDialog: false });
    }

    closeMoreDialog = () => {
        this.setState({
            showMoreDialog: false,
            editSalary: {
                month: '',
                surname: '',
                name: '',
                patronymic: '',
                contractsCount: '',
                contracts: {},
                salary: '',
            }
        });
    }

    closeAddDialog = () => {
        this.props.ClearEditFlat();

        this.setState({ showMoreDialog: false });
    }

    startEditClick = (event, id) => {
        let salary = this.findSalary(id);

        this.setState({ showMoreDialog: true, editSalary: salary });
    }

    findSalary = (id) => {
        for (let i = 0; i < this.props.salary.length; i++) {
            if (this.props.salary[i].id === id) {
                return this.props.salary[i];
            }
        }
    }

    handleSearchChange = (value) => {
        this.setState({ search: value });
    }

    handleExcelClick = () => {
        this.props.ToExcel(this.state.page);
    }

    closeFileDialog = () => {
        this.props.ToExcelClose();
    }

    closeErrorFileDialog = () => {
        this.props.ToExcelErrorClose();
    }

    olderMonth = () => {
        const pg = this.state.page;
        const mt = this.state.currMonth;
        this.props.GetSalary(pg + 1);
        this.setState({ page: pg + 1 });

        if (mt === 0) {
            this.setState({ currMonth: 11 });
        } else {
            this.setState({ currMonth: mt - 1 });
        }
    }

    newerMonth = () => {
        const pg = this.state.page;
        const mt = this.state.currMonth;
        this.props.GetSalary(pg - 1);
        this.setState({ page: pg - 1 });

        if (mt === 11) {
            this.setState({ currMonth: 0 });
        } else {
            this.setState({ currMonth: mt + 1 });
        }
    }

    getCurrentMonth = () => {
        let currDate = new Date();
        this.setState({ currMonth: currDate.getMonth() });
    }

    render() {
        const { classes, isLoading, fileSaved, fileError } = this.props;
        const { data, order, orderBy, page, currMonth, search, showMoreDialog, editSalary } = this.state;

        return (
            <TableCardLayout id={"sal"} headerIndex={6} isLoading={isLoading} isPartial onSearchChange={this.handleSearchChange.bind(this)} excelClick={this.handleExcelClick.bind(this)} excelDisable={data.length === 0} >
                <CreateFileDialog onCancelAction={this.closeFileDialog.bind(this)} showDialog={fileSaved} header={6} />
                <ErrorFileDialog onCancelAction={this.closeErrorFileDialog.bind(this)} showDialog={fileError} header={6} />
                <ShowSalaryDialog onCancelAction={this.closeMoreDialog.bind(this)} showDialog={showMoreDialog} Salary={editSalary} header={4} />
                <div style={{ width: "100%" }}>
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table}>
                            <MyTableHead
                                numSelected={0}
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={this.handleRequestSort}
                                rowCount={data.length}
                                rows={rows}
                            />
                            <TableBody>
                                {stableSort(data, getSorting(order, orderBy))
                                    .filter(sal => sal.salary.toString().includes(search.toLowerCase()) || sal.surname.toLowerCase().includes(search.toLowerCase()) || sal.contractsCount.toString().includes(search.toLowerCase()))
                                    .map(n => {
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                aria-checked={false}
                                                tabIndex={-1}
                                                key={n.id}
                                                selected={false}
                                            >
                                                <TableCell padding="none" className={classes.narrowCell}>
                                                    <Checkbox checked={false} color="primary"/>
                                                </TableCell>
                                                <TableCell align="center" className={classes.cell}>{getFio(n.surname, n.name, n.patronymic)}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{n.contractsCount}</TableCell>
                                                <TableCell align="center" className={classes.cell}>{n.salary}</TableCell>
                                                <TableCell align="center" className={classes.narrowCell}>{<IconButton onClick={event => this.startEditClick(event, n.id)}>
                                                    <Info fontSize="small" />
                                                </IconButton>}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </div>
                    <Grid container justify="flex-end" alignItems="center">
                        <IconButton onClick={event => this.olderMonth()}>
                            <NavigateBefore fontSize="small" />
                        </IconButton>
                        <MonthText textIndex={currMonth} />
                        <IconButton disabled={page === 0} onClick={event => this.newerMonth()}>
                            <NavigateNext fontSize="small" />
                        </IconButton>
                    </Grid>
                </div>
            </TableCardLayout>
        );
    }
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
    state => state.salary,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Salary));
