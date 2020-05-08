import React, { Component } from 'react';
import { Paper, Grid, TableContainer, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import useStyles from './styles.jsx'

const classes = useStyles;

class DomainName extends Component {
	state = { dnssec: [], error: null }

	componentDidMount() {
		fetch(`api/v1/dns/domains/${this.props.id}/dnssec`)
			.then(res => res.json())
			.then(data => this.setState({ dnssec: data, error: null }))
			.catch(err => this.setState({ error: err }))
	}

	render() {
		if (this.state.error) {
			return (<h1>No domain with id {this.props.id} exists</h1>)
		} else if (this.state.dnssec.id) {
			return (
				<TableContainer component={Paper} >
					<Table className={classes.table} aria-label="simple table">
						<TableBody>
							{Object.getOwnPropertyNames(this.state.dnssec)
								.map(name => (
									<TableRow key={this.state.dnssec.id + name}>
										<TableCell>{name}</TableCell>
										<TableCell>{this.state.dnssec[name]}</TableCell>
									</TableRow>
								), this)
							}
						</TableBody>
					</Table>
				</TableContainer >
			);
		} else {
			return (<div />);
		}
	}
}

class DomainNameList extends Component {
	state = {
		domains: [],
		error: null
	}

	componentDidMount() {
		fetch('api/v1/dns/domains')
			.then(res => res.json())
			.then(data => this.setState({ domains: data, error: null }))
			.catch(err => this.setState({ error: err }))
	}

	render() {
		if (this.state.error) {
			return (
				<Grid container spacing={2}>
					<Grid key="error" item xs={12}>
						<h1>Error loading the list of domains</h1>
						Error message: {JSON.stringify(this.state.error)}
					</Grid>
				</Grid>
			)
		} else {

			return (
				<Grid container spacing={2}>
					{this.state.domains.map(domain =>
						<Grid key={domain.id} item xs={12}>
							<h1>Domain id = {domain.id}</h1>
							<DomainName id={domain.id} />
						</Grid>
					)}

				</Grid>
			)

		}

	}

}


export default function Dns() {
	return (<DomainNameList />)
}