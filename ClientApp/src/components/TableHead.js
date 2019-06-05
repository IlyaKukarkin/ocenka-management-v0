import React from 'react';
import PropTypes from 'prop-types';
import {
    TableHead, TableCell, TableRow, Checkbox, Tooltip, TableSortLabel
} from '@material-ui/core';

// Адрес [0-4], Оценщик [5-10], Пользователь [11-15], Квартира [16-21],

const addressLabel = ["Город", "Район", "Улица", "Дом", "Квартира",
    "Фамилия", "Имя", "Отчество", "Дата рождения", "Год начала работы", "Категория",
    "ФИО", "Логин", "Дата рождения", "Год начала работы", "Должность",
    "Кад. номер", "Цель оценки", "Площадь", "Кол-во комнат", "Этаж", "Адрес"];

class MyTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount, rows, isPartial } = this.props;

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="none" style={{ minWidth: 30, maxWidth: 30 }}>
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                            color="primary"
                        />
                    </TableCell>
                    {rows.map(
                        row => (
                            <TableCell
                                key={row.id}
                                align={'center'}
                                padding={'none'}
                                sortDirection={orderBy === row.id ? order : false}
                                style={{ whiteSpace: "normal", wordWrap: "break-word", paddingLeft: "10px" }}
                            >
                                <Tooltip
                                    title="Сортировать"
                                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === row.id}
                                        direction={order}
                                        onClick={this.createSortHandler(row.id)}
                                    >
                                        {addressLabel[row.label]}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        ),
                        this,
                    )}
                    {!isPartial && <TableCell />}
                </TableRow>
            </TableHead>
        );
    }
}

MyTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default (MyTableHead);