import React, { useState, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import EdscLogo from "../img/edsc-logo.svg"

export default function Dashboard() {

	return (
		<>
			<Grid container spacing={3} alignItems="center" >
				<Grid item xs={12}>
					<EdscLogo />
				</Grid>
			</Grid>
		</>
	)
}