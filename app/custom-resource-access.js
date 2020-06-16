const k8s = require('@kubernetes/client-node');

class CrAccess {

	constructor(options) {
		this.log = options.logger ? options.logger("CrdWatcher") : console
		this.log.debug("constructor: New instance with options: ", options);

		this.crdGroup = options.crdGroup;
		this.crdVersion = options.crdVersion;
		this.crdPlural = options.crdPlural
		this.namespace = options.namespace

		this.kubeConfig = new k8s.KubeConfig();
		this.kubeConfig.loadFromDefault();
		this.customObjectsApi = this.kubeConfig.makeApiClient(k8s.CustomObjectsApi)
	}

	getCustomObjectsApi() {
		return this.customObjectsApi
	}

	async listItems() {
		const res = await this.customObjectsApi.listNamespacedCustomObject(
			this.crdGroup,
			this.crdVersion,
			this.namespace,
			this.crdPlural,
			'false',
			'', //<labelSelectorExpresson>
		);

		return res.body.items
	}

}

module.exports = CrAccess