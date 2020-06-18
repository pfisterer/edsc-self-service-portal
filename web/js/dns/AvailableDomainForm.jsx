import * as React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, LinearProgress } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import AddBox from '@material-ui/icons/AddBox'
import useStyles from '../styles.jsx'

export default class AvailableDomainForm extends React.Component {
	state = {
		editing: false
	}

	render() {
		return this.state.editing ? this.renderEdit() : this.renderNoEdit()
	}

	handleAddClicked = (e) => {
		e.preventDefault()
		this.setState({ editing: true })
	}

	handleCancelClicked = (e) => {
		e.preventDefault()
		this.setState({ editing: false })
	}

	handleSubmitClicked = (values, { setSubmitting }) => {

		let done = () => {
			setSubmitting(false);

			if (this.props.onContentChanged) {
				this.props.onContentChanged()
			}

			this.setState({ editing: false })
		}

		values.domainName = this.props.domain

		fetch(`api/v1/dns/domains/list`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(values)
		})
			.then(res => {
				if (!res.ok)
					setState({ error: res.body });
				else
					this.setState({ error: false });
				done()
			})
			.catch(err => {
				this.setState({ error: err })
				done()
			})

	}

	renderNoEdit() {
		return <Button key={this.props.domain}
			variant="contained" color="primary"
			startIcon={<AddBox />} className={useStyles.button}
			onClick={this.handleAddClicked}
		>
			{this.props.domain}
		</Button>
	}

	renderEdit() {
		return (
			<>
				<h2>New domain: {this.props.domain}</h2>
				<p>
					Please specify required values for this domain. See <a href="https://en.wikipedia.org/wiki/SOA_record" target="_blank">Wikipedia's SOA record article</a> to understand the meaning of the individual fields.
				</p>
				<Formik
					initialValues={{ expireSeconds: 60, minimumSeconds: 60, refreshSeconds: 60, retrySeconds: 60, ttlSeconds: 60 }}
					validate={values => { /* TODO  TODO  TODO  TODO  TODO  TODO  TODO  TODO  */ }}
					onSubmit={this.handleSubmitClicked}
				>
					{({ submitForm, isSubmitting }) => (
						<Form>
							<Field component={TextField} name="expireSeconds" type="text" label="Expire (sec)" />
							<br />
							<Field component={TextField} name="minimumSeconds" type="text" label="Minimum (sec)" />
							<br />
							<Field component={TextField} name="refreshSeconds" type="text" label="Refresh (sec)" />
							<br />
							<Field component={TextField} name="retrySeconds" type="text" label="Retry (sec)" />
							<br />
							<Field component={TextField} name="ttlSeconds" type="text" label="TTL (sec)" />
							<br />
							{isSubmitting && <LinearProgress />}
							<br />
							<br />
							<Button variant="contained" color="primary" disabled={isSubmitting} onClick={submitForm}>Submit</Button>
							<Button variant="contained" color="secondary" disabled={isSubmitting} onClick={this.handleCancelClicked}>Cancel</Button>
						</Form>
					)}
				</Formik>
			</>
		)
	}

}