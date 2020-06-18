import React, { Component } from 'react';
import { Paper, Card, Grid, CardContent, TableContainer, Table, TableBody, TableRow, TableCell, Box, Button } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import RefreshIcon from '@material-ui/icons/Refresh';
import LoadingIndicator from '../LoadingIndicator.jsx';
import useStyles from '../styles.jsx'

export default class DomainName extends Component {
	state = {
		deleted: false,
		loading: true,
		data: {},
		error: null
	}

	refreshState() {
		fetch(`api/v1/dns/domains/domain/${this.props.id}`)
			.then(res => res.json())
			.then(data => this.setState({ data, error: null, loading: false, deleted: false }))
			.catch(err => this.setState({ error: err, data: {}, loading: false, deleted: false }))
	}

	componentDidMount() {
		this.refreshState()
	}

	handleDeleteClicked = (e) => {
		e.preventDefault();

		fetch(`api/v1/dns/domains/domain/${this.props.id}`, { method: 'DELETE' })
			.then(res => {
				if (!res.ok)
					setState({ error: res.body });
				else {
					this.setState({ deleted: true, error: false });
				}

				if (this.props.onContentChanged)
					this.props.onContentChanged();
			})
			.catch(err => this.setState({ error: err }))
	}

	handleStatusRefreshClicked = e => {
		e.preventDefault();
		this.refreshState()
	}

	render() {
		return (
			<>
				<Card key={"card-" + this.props.id} variant="outlined" className={useStyles.root}>
					<CardContent>
						{this.state.error && (<b>Domain does not exist ({JSON.stringify(this.state.error)}).</b>)}
						{this.state.loading && (<LoadingIndicator />)}
						{this.state.deleted && (<b>Deleted.</b>)}

						{!this.state.error && !this.state.loading && !this.state.deleted &&
							(<>
								<Grid container spacing={3} alignItems="baseline">
									<Grid item xs={10}>
										<h1>Domain: {this.state.data.spec.domainName}</h1>
									</Grid>
									<Grid item xs={2}>
										<Button
											key={this.props.id} variant="contained"
											color="primary" startIcon={<DeleteForeverIcon />}
											className={useStyles.button}
											onClick={this.handleDeleteClicked}>
											Delete
										</Button>
									</Grid>
								</Grid>

								<DomainNameSpec id={this.props.id} spec={this.state.data.spec} />
								<DomainNameStatus id={this.props.id} status={this.state.data.status} onRefreshClicked={this.handleStatusRefreshClicked} />
							</>)
						}

					</CardContent>
				</Card>
				<Box key={"box-" + this.props.id} paddingTop={2} />
			</>
		)
	}
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
					<Button key={props.id} variant="contained" color="primary" startIcon={<RefreshIcon />}
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
