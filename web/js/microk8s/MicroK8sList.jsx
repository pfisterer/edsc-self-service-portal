import React from 'react';
import { Grid, CardContent, TableContainer, Table, TableBody, TableRow, TableCell, Box, Button } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import useFetch from 'use-http'
import LoadingIndicator from '../LoadingIndicator.jsx';
import useStyles from '../styles.jsx'

export default function MicroK8sList(props) {
	const options = {}
	const { loading, error, data = [] } = useFetch('api/v1/microk8s/', options, [])

	let handleOnContentChanged = () => { }

	let renderMicrok8s = (object) => {
		return JSON.stringify(object)
	}

	return <>
		<Grid container spacing={3} alignItems="baseline">
			<Grid item xs={10}>
				<h2>MicroK8s instances</h2>
			</Grid>
			<Grid item xs={2}>
				<Button key={props.id} variant="contained" color="secondary" startIcon={<RefreshIcon />}
					className={useStyles.button} onClick={props.onRefreshClicked}>
					Refresh
				</Button>
			</Grid>
		</Grid>



		{error && 'Error!'}
		{loading && <LoadingIndicator />}
		{data.map(obj => renderMicrok8s(obj))}
	</>
}
