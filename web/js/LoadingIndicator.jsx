import React from 'react';
import { FadeLoader } from "react-spinners";

export default class LoadingIndicator extends React.Component {
	state = {
		display: false,
	}

	componentDidMount() {
		this.timeoutId = setTimeout(() => this.setState({ display: true }), this.props.deferDisplayMs || 200)
	}

	componentWillUnmount() {
		clearTimeout(this.timeoutId)
	}


	render() {
		return (
			<div style={{ visibility: this.state.display ? 'visible' : 'hidden' }}>
				<FadeLoader height="10px" width="5px" radius="2px" margin="2px" color="grey" />
			</div>
		);

	}

}