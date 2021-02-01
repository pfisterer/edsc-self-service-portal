import React, { Suspense } from 'react';
import useFetch from 'use-http'
import { Card, CardContent } from '@material-ui/core';
import useStyles from '../styles.jsx'
import DomainName from './DomainName.jsx'
import AvailableDomainForm from './AvailableDomainForm.jsx'

function NoAvailableDomains() {
	return <h3>There are no available domains for your account.</h3>
}

function AvailableDomainsError() {
	return <h3>Error loading the available domains for your account.</h3>
}

export default function AppDns() {
	const options = { loading: true, cachePolicy: 'no-cache', suspense: true }
	const { get: getAvailableDomains, error: availableDomainsError, data: availableDomains = [] } = useFetch('api/v1/dns/domains/available', options, [])
	const { get: getExistingDomains, error: existingDomainsError, data: existingDomains = [] } = useFetch('api/v1/dns/domains/list', options, [])

	function onContentsChanged() {
		getExistingDomains()
		getAvailableDomains()
	}

	return <>
		<Suspense fallback='Loading available domains...'>
			<h1>Available Domains</h1>
			<Card variant="outlined" className={useStyles.root}>
				<CardContent>
					{availableDomainsError && <AvailableDomainsError />}
					{(!availableDomains || availableDomains.length == 0) && <NoAvailableDomains />}

					{availableDomains != null && availableDomains.length > 0 && availableDomains.map(domain =>
						<AvailableDomainForm key={domain} domain={domain} onContentsChanged={onContentsChanged} />)
					}
				</CardContent>
			</Card>
		</Suspense>

		<Suspense fallback='Loading existing domains...'>
			{existingDomainsError ? <h3>Error loading existing domains: {existingDomainsError}</h3> :
				existingDomains.map(domain =>
					<DomainName key={domain} id={domain} onContentsChanged={onContentsChanged} />)}
		</Suspense>
	</>
}
