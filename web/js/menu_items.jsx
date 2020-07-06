import React, { Link as Hyperlink } from 'react';
import { Link as ReactLink } from "react-router-dom";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export const mainListItems = (
	<div>
		<ListItem button component={ReactLink} to="/">
			<ListItemIcon>
				<DashboardIcon />
			</ListItemIcon>
			<ListItemText primary="Home" />
		</ListItem>

		<ListItem button component={ReactLink} to="/dns">
			<ListItemIcon>
				<ShoppingCartIcon />
			</ListItemIcon>
			<ListItemText primary="DNS" />
		</ListItem>

		<ListItem button component={ReactLink} to="/apps/microk8s">
			<ListItemIcon>
				<ShoppingCartIcon />
			</ListItemIcon>
			<ListItemText primary="MicroK8s" />
		</ListItem>
	</div>
);

export const secondaryListItems = (
	<div>
		{/*<ListSubheader inset>Others</ListSubheader>*/}

		<ListItem button component="a" href="/logout">
			<ListItemIcon>
				<ExitToAppIcon />
			</ListItemIcon>
			<ListItemText primary="Logout" />
		</ListItem>
	</div>
);