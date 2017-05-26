var cfenv = require('cfenv'),
    validate = require ('jsonschema').validate;

class ServiceBroker {

    constructor() {
        this.name = 'overview-broker';
        this.description = 'Provides an overview of any service instances and bindings that have been created by a platform.';
        this.id = '27068e11-6853-0892-fc7f-13fe7a8dc5bd';
        this.bindable = true;
        this.tags = [ 'overview-broker' ];
        this.plans = [
            {
                id: 'b2bbb243-372d-570c-28d6-f708a1a5d83b',
                name: 'simple',
                description: 'A very simple plan.',
                free: true
            },
            {
                id: 'b3c9e1fb-3e37-fcb8-be0a-df68d95c40b0',
                name: 'complex',
                description: 'A more complicated plan.',
                free: true,
                schemas: {
                    service_instance: {
                        create: this.getSchema(),
                        update: this.getSchema()
                    },
                    service_binding: {
                        create: this.getSchema()
                    }
                }
            }
        ];
        this.storageKey = process.env.KV_KEY_NAME;
        this.dashboardUrl = cfenv.getAppEnv().url + '/dashboard';
        console.log('Broker created\n   Name: %s\n   ID: %s\n   Persistence: %s', this.name, this.id, (process.env.ENABLE_PERSISTENCE ? 'Enabled' : 'Disabled'));
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getID() {
        return this.id;
    }

    getBindable() {
        return this.bindable;
    }

    getTags() {
        return this.tags;
    }

    getPlans() {
        return this.plans;
    }

    getStorageKey() {
        return this.storageKey;
    }

    getDashboardUrl() {
        return this.dashboardUrl;
    }

    getPlans() {
        return this.plans;
    }

    getPlanForService(serviceId, planId) {
        if (serviceId != this.id) {
            return null;
        }
        for (var i = 0; i < this.plans.length; i++) {
            if (planId == this.plans[i].id) {
                return this.plans[i];
            }
        }
        return null;
    }

    getSchema() {
        return {
            $schema: 'http://json-schema.org/draft-04/schema#',
            additionalProperties: false,
            type: 'object',
            properties: {
                rainbow: {
                    type: 'boolean',
                    default: false
                },
                name: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 30
                },
                config: {
                    type: 'object',
                    properties: {
                        'url': {
                            type: 'string'
                        },
                        'port': {
                            type: 'integer'
                        }
                    }
                }
            },
            required: [ 'name' ]
        }
    }

    validateParameters(schema, parameters) {
        var result = validate(parameters, schema);
        if (!result.valid) {
            console.log('Validation failed: ' + result.errors.toString());
            return result.errors.toString();
        }
        else {
            console.log('Validation succeeded');
            return null;
        }
    }

}

module.exports = ServiceBroker;
