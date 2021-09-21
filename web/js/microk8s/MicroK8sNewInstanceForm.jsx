import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Switch } from 'formik-material-ui';
import { Card, CardContent, Grid, Button, LinearProgress, FormControlLabel } from '@material-ui/core'
import AddBox from '@material-ui/icons/AddBox'
import useStyles from '../styles.jsx'

let defaultValues = {
	instance_name: "",
	openstack_username: "",
	openstack_auth_url: "http://controller.4c.dhbw-mannheim.de:5000/v3",
	openstack_password: "",
	openstack_domain_name: "default",
	openstack_project: "",
	openstack_user_domain_name: "default",
	image: "a0a1c616-f4f3-429d-8de9-8e74b5df805c",
	flavor: "m1.large",
	security_group: "default",
	key_name: "",
	external_network_name: "ext-net-201",
	floating_ip_pool: "ext-net-201",
	dns_server1: "1.1.1.1",
	dns_server2: "8.8.8.8",
	microk8s_version: "1.20/stable",
	enable_nginx: true
}

export default function MicroK8sNewInstanceForm(props) {
	const [editing, setEditing] = useState(false)
	const [errorMsg, setErrorMsg] = useState(undefined)

	let handleSubmitClicked = (values, { setSubmitting }) => {
		fetch(`api/v1/microk8s/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(values)
		}).then((res) => {
			setSubmitting(false)

			if (res.status === 200) {
				setEditing(false)
				setErrorMsg(undefined)

				//notify parent
				if (props.onContentChanged)
					props.onContentChanged();

			} else {
				res.text().then(text => {
					setErrorMsg(`${res.status} (${res.statusText}): ${text}`)
				}).catch(() => {
					setErrorMsg(`${res.status} (${res.statusText}): ${text}`)
				})

			}

		}).catch(error => {
			console.log("Error, error = ", error)
			setErrorMsg(error)
			setSubmitting(false)
		})

	}

	let handleCancelClicked = () => {
		setEditing(false)
		setErrorMsg(undefined)
	}

	function renderCreateButton() {
		return <Card variant="outlined" className={useStyles.root}>
			<CardContent>
				<Button variant="contained" color="primary" startIcon={<AddBox />} className={useStyles.button}
					onClick={() => setEditing(true)}>
					Create new MicroK8s instance
				</Button>
			</CardContent>
		</Card>
	}

	function renderErrorMessage() {
		const wordWrapStyle = { whiteSpace: 'pre-wrap', wordWrap: 'break-word', wordBreak: 'break-all', overflowWrap: 'break-word', lineBreak: 'strict', display: 'inline-block' }

		return <>
			<h3>An error occured</h3>
			<Card variant="outlined" className={useStyles.root}>
				<CardContent>
					<pre style={wordWrapStyle}>{errorMsg}</pre>
				</CardContent>
			</Card>
		</>
	}

	function renderNewInstanceForm() {

		return (
			<>
				<h2>Create new MicroK8s instance</h2>
				<Card variant="outlined" className={useStyles.root}>
					<CardContent>
						<p>
							Please specify required values. See <a href="https://github.com/pfisterer/edsc-microk8s-controller" target="_blank">pfisterer/edsc-microk8s-controller</a> for details.
						</p>
						<Formik
							initialValues={defaultValues}
							validate={values => { /* TODO  TODO  TODO  TODO  TODO  TODO  TODO  TODO  */ }}
							onSubmit={handleSubmitClicked}
						>
							{({ submitForm, isSubmitting }) => (
								<Form>
									<Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={3}>
										<Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
											<Field component={TextField} name="instance_name" type="text" label="Custom Instance Name" fullWidth={true} />
										</Grid>
										<Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
											<Field component={TextField} name="openstack_username" type="text" label="OpenStack Username" fullWidth={true} />
										</Grid>
										<Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
											<Field component={TextField} name="openstack_password" type="password" label="OpenStack Password" fullWidth={true} />
										</Grid>
										<Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
											<Field component={TextField} name="openstack_auth_url" type="text" label="OpenStack Auth URL" fullWidth={true} />
										</Grid>
										<Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
											<Field component={TextField} name="openstack_domain_name" type="text" label="OpenStack Domain Name" fullWidth={true} />
										</Grid>
										<Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
											<Field component={TextField} name="openstack_project" type="text" label="OpenStack Project" fullWidth={true} />
										</Grid>
										<Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
											<Field component={TextField} name="openstack_user_domain_name" type="text" label="OpenStack User Domain Name" fullWidth={true} />
										</Grid>
										<Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
											<Field component={TextField} name="image" type="text" label="OpenStack Image" fullWidth={true} />
										</Grid>
										<Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
											<Field component={TextField} name="flavor" type="text" label="OpenStack Flavor" fullWidth={true} />
										</Grid>
										<Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
											<Field component={TextField} name="security_group" type="text" label="OpenStack Security Group" fullWidth={true} />
										</Grid>
										<Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
											<Field component={TextField} name="key_name" type="text" label="OpenStack Key Name" fullWidth={true} />
										</Grid>
										<Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
											<Field component={TextField} name="external_network_name" type="text" label="OpenStack External Network" fullWidth={true} />
										</Grid>
										<Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
											<Field component={TextField} name="floating_ip_pool" type="text" label="OpenStack Floating IP Pool" fullWidth={true} />
										</Grid>
										<Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
											<Field component={TextField} name="dns_server1" type="text" label="Virtual Machine DNS Server 1 " fullWidth={true} />
										</Grid>
										<Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
											<Field component={TextField} name="dns_server2" type="text" label="Virtual Machine DNS Server 2" fullWidth={true} />
										</Grid>
										<Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
											<Field component={TextField} name="microk8s_version" type="text" label="MicroK8s Version" fullWidth={true} />
										</Grid>
										<Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
											<FormControlLabel control={<Field component={Switch} type="checkbox" name="enable_nginx" />} label="Enable NGINX ingress" />
										</Grid>
									</Grid>

									<br />
									{isSubmitting && <LinearProgress />}
									<br />
									<br />
									<Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={3}>
										<Grid item>
											<Button variant="contained" color="primary" disabled={isSubmitting} onClick={submitForm}>Submit</Button>
										</Grid>
										<Grid item>
											<Button variant="contained" color="secondary" disabled={isSubmitting} onClick={handleCancelClicked}>Cancel</Button>
										</Grid>
									</Grid>

								</Form>
							)}
						</Formik>
					</CardContent>
				</Card>
			</>)
	}

	let err = errorMsg ? renderErrorMessage() : <></>

	return <>
		{editing ? renderNewInstanceForm() : renderCreateButton()}
		{err}
	</>
}
