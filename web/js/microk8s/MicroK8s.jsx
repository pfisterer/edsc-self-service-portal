import React from 'react';
import MicroK8sNewInstanceForm from './MicroK8sNewInstanceForm.jsx'
import MicroK8sList from './MicroK8sList.jsx'

export default function MicroK8s(props) {

	let contentChanged = () => { }

	return <>
		<h1>MicroK8s</h1>
		<MicroK8sNewInstanceForm onContentChanged={contentChanged} />
		<MicroK8sList />
	</>

}
