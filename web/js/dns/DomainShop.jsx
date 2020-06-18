import React, { Component } from 'react'
import { Card, CardContent, Grid, Button } from '@material-ui/core'

import useStyles from '../styles.jsx'
import AvailableDomainForm from './AvailableDomainForm.jsx'

export default class DomainShop extends Component {
	state = {
		domains: [],
		error: null
	}

	refreshState() {
		fetch('api/v1/dns/domains/available')
			.then(res => { if (!res.ok) { throw res.body } else return res.json() })
			.then(domains => this.setState({ domains: domains, error: null }))
			.catch(error => this.setState({ error, domains: [] }))
	}

	onContentChanged = () => {
		this.refreshState()

		if (this.props.onContentChanged)
			this.props.onContentChanged()
	}

	componentDidMount() {
		this.refreshState()
	}

	renderError() {
		return <>Error loading the list of available domains ({JSON.stringify(this.state.error)})</>
	}

	renderNoAvailableDomains() {
		return "Currently, no additional domains are available for your account."
	}

	renderAvailableDomains() {
		return this.state.domains.map(domain =>
			<AvailableDomainForm key={domain} domain={domain} onContentChanged={this.onContentChanged} />, this)
	}

	render() {
		return (
			<>
				<h1>Available Domains</h1>
				<Card variant="outlined" className={useStyles.root}>
					<CardContent>
						{this.state.error && this.renderError()}
						{!this.state.error && this.state.domains.length === 0 && this.renderNoAvailableDomains()}
						{!this.state.error && this.state.domains.length !== 0 && this.renderAvailableDomains()}
					</CardContent>
				</Card>
			</>)
	}

}
