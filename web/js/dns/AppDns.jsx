import React, { Suspense } from 'react';
import useFetch from 'use-http'
import { Card, CardContent } from '@material-ui/core';
import useStyles from '../styles.jsx'
import DomainName from './DomainName.jsx'
import AvailableDomainForm from './AvailableDomainForm.jsx'
import LoadingIndicator from '../LoadingIndicator.jsx'

export default function AppDns() {
	const options = { loading: true, cachePolicy: 'no-cache', suspense: true }

	const {
		get: getAvailableDomains,
		error: availableDomainsError,
		data: availableDomains = []
	} = useFetch('api/v1/dns/domains/available', options, [])

	const {
		get: getExistingDomains,
		error: existingDomainsError,
		data: existingDomains = []
	} = useFetch('api/v1/dns/domains/list', options, [])

	function onContentsChanged() {
		getExistingDomains()
		getAvailableDomains()
	}

	return <>
		<Suspense fallback={<LoadingIndicator />}>
			{/* ----------- Available Domains ------------------- */}
			<h1>Available Domains</h1>
			<Card variant="outlined" className={useStyles.root}>
				<CardContent>
					<DomainsContent type="available" error={availableDomainsError} domains={availableDomains} />
				</CardContent>
			</Card>
		</Suspense>

		{/* ----------- Existing Domains ------------------- */}
		<Suspense fallback={<LoadingIndicator />}>
			<DomainsContent type="existing" error={existingDomainsError} domains={existingDomains} onContentsChanged={onContentsChanged} />
		</Suspense>

	</>
}

function DomainsContent(props) {
	if (props.error) {
		return <h3>Error loading the available domains for your account.</h3>

	} else if (props.domains && props.domains.length > 0) {
		return <>{props.domains.map(domain =>
			props.type === "available" ?
				<AvailableDomainForm key={domain} domain={domain} onContentsChanged={onContentsChanged} />
				:
				<DomainName key={domain} id={domain} onContentsChanged={props.onContentsChanged} />
		)}</>
	} else {
		return <h3>There are no available domains for your account.</h3>
	}
}
