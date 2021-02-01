import React, { Suspense } from 'react';
import { Grid, Button } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh'
import useFetch from 'use-http'
import useStyles from '../styles.jsx'

import MicroK8sCard from './MicroK8sCard.jsx'
import MicroK8sNewInstanceForm from './MicroK8sNewInstanceForm.jsx'

function MicroK8sList(props) {
	const options = { loading: true, cachePolicy: 'no-cache', suspense: true }
	const { get, del, error, data = [] } = useFetch('api/v1/microk8s/', options, [])
	const handleRefreshClicked = () => { console.log("Refreshing"); get(); }
	const handleDeleteClicked = (object) => { console.log("DELETE"); del(object.metadata.name).finally(handleRefreshClicked()); }

	return <>
		<Grid container spacing={3} alignItems="baseline">
			<Grid item xs={10}>
				<h2>MicroK8s instances</h2>
			</Grid>
			<Grid item xs={2} style={{ textAlign: "right" }}>
				<Button key={props.id} variant="contained" color="secondary" startIcon={<RefreshIcon />}
					className={useStyles.button} onClick={handleRefreshClicked}>
					Refresh
				</Button>
			</Grid>
		</Grid>

		{error && 'Error: ' + error}

		{!error && Array.isArray(data) && data.length > 0 ?
			data.map(obj => <MicroK8sCard key={obj.metadata.name} microk8s={obj} handleDeleteClicked={handleDeleteClicked} />)
			:
			<strong>No instances exist</strong>
		}
	</>
}


export default function MicroK8s(props) {
	const options = { loading: true, cachePolicy: 'no-cache', suspense: true }
	const { get, del, error, data = [] } = useFetch('api/v1/microk8s/', options, [])
	const handleRefreshClicked = () => { console.log("Refreshing"); get(); }
	const handleDeleteClicked = (object) => { console.log("DELETE"); del(object.metadata.name).finally(handleRefreshClicked()); }

	let contentChanged = () => { }

	return <>
		<h1>MicroK8s</h1>
		<MicroK8sNewInstanceForm onContentChanged={contentChanged} />
		<Suspense fallback='Loading...'>
			<MicroK8sList />
		</Suspense>
	</>

}
