import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import {
    AppBar, Toolbar, IconButton, Typography, Hidden,
    Drawer, CssBaseline, MenuList, MenuItem
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Menu } from '@material-ui/icons';
import { compose } from 'recompose';
import LoginDialog from './LoginDialog';
import LoginButton from './Home/LoginButton';
import MenuText from './Home/MenuText';

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
        this.exitClick = this.exitClick.bind(this);
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

    exitClick = () => {
        this.props.history.push('/');
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
        const { classes, location: { pathname }, children, role } = this.props;
        const { mobileOpen } = this.state;

        const baseDrawer = (
            <div>
                <Hidden smDown>
                    <div className={classes.toolbar} />
                </Hidden>
                <MenuList>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/" selected={'/' === pathname}>
                        <MenuText textIndex={0} />
                    </MenuItem>
                </MenuList>
            </div>
        );

        const appraiserDrawer = (
            <div>
                <Hidden smDown>
                    <div className={classes.toolbar} />
                </Hidden>
                <MenuList>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/" selected={'/' === pathname}>
                        <MenuText textIndex={0} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/contracts" selected={'/contracts' === pathname}>
                        <MenuText textIndex={1} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/clients" selected={'/clients' === pathname}>
                        <MenuText textIndex={2} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/appraisers" selected={'/appraisers' === pathname}>
                        <MenuText textIndex={4} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/flats" selected={'/flats' === pathname}>
                        <MenuText textIndex={10} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/parcels" selected={'/parcels' === pathname}>
                        <MenuText textIndex={12} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/cars" selected={'/cars' === pathname}>
                        <MenuText textIndex={13} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/neural" selected={'/neural' === pathname}>
                        <MenuText textIndex={5} />
                    </MenuItem>
                </MenuList>
            </div>
        );

        const accauntantDrawer = (
            <div>
                <Hidden smDown>
                    <div className={classes.toolbar} />
                </Hidden>
                <MenuList>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/" selected={'/' === pathname}>
                        <MenuText textIndex={0} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/users" selected={'/users' === pathname}>
                        <MenuText textIndex={6} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/appraisers" selected={'/appraisers' === pathname}>
                        <MenuText textIndex={4} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/salary" selected={'/salary' === pathname}>
                        <MenuText textIndex={7} />
                    </MenuItem>
                </MenuList>
            </div>
        );

        const directorDrawer = (
            <div>
                <Hidden smDown>
                    <div className={classes.toolbar} />
                </Hidden>
                <MenuList>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/" selected={'/' === pathname}>
                        <MenuText textIndex={0} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/contracts" selected={'/contracts' === pathname}>
                        <MenuText textIndex={1} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/clients" selected={'/clients' === pathname}>
                        <MenuText textIndex={2} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/appraisers" selected={'/appraisers' === pathname}>
                        <MenuText textIndex={4} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/address" selected={'/address' === pathname}>
                        <MenuText textIndex={9} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/flats" selected={'/flats' === pathname}>
                        <MenuText textIndex={10} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/parcels" selected={'/parcels' === pathname}>
                        <MenuText textIndex={12} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/cars" selected={'/cars' === pathname}>
                        <MenuText textIndex={13} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/neural" selected={'/neural' === pathname}>
                        <MenuText textIndex={5} />
                    </MenuItem>
                    <MenuItem component={Link} onClick={this.handleDrawerToggle} to="/salary" selected={'/salary' === pathname}>
                        <MenuText textIndex={7} />
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
                            <LoginButton loginClick={this.showLoginDialog.bind(this)} exitClick={this.exitClick.bind(this)} />
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
                        {role === 0 ? baseDrawer : (role === 1 ? appraiserDrawer : (role === 2 ? accauntantDrawer : directorDrawer))}
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
                        {role === 0 ? baseDrawer : (role === 1 ? appraiserDrawer : (role === 2 ? accauntantDrawer : directorDrawer))}
                    </Drawer>
                </Hidden>
                <div className={classes.content}>
                    <div className={classes.toolbar} />
                    {children}
                </div>
            </div>
        </Fragment>
    }
}

export default compose(
    withRouter,
    withStyles(styles),
    connect(state => state.login)
)(Layout);