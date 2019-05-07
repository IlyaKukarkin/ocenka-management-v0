import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
    AppBar, Toolbar, IconButton, Typography, Hidden,
    Drawer, CssBaseline, MenuList, MenuItem, CardMedia, Button
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Menu } from '@material-ui/icons';
import { compose } from 'recompose';
import LoginDialog from './LoginDialog';

const drawerWidth = 200;

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    navIconHide: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.up('md')]: {
            position: 'relative',
        },
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
    grow: {
        flexGrow: 1,
    },
    login: {
        position: 'relative',
        paddingTop: '6px'
    },
})

class Layout extends Component {
    constructor(props) {
        super(props);

        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.showLoginDialog = this.showLoginDialog.bind(this);
        this.closeLoginDialog = this.closeLoginDialog.bind(this);
    }

    state = {
        mobileOpen: false,
        showLoginDialog: false,
    }

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen })
    }

    showLoginDialog = () => {
        this.setState({ showLoginDialog: true });
    }

    closeLoginDialog = () => {
        this.setState({ showLoginDialog: false });
    }

    handleLoginClick = () => {
        //const { DeleteAddressSet, DeleteAddressesSet } = this.props;

        this.setState({ showLoginDialog: false });

        //if (this.state.selected.length === 1) {
        //    DeleteAddressSet(this.state.selected[0]);
        //} else {
        //    DeleteAddressesSet(this.state.selected);
        //}
        //this.setState({ selected: [] });
    }

    render() {
        const { classes, location: { pathname }, children } = this.props;
        const { mobileOpen } = this.state;

        const drawer = (
            <div>
                <Hidden smDown>
                    <div className={classes.toolbar} />
                </Hidden>
                <MenuList>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/" selected={'/' === pathname}>
                        Home
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/counter" selected={'/counter' === pathname}>
                        Contracts
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/fetchdata" selected={'/fetchdata' === pathname}>
                        <CardMedia
                            component="img"
                            height="40"
                            image="https://codelabs.developers.google.com/codelabs/mobile-vision-ocr/img/c5134dae01ad22a5.png"
                        />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/address" selected={'/address' === pathname}>
                        Addresses
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/appraisers" selected={'/appraisers' === pathname}>
                        Appraisers
                    </MenuItem>
                </MenuList>
            </div>
        );

        return <Fragment>
            <CssBaseline />

            <div className={classes.root}>
                <LoginDialog onAddAction={this.handleLoginClick.bind(this)} onCancelAction={this.closeLoginDialog.bind(this)} showDialog={this.state.showLoginDialog} />
                <AppBar position="absolute" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawerToggle}
                            className={classes.navIconHide}
                        >
                            <Menu />
                        </IconButton>
                        <Typography variant="title" color="inherit" noWrap>
                            Ocenka Management
                        </Typography>
                        <div className={classes.grow} />
                        <div className={classes.login}>
                            <Button color="inherit" onClick={this.showLoginDialog}>Login</Button>
                        </div>
                    </Toolbar>
                </AppBar>
                <Hidden mdUp>
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={this.handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden smDown implementation="css">
                    <Drawer
                        variant="permanent"
                        open
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {children}
                </main>
            </div>
        </Fragment>
    }
}

export default compose(
    withRouter,
    withStyles(styles)
)(Layout);