import React, { Component } from 'react';
import { Paper, Grid, TableContainer, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import useStyles from './styles.jsx'

const classes = useStyles;

export default function Dns() {
	return (<DomainNameList />)
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
		} else if (this.state.domains.length === 0) {
			return (<React.Fragment><h1>No Domains exist</h1></React.Fragment>)
		} else {
			return (
				<Grid container spacing={2}>
					{this.state.domains.map(domain =>
						<Grid key={domain} item xs={12}>
							<h1>Domain: {domain}</h1>
							<DomainName id={domain} />
						</Grid>
					)}
				</Grid>
			)
		}
	}
}

class DomainName extends Component {
	state = { dnssec: {}, error: null }

	componentDidMount() {
		fetch(`api/v1/dns/domains/${this.props.id}`)
			.then(res => res.json())
			.then(data => this.setState({ dnssec: data, error: null }))
			.catch(err => this.setState({ error: err }))
	}

	render() {
		if (this.state.error) {
			return (<h1>No domain with id {this.props.id} exists</h1>)
		} else if (this.state.dnssec.spec) {
			return (
				<React.Fragment>
					<h2>Specification</h2>
					<DomainNameSpec id={this.props.id} spec={this.state.dnssec.spec} />
					<h2>Status</h2>
					<DomainNameStatus id={this.props.id} status={this.state.dnssec.status} />
				</React.Fragment>
			)
		} else {
			return (<div />);
		}
	}
}

function DomainNameSpec(props) {
	return (
		<TableContainer component={Paper} >
			<Table className={classes.table} aria-label="simple table">
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
	)
}

function DomainNameStatus(props) {
	if (props.status) {
		return (
			<TableContainer component={Paper} >
				<Table className={classes.table} aria-label="simple table">
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
		)
	} else {
		return (
			<React.Fragment>
				<b>
					Status unknown yet, please retry...
					</b>
			</React.Fragment>
		)
	}

}
