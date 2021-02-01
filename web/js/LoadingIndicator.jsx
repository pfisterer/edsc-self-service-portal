import React from 'react';
import { PulseLoader } from "react-spinners";

export default function LoadingIndicator(props) {
	const [display, setDisplay] = React.useState(false);

	React.useEffect(() => {
		const timeoutId = setTimeout(() => setDisplay(true), props.deferDisplayMs || 200)
		return () => clearTimeout(timeoutId)
	}, [])

	return display ? <PulseLoader height="10px" width="5px" radius="2px" margin="2px" color="grey" /> : ""
}