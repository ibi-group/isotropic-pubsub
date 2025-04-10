import _defaultSymbol from './default-symbol.js';
import _Dispatcher from './dispatcher.js';
import _make from 'isotropic-make';
import _PropertyChainer from 'isotropic-property-chainer';
import _Subscription from './subscription.js';

const _protectedDefineDispatcherMethod = function ({
        config = {},
        eventName
    }) {
        this._dispatcherByEventName[eventName] = typeof config.newState === 'function' && typeof config.publish === 'function' && typeof config.subscribe === 'function' ?
            config :
            (config.Dispatcher || this._Dispatcher)({
                ...config,
                name: eventName
            });

        return this;
    },
    _publicDefineDispatcherMethod = function (eventName, config) {
        if (typeof eventName === 'string') {
            this._defineDispatcher({
                config,
                eventName
            });
        } else if (Array.isArray(eventName)) {
            eventName.forEach(eventName => {
                this._defineDispatcher({
                    config,
                    eventName
                });
            });
        } else {
            Reflect.ownKeys(eventName).forEach(key => {
                this._defineDispatcher({
                    config: eventName[key],
                    eventName: key
                });
            });
        }

        return this;
    };

export default _make([
    _PropertyChainer
], {
    addDistributor (distributor) {
        if (!this._distributors) {
            this._distributors = new Set();
        }

        if (Array.isArray(distributor) || distributor instanceof Set) {
            distributor.forEach(distributor => {
                this._distributors.add(distributor);
            });
        } else {
            this._distributors.add(distributor);
        }

        return this;
    },
    bulkSubscribe (bulkConfig) {
        if (!Array.isArray(bulkConfig)) {
            bulkConfig = [
                bulkConfig
            ];
        }

        const subscriptions = bulkConfig.reduce((subscriptions, bulkConfig) => {
            if (typeof bulkConfig.eventName === 'string') {
                if (Array.isArray(bulkConfig.config)) {
                    bulkConfig.config.forEach(config => {
                        const subscription = this.subscribe(bulkConfig.stageName, bulkConfig.eventName, this._normalizeBulkSubscribeConfig(bulkConfig, config));

                        if (subscription.subscribed) {
                            subscriptions.push(subscription);
                        }
                    });
                } else {
                    const subscription = this.subscribe(bulkConfig.stageName, bulkConfig.eventName, this._normalizeBulkSubscribeConfig(bulkConfig));

                    if (subscription.subscribed) {
                        subscriptions.push(subscription);
                    }
                }
            } else if (Array.isArray(bulkConfig.eventName)) {
                if (Array.isArray(bulkConfig.config)) {
                    bulkConfig.eventName.forEach(eventName => {
                        bulkConfig.config.forEach(config => {
                            const subscription = this.subscribe(bulkConfig.stageName, eventName, this._normalizeBulkSubscribeConfig(bulkConfig, config));

                            if (subscription.subscribed) {
                                subscriptions.push(subscription);
                            }
                        });
                    });
                } else {
                    bulkConfig.eventName.forEach(eventName => {
                        const subscription = this.subscribe(bulkConfig.stageName, eventName, this._normalizeBulkSubscribeConfig(bulkConfig));

                        if (subscription.subscribed) {
                            subscriptions.push(subscription);
                        }
                    });
                }
            } else {
                Object.keys(bulkConfig.eventName).forEach(key => {
                    const config = bulkConfig.eventName[key];

                    if (Array.isArray(config)) {
                        config.forEach(config => {
                            const subscription = this.subscribe(bulkConfig.stageName, key, this._normalizeBulkSubscribeConfig(bulkConfig, config));

                            if (subscription.subscribed) {
                                subscriptions.push(subscription);
                            }
                        });
                    } else {
                        const subscription = this.subscribe(bulkConfig.stageName, key, this._normalizeBulkSubscribeConfig(bulkConfig, config));

                        if (subscription.subscribed) {
                            subscriptions.push(subscription);
                        }
                    }
                });
            }

            return subscriptions;
        }, []);

        return subscriptions.length === 1 ?
            subscriptions[0] :
            _Subscription({
                get subscribed () {
                    return this.subscriptions.some(subscription => subscription.subscribed);
                },
                subscriptions,
                unsubscribe () {
                    this.subscriptions.forEach(subscription => {
                        subscription.unsubscribe();
                    });
                }
            });
    },
    bulkUnsubscribe (stageName, eventName) {
        let unsubscribed = false;

        if (typeof eventName === 'undefined') {
            if (typeof stageName === 'undefined') {
                for (const state of Object.values(this._eventState)) {
                    for (const subscriptions of Object.values(state.subscriptions)) {
                        for (const subscription of subscriptions.values()) {
                            if (subscription.unsubscribe({
                                publicUnsubscription: true
                            })) {
                                unsubscribed = true;
                            }
                        }
                    }
                }
            } else {
                if (!Array.isArray(stageName)) {
                    stageName = [
                        stageName
                    ];
                }

                stageName.forEach(config => {
                    let eventName,
                        stageName;

                    switch (typeof config) {
                        case 'string':
                        case 'symbol':
                            eventName = config;
                            break;
                        default:
                            eventName = config.eventName;
                            stageName = config.stageName;
                    }

                    const state = this._eventState[eventName];

                    if (state) {
                        for (const subscriptions of stageName ?
                            [
                                state.subscriptions[stageName] || new Map()
                            ] :
                            Object.values(state.subscriptions)) {
                            for (const subscription of subscriptions.values()) {
                                if (subscription.unsubscribe({
                                    publicUnsubscription: true
                                })) {
                                    unsubscribed = true;
                                }
                            }
                        }
                    }
                });
            }
        } else {
            if (!Array.isArray(eventName)) {
                eventName = [
                    eventName
                ];
            }

            if (!Array.isArray(stageName)) {
                stageName = [
                    stageName
                ];
            }

            eventName.forEach(eventName => {
                const state = this._eventState[eventName];

                if (state) {
                    stageName.forEach(stageName => {
                        const subscriptions = state.subscriptions[stageName];

                        if (subscriptions) {
                            for (const subscription of subscriptions.values()) {
                                if (subscription.unsubscribe({
                                    publicUnsubscription: true
                                })) {
                                    unsubscribed = true;
                                }
                            }
                        }
                    });
                }
            });
        }

        return unsubscribed;
    },
    defineDispatcher: _publicDefineDispatcherMethod,
    destroy (...args) {
        return this._publish('destroy', {
            args
        });
    },
    get destroyed () {
        return this._destroyed;
    },
    publish (eventName, data) {
        this._getDispatcher(eventName).publish({
            data,
            eventName,
            getDistributionPath: () => this._getDistributionPath(eventName),
            lifecycleHost: this,
            publicPublish: true,
            publisher: this,
            state: this._getEventState(eventName)
        });

        return this;
    },
    removeDistributor (distributor) {
        if (!this._distributors) {
            return this;
        }

        if (Array.isArray(distributor) || distributor instanceof Set) {
            distributor.forEach(distributor => {
                this._distributors.delete(distributor);
            });
        } else {
            this._distributors.delete(distributor);
        }

        if (!this._distributors.size) {
            this._distributors = null;
        }

        return this;
    },
    subscribe (stageName, eventName, config) {
        return this._getDispatcher(eventName).subscribe({
            host: this,
            ...typeof config === 'object' ?
                config :
                {
                    callbackFunction: config
                },
            lifecycleHost: this,
            publicSubscription: true,
            stageName,
            state: this._getEventState(eventName)
        });
    },
    _bulkSubscribe (bulkConfig) {
        if (!Array.isArray(bulkConfig)) {
            bulkConfig = [
                bulkConfig
            ];
        }

        const subscriptions = bulkConfig.reduce((subscriptions, bulkConfig) => {
            if (typeof bulkConfig.eventName === 'string') {
                if (Array.isArray(bulkConfig.config)) {
                    bulkConfig.config.forEach(config => {
                        const subscription = this._subscribe(bulkConfig.stageName, bulkConfig.eventName, this._normalizeBulkSubscribeConfig(bulkConfig, config));

                        if (subscription.subscribed) {
                            subscriptions.push(subscription);
                        }
                    });
                } else {
                    const subscription = this._subscribe(bulkConfig.stageName, bulkConfig.eventName, this._normalizeBulkSubscribeConfig(bulkConfig));

                    if (subscription.subscribed) {
                        subscriptions.push(subscription);
                    }
                }
            } else if (Array.isArray(bulkConfig.eventName)) {
                if (Array.isArray(bulkConfig.config)) {
                    bulkConfig.eventName.forEach(eventName => {
                        bulkConfig.config.forEach(config => {
                            const subscription = this._subscribe(bulkConfig.stageName, eventName, this._normalizeBulkSubscribeConfig(bulkConfig, config));

                            if (subscription.subscribed) {
                                subscriptions.push(subscription);
                            }
                        });
                    });
                } else {
                    bulkConfig.eventName.forEach(eventName => {
                        const subscription = this._subscribe(bulkConfig.stageName, eventName, this._normalizeBulkSubscribeConfig(bulkConfig));

                        if (subscription.subscribed) {
                            subscriptions.push(subscription);
                        }
                    });
                }
            } else {
                Object.keys(bulkConfig.eventName).forEach(key => {
                    const config = bulkConfig.eventName[key];

                    if (Array.isArray(config)) {
                        config.forEach(config => {
                            const subscription = this._subscribe(bulkConfig.stageName, key, this._normalizeBulkSubscribeConfig(bulkConfig, config));

                            if (subscription.subscribed) {
                                subscriptions.push(subscription);
                            }
                        });
                    } else {
                        const subscription = this._subscribe(bulkConfig.stageName, key, this._normalizeBulkSubscribeConfig(bulkConfig, config));

                        if (subscription.subscribed) {
                            subscriptions.push(subscription);
                        }
                    }
                });
            }

            return subscriptions;
        }, []);

        return subscriptions.length === 1 ?
            subscriptions[0] :
            _Subscription({
                get subscribed () {
                    return this.subscriptions.some(subscription => subscription.subscribed);
                },
                subscriptions,
                unsubscribe () {
                    this.subscriptions.forEach(subscription => {
                        subscription.unsubscribe();
                    });
                }
            });
    },
    _bulkUnsubscribe (stageName, eventName) {
        let unsubscribed = false;

        if (typeof eventName === 'undefined') {
            if (typeof stageName === 'undefined') {
                for (const state of Object.values(this._eventState)) {
                    for (const subscriptions of Object.values(state.subscriptions)) {
                        for (const subscription of subscriptions.values()) {
                            if (subscription.unsubscribe()) {
                                unsubscribed = true;
                            }
                        }
                    }
                }
            } else {
                if (!Array.isArray(stageName)) {
                    stageName = [
                        stageName
                    ];
                }

                stageName.forEach(config => {
                    let eventName,
                        stageName;

                    switch (typeof config) {
                        case 'string':
                        case 'symbol':
                            eventName = config;
                            break;
                        default:
                            eventName = config.eventName;
                            stageName = config.stageName;
                    }

                    const state = this._eventState[eventName];

                    if (state) {
                        for (const subscriptions of stageName ?
                            [
                                state.subscriptions[stageName] || new Map()
                            ] :
                            Object.values(state.subscriptions)) {
                            for (const subscription of subscriptions.values()) {
                                if (subscription.unsubscribe()) {
                                    unsubscribed = true;
                                }
                            }
                        }
                    }
                });
            }
        } else {
            if (!Array.isArray(eventName)) {
                eventName = [
                    eventName
                ];
            }

            if (!Array.isArray(stageName)) {
                stageName = [
                    stageName
                ];
            }

            eventName.forEach(eventName => {
                const state = this._eventState[eventName];

                if (state) {
                    stageName.forEach(stageName => {
                        const subscriptions = state.subscriptions[stageName];

                        if (subscriptions) {
                            for (const subscription of subscriptions.values()) {
                                if (subscription.unsubscribe()) {
                                    unsubscribed = true;
                                }
                            }
                        }
                    });
                }
            });
        }

        return unsubscribed;
    },
    _defineDispatcher: _protectedDefineDispatcherMethod,
    _destroy (...args) {
        this._destroyed = true;

        this._publish('destroyComplete', {
            args
        });

        this._bulkUnsubscribe();

        this._dispatcherByEventName = void null;

        this._distributors = void null;

        this._eventState = void null;
    },
    _destroyComplete () {
        // empty method
    },
    get _Dispatcher () {
        return this.constructor._Dispatcher;
    },
    _eventDestroy ({
        data: {
            args
        }
    }) {
        this._destroy(...args);
    },
    _eventDestroyComplete ({
        data: {
            args
        }
    }) {
        this._destroyComplete(...args);
    },
    _getDispatcher (eventName) {
        return this._dispatcherByEventName[eventName] || this._dispatcherByEventName[_defaultSymbol];
    },
    _getDistributionPath (eventName) {
        const distributionPath = new Map([[
            this,
            this._getEventState(eventName)
        ]]);

        distributionPath.forEach((eventState, distributor) => {
            if (distributor._distributors) {
                distributor._distributors.forEach(distributor => {
                    distributionPath.set(distributor, distributor._getEventState(eventName));
                });
            }
        });

        return distributionPath;
    },
    _getEventState (eventName) {
        let eventState = this._eventState[eventName];

        if (!eventState) {
            eventState = this._getDispatcher(eventName).newState();
            this._eventState[eventName] = eventState;
        }

        return eventState;
    },
    _init (...args) {
        const [{
            pubsub
        } = {}] = args;

        Reflect.apply(_PropertyChainer.prototype._init, this, args);

        this._destroyed = false;

        this._dispatcherByEventName = Object.create(this.constructor._dispatcherByEventName);

        this._distributors = null;

        this._eventState = Object.create(null);

        if (pubsub) {
            this.defineDispatcher(pubsub);
        }

        return this;
    },
    _normalizeBulkSubscribeConfig (bulkSubscribeConfig, config = bulkSubscribeConfig.config) {
        if (bulkSubscribeConfig.once) {
            if (typeof config === 'object') {
                return {
                    ...config,
                    once: true
                };
            }

            return {
                callbackFunction: config,
                once: true
            };
        }

        return config;
    },
    _publish (eventName, data) {
        this._getDispatcher(eventName).publish({
            data,
            eventName,
            getDistributionPath: () => this._getDistributionPath(eventName),
            lifecycleHost: this,
            publisher: this,
            state: this._getEventState(eventName)
        });

        return this;
    },
    _subscribe (stageName, eventName, config) {
        return this._getDispatcher(eventName).subscribe({
            host: this,
            ...typeof config === 'object' ?
                config :
                {
                    callbackFunction: config
                },
            lifecycleHost: this,
            stageName,
            state: this._getEventState(eventName)
        });
    }
}, {
    defineDispatcher: _publicDefineDispatcherMethod,
    _addSubscriptionMethods (subscriptionMethods) {
        if (!Array.isArray(subscriptionMethods)) {
            subscriptionMethods = [
                subscriptionMethods
            ];
        }

        subscriptionMethods.forEach(stageName => {
            const onceStageName = `once${stageName.charAt(0).toUpperCase()}${stageName.substr(1)}`,
                protectedOnceStageName = `_${onceStageName}`,
                protectedStageName = `_${stageName}`;

            if (!this.prototype[stageName]) {
                this.prototype[stageName] = function (eventName, config) {
                    return this.bulkSubscribe({
                        config,
                        eventName,
                        stageName
                    });
                };
            }

            if (!this.prototype[onceStageName]) {
                this.prototype[onceStageName] = function (eventName, config) {
                    return this.bulkSubscribe({
                        config,
                        eventName,
                        once: true,
                        stageName
                    });
                };
            }

            if (!this.prototype[protectedOnceStageName]) {
                this.prototype[protectedOnceStageName] = function (eventName, config) {
                    return this._bulkSubscribe({
                        config,
                        eventName,
                        once: true,
                        stageName
                    });
                };
            }

            if (!this.prototype[protectedStageName]) {
                this.prototype[protectedStageName] = function (eventName, config) {
                    return this._bulkSubscribe({
                        config,
                        eventName,
                        stageName
                    });
                };
            }
        });
    },
    _defineDispatcher: _protectedDefineDispatcherMethod,
    _Dispatcher,
    _init (...args) {
        this._dispatcherByEventName = Object.create(null);

        Reflect.apply(_PropertyChainer._init, this, args);

        if (Object.hasOwn(this, '_pubsub')) {
            this.defineDispatcher(this._pubsub);
        }

        if (Object.hasOwn(this, '_subscriptionMethods')) {
            this._addSubscriptionMethods(this._subscriptionMethods);
        }

        return this;
    },
    _propertyChains: new Set([
        '_dispatcherByEventName'
    ]),
    _pubsub: {
        destroy: {
            completeFunction: '_eventDestroy',
            completeOnce: true,
            Dispatcher: _Dispatcher
        },
        destroyComplete: {
            completeFunction: '_eventDestroyComplete',
            Dispatcher: _Dispatcher,
            publishOnce: true
        },
        [_defaultSymbol]: {
            allowPublicPublish: true,
            allowPublicUnsubscription: true
        }
    },
    _subscriptionMethods: [
        'after',
        'before',
        'on'
    ]
});
