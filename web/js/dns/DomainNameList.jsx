import React, { Component } from 'react';
import { Card, CardContent } from '@material-ui/core';
import useStyles from '../styles.jsx'
import LoadingIndicator from '../LoadingIndicator.jsx';
import DomainName from './DomainName.jsx';

export default class DomainNameList extends Component {
	state = {
		loading: true,
		domains: [],
		error: null
	}

	refreshState() {
		fetch('api/v1/dns/domains/list')
			.then(res => res.json())
			.then(data => this.setState({ domains: data, error: null, loading: false }))
			.catch(err => this.setState({ error: err, data: [], loading: false }))
	}

	componentDidMount() {
		this.refreshState();
	}

	handleOnContentChanged = () => {
		this.refreshState();
		if (this.props.onContentChanged)
			this.props.onContentChanged()
	}

	renderError() {
		return (
			<Card variant="outlined" className={useStyles.root}>
				<CardContent>
					Error loading the list of domains, error message: {JSON.stringify(this.state.error)}
				</CardContent>
			</Card>
		)
	}

	renderDomains() {
		if (this.state.domains.length > 0)
			return this.state.domains.map(domain =>
				<DomainName key={domain} id={domain} onContentChanged={this.handleOnContentChanged} />)
		else
			return "No existing domains found."
	}

	render() {
		return (
			<>
				<h1>Existing Domains</h1>
				{this.state.loading && (<LoadingIndicator />)}
				{!this.state.loading && this.state.error && this.renderError()}
				{!this.state.loading && !this.state.error && this.renderDomains()}
			</>)
	}

}
