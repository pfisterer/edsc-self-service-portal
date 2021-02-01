import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Grid, Typography, Card, CardContent, Button } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import useStyles from '../styles.jsx'

const key_heading_list = [
	["kubeconfig", "Kubeconfig"],
	["serverlist", "Server List"],
	["ssh_priv", "SSH Private Key"],
	["ssh_pub", "SSH Public Key"],
	["exit_code", "Exit Code"],
	["log_output", "Log Output"],
]

export default function MicroK8s(props) {
	const object = props.microk8s

	const wordWrapStyle = { whiteSpace: 'pre-wrap', wordWrap: 'break-word', wordBreak: 'break-all', overflowWrap: 'break-word', lineBreak: 'strict', display: 'inline-block' }
	const success = object.status && object.status.exit_code && object.status.exit_code == 0

	let renderStatus = (object) => {
		if (object.status && object.status.exit_code) {
			return object.status.exit_code == 0 ? "Ok, finished successfully." : "An error occured, see below for details"
		} else if (object.status && object.status.controller_status) {
			return object.status.controller_status
		} else {
			return "No status available yet, this may take a while. Please wait..."
		}
	}

	let renderAccordion = (key, heading, content) => {
		return <Accordion key={key} >
			<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" >
				<Typography className={useStyles.heading}>{heading}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<pre style={wordWrapStyle}>{content}</pre>
			</AccordionDetails>
		</Accordion>
	}

	return (<Card variant="outlined" className={useStyles.root}>
		<CardContent>

			<Grid container spacing={3} alignItems="center">
				<Grid item xs={10}>
					<h2>
						{success ?
							<VerifiedUserIcon color="secondary" /> :
							<NewReleasesIcon color="error" />}
						Instance: {object.spec.instance_name}
					</h2>
				</Grid>
				<Grid item xs={2} style={{ textAlign: "right" }}>
					<Button
						variant="contained"
						color="primary"
						startIcon={<DeleteForeverIcon />}
						className={useStyles.button}
						onClick={() => props.handleDeleteClicked(object)}>
						Delete
					</Button>
				</Grid>
			</Grid>

			<Card variant="outlined" className={useStyles.root} key={object.metadata.name}>
				<CardContent>
					<h3>Status</h3>
					{renderStatus(object)}
				</CardContent>
			</Card>

			{object.status && key_heading_list.map(key_heading => {
				let contents = object.status[key_heading[0]]
				return contents ? renderAccordion(key_heading[0], key_heading[1], contents) : ""
			})
			}

		</CardContent>
	</Card >)

}
