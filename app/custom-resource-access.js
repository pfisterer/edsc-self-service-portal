const k8s = require('@kubernetes/client-node');

class CrAccess {

	constructor(crdGroup, crdVersion, crdPlural, options) {
		this.log = options.logger ? options.logger("CrAccess") : console

		this.crdGroup = crdGroup;
		this.crdVersion = crdVersion;
		this.crdPlural = crdPlural

		this.namespace = options.namespace

		this.kubeConfig = new k8s.KubeConfig();
		this.kubeConfig.loadFromDefault();
		this.customObjectsApi = this.kubeConfig.makeApiClient(k8s.CustomObjectsApi)
	}

	getCustomObjectsApi() {
		return this.customObjectsApi
	}

	async listItems() {
		//this.log.debug(`listItems: group=${this.crdGroup}, crdVersion=${this.crdVersion}, crdPlural=${this.crdPlural}`)

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

	async deleteItem(name) {
		let body = {} // https://github.com/kubernetes-client/java/blob/master/kubernetes/docs/V1DeleteOptions.md

		return await this.customObjectsApi.deleteNamespacedCustomObject(
			this.crdGroup,
			this.crdVersion,
			this.namespace,
			this.crdPlural,
			name, body)
	}

	async createItem(cr) {
		return await this.customObjectsApi.createNamespacedCustomObject(
			this.crdGroup,
			this.crdVersion,
			this.namespace,
			this.crdPlural,
			cr)
	}

}

module.exports = CrAccess