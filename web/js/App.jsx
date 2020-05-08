import React from 'react';
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Container from '@material-ui/core/Container';

import { mainListItems, secondaryListItems } from './menu_items.jsx';
import Home from './Home.jsx';
import Dns from './Dns.jsx';
import useStyles from './styles.jsx'

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://edsc-dhbw.github.io/" target="_blank">
				Enterprise Data Science Center (EDSC)
      	</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
			<br /><br />
		</Typography>
	);
}

export default function Dashboard() {
	const classes = useStyles();
	const [open, setOpen] = React.useState(true);
	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<Router>
			<div className={classes.root}>
				<CssBaseline />

				<AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
					<Toolbar className={classes.toolbar}>
						<IconButton edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawerOpen}
							className={clsx(classes.menuButton, open && classes.menuButtonHidden)}>
							<MenuIcon />
						</IconButton>
						<Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
							EDSC Portal
          		</Typography>
						<IconButton color="inherit">
							<Badge badgeContent={4} color="secondary">
								<NotificationsIcon />
							</Badge>
						</IconButton>
					</Toolbar>
				</AppBar>

				<Drawer variant="permanent"
					classes={{ paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose), }}
					open={open}>

					<div className={classes.toolbarIcon}>
						<IconButton onClick={handleDrawerClose}>
							<ChevronLeftIcon />
						</IconButton>
					</div>
					<Divider />
					<List>{mainListItems}</List>
					<Divider />
					<List>{secondaryListItems}</List>
				</Drawer>

				<main className={classes.content}>
					<div className={classes.appBarSpacer} />

					<Container maxWidth="lg" className={classes.container}>
						<Switch>
							<Route exact path="/">
								<Home />
							</Route>
							<Route path="/dns">
								<Dns />
							</Route>
						</Switch>
					</Container>

					<Copyright />
				</main>


			</div>
		</Router>
	);
}