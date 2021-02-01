import React from 'react';
import { Paper, Card, Grid, CardContent, TableContainer, Table, TableBody, TableRow, TableCell, Box, Button } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import RefreshIcon from '@material-ui/icons/Refresh';
import useStyles from '../styles.jsx'
import useFetch from 'use-http'


export default function DomainName(props) {
	const options = { loading: true, cachePolicy: 'no-cache', suspense: true }
	const { get, del, data, response, error } = useFetch(`api/v1/dns/domains/domain/${props.id}`, options, [])
	const [deleted, setDeleted] = React.useState(false);

	function handleDeleteClicked(e) {
		e.preventDefault();

		del().finally(() => {
			setDeleted(true)

			if (props.onContentsChanged)
				props.onContentsChanged();
		})
	}

	function handleStatusRefreshClicked(e) {
		e.preventDefault();
		get()
	}

	return (
		<>
			<Card key={"card-" + props.id} variant="outlined" className={useStyles.root}>
				<CardContent>
					{error && (<b>Domain does not exist ({JSON.stringify(error)}).</b>)}
					{deleted && "Deleted, please refresh..."}

					{data && !deleted && <>
						<Grid container spacing={3} alignItems="baseline">
							<Grid item xs={10}>
								<h1>Domain: {data.spec.domainName}</h1>
							</Grid>
							<Grid item xs={2}>
								<Button
									key={props.id} variant="contained"
									color="primary" startIcon={<DeleteForeverIcon />}
									className={useStyles.button}
									onClick={handleDeleteClicked}>
									Delete
								</Button>
							</Grid>
						</Grid>

						<DomainNameSpec id={props.id} spec={data.spec} />
						<DomainNameStatus id={props.id} status={data.status} onRefreshClicked={handleStatusRefreshClicked} />
					</>
					}


				</CardContent>
			</Card>
			<Box key={"box-" + props.id} paddingTop={2} />
		</>
	)
}

function DomainNameSpec(props) {
	return (
		<>
			<h3>Specification</h3>
			<TableContainer component={Paper} >
				<Table className={useStyles.table} aria-label="simple table">
					<TableBody>
						{Object.getOwnPropertyNames(props.spec)
							.map(name => (
								<TableRow key={props.id + '-spec-' + name}>
									<TableCell>{name}</TableCell>
									<TableCell>{props.spec[name]}</TableCell>
								</TableRow>
							), this)
						}
					</TableBody>
				</Table>
			</TableContainer >
		</>
	)
}

function DomainNameStatus(props) {

	function renderStatus() {
		return <TableContainer component={Paper} >
			<Table className={useStyles.table} aria-label="simple table">
				<TableBody>
					{Object.getOwnPropertyNames(props.status)
						.map(name => (
							<TableRow key={props.id + '-status-' + name}>
								<TableCell>{name}</TableCell>
								<TableCell>{props.status[name]}</TableCell>
							</TableRow>
						), this)
					}
				</TableBody>
			</Table>
		</TableContainer >
	}

	return (
		<>
			<Grid container spacing={3} alignItems="baseline">
				<Grid item xs={10}>
					<h3>Status</h3>
				</Grid>
				<Grid item xs={2}>
					<Button key={props.id} variant="contained" color="secondary" startIcon={<RefreshIcon />}
						className={useStyles.button} onClick={props.onRefreshClicked}>
						Refresh
						</Button>
				</Grid>
			</Grid>

			{props.status && renderStatus()}
			{!props.status && "Status unknown yet."}
		</>
	)

}
