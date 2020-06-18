import React from 'react';
import DomainNameList from './DomainNameList.jsx';
import DomainShop from './DomainShop.jsx';

export default class Dns extends React.Component {

	constructor(props) {
		super(props)
	}

	shopContentChanged = () => {
		this.refs.domainNameList.refreshState()
	}

	domainListContentChanged = () => {
		this.refs.domainShop.refreshState()
	}

	render() {
		return <>
			<DomainShop onContentChanged={this.shopContentChanged} ref="domainShop" />
			<DomainNameList onContentChanged={this.domainListContentChanged} ref="domainNameList" />
		</>
	}

}
