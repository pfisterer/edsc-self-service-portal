import React, { Suspense } from 'react';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { ThemeProvider } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';

import LoadingIndicator from './LoadingIndicator.jsx'
import { mainListItems, secondaryListItems } from './menu_items.jsx';
import Home from './Home.jsx';
import AppDns from './dns/AppDns.jsx';
import AppMicroK8s from './microk8s/AppMicroK8s.jsx';
import useStyles from './styles.jsx'

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://dennis-pfisterer.de/" target="_blank">
				Dennis Pfisterer
			</Link>
			{', '}
			<Link color="inherit" href="https://edsc-dhbw.github.io/" target="_blank">
				Enterprise Data Science Center (EDSC)
			</Link>
			{' '}
			{new Date().getFullYear()}
			{'.'}
			<br /><br />
		</Typography>
	);
}

const theme = createTheme({
	palette: {
		primary: {
			// light: will be calculated from palette.primary.main,
			main: '#e2001a',
			// dark: will be calculated from palette.primary.main,
			// contrastText: will be calculated to contrast with palette.primary.main
		},
		secondary: {
			light: '#5d6971',
			main: '#5d6971',
		},
	}
});

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
			<ThemeProvider theme={theme}>
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
							{/*
						<IconButton color="inherit">
							<Badge badgeContent={''} color="secondary">
								<NotificationsIcon />
							</Badge>
						</IconButton>
						*/}
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
							<Routes>
								<Route exact path="/" element={<Home />} />
								<Route path="/dns" element={
									<Suspense fallback={<LoadingIndicator />}>
										<AppDns />
									</Suspense>
								} />
								<Route path="/apps/microk8s" element={<AppMicroK8s />} />
							</Routes>
						</Container>

						<Copyright />
					</main>

				</div>
			</ThemeProvider>
		</Router>
	);
}