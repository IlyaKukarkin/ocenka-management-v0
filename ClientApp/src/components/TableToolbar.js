import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    Toolbar, IconButton, Typography, Tooltip, Button
} from '@material-ui/core';
import { FilterList, Delete } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
        paddingLeft: theme.spacing.unit,
        display: 'none',
        minHeight: '0',
        borderRadius: '18px'
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.primary.main,
                backgroundColor: lighten(theme.palette.primary.light, 0.85),
                display: 'flex'
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.primary.dark,
                display: 'flex'
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    deleteButton: {
        borderRadius: '18px',
    },
});

let TableToolbar = props => {
    const { numSelected, classes, deleteClick } = props;

    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.actions}>
                {numSelected > 0 ? (
                    <Button color="primary" className={classes.deleteButton} onClick={deleteClick}>
                        <Delete className={classes.leftIcon} />
                        Удалить
                    </Button>
                ) : (
                        <Tooltip title="Сортировка списка">
                            <IconButton aria-label="Filter list">
                                <FilterList />
                            </IconButton>
                        </Tooltip>
                    )}
            </div>
        </Toolbar>
    );
};

TableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired
};

export default withStyles(toolbarStyles)(TableToolbar);