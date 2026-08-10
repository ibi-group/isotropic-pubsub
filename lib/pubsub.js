import _defaultSymbol from './default-symbol.js';
import _Dispatcher from './dispatcher.js';
import _make from 'isotropic-make';
import _PropertyChainer from 'isotropic-property-chainer';
import _Subscription from './subscription.js';

const _createBulkSubscribeMethod = subscribeMethodName => function (bulkConfig) {
        if (!bulkConfig[Symbol.iterator]) {
            bulkConfig = [
                bulkConfig
            ];
        }

        const subscriptions = [];

        for (const bulkConfigItem of bulkConfig) {
            switch (typeof bulkConfigItem.eventName) {
                case 'string':
                case 'symbol':
                    if (typeof bulkConfigItem.config !== 'string' && bulkConfigItem.config[Symbol.iterator]) {
                        for (const config of bulkConfigItem.config) {
                            const subscription = this[subscribeMethodName](bulkConfigItem.stageName, bulkConfigItem.eventName, this._normalizeBulkSubscribeConfig(bulkConfigItem, config));

                            if (subscription.subscribed) {
                                subscriptions.push(subscription);
                            }
                        }
                    } else {
                        const subscription = this[subscribeMethodName](bulkConfigItem.stageName, bulkConfigItem.eventName, this._normalizeBulkSubscribeConfig(bulkConfigItem));

                        if (subscription.subscribed) {
                            subscriptions.push(subscription);
                        }
                    }

                    break;
                default:
                    if (bulkConfigItem.eventName[Symbol.iterator]) {
                        if (typeof bulkConfigItem.config !== 'string' && bulkConfigItem.config[Symbol.iterator]) {
                            for (const eventName of bulkConfigItem.eventName) {
                                for (const config of bulkConfigItem.config) {
                                    const subscription = this[subscribeMethodName](bulkConfigItem.stageName, eventName, this._normalizeBulkSubscribeConfig(bulkConfigItem, config));

                                    if (subscription.subscribed) {
                                        subscriptions.push(subscription);
                                    }
                                }
                            }
                        } else {
                            for (const eventName of bulkConfigItem.eventName) {
                                const subscription = this[subscribeMethodName](bulkConfigItem.stageName, eventName, this._normalizeBulkSubscribeConfig(bulkConfigItem));

                                if (subscription.subscribed) {
                                    subscriptions.push(subscription);
                                }
                            }
                        }
                    } else {
                        for (const key of Reflect.ownKeys(bulkConfigItem.eventName)) {
                            const config = bulkConfigItem.eventName[key];

                            if (typeof config !== 'string' && config[Symbol.iterator]) {
                                for (const configItem of config) {
                                    const subscription = this[subscribeMethodName](bulkConfigItem.stageName, key, this._normalizeBulkSubscribeConfig(bulkConfigItem, configItem));

                                    if (subscription.subscribed) {
                                        subscriptions.push(subscription);
                                    }
                                }
                            } else {
                                const subscription = this[subscribeMethodName](bulkConfigItem.stageName, key, this._normalizeBulkSubscribeConfig(bulkConfigItem, config));

                                if (subscription.subscribed) {
                                    subscriptions.push(subscription);
                                }
                            }
                        }
                    }

                    break;
            }
        }

        return subscriptions.length === 1 ?
            subscriptions[0] :
            _Subscription({
                get subscribed () {
                    return this.subscriptions.some(subscription => subscription.subscribed);
                },
                subscriptions,
                unsubscribe () {
                    for (const subscription of this.subscriptions) {
                        subscription.unsubscribe();
                    }
                }
            });
    },
    _createBulkUnsubscribeMethod = unsubscribeConfig => function (stageName, eventName) {
        let unsubscribed = false;

        if (typeof eventName === 'undefined') {
            if (typeof stageName === 'undefined') {
                for (const state of Object.values(this._eventState)) {
                    for (const subscriptions of Object.values(state.subscriptions)) {
                        for (const subscription of subscriptions.values()) {
                            if (subscription.unsubscribe(unsubscribeConfig)) {
                                unsubscribed = true;
                            }
                        }
                    }
                }
            } else {
                if (typeof stageName === 'string' || !stageName[Symbol.iterator]) {
                    stageName = [
                        stageName
                    ];
                }

                for (const config of stageName) {
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
                            break;
                    }

                    const state = this._eventState[eventName];

                    if (state) {
                        for (
                            const subscriptions of stageName ?
                                [
                                    state.subscriptions[stageName] || new Map()
                                ] :
                                Object.values(state.subscriptions)
                        ) {
                            for (const subscription of subscriptions.values()) {
                                if (subscription.unsubscribe(unsubscribeConfig)) {
                                    unsubscribed = true;
                                }
                            }
                        }
                    }
                }
            }
        } else {
            if (typeof eventName === 'string' || !eventName[Symbol.iterator]) {
                eventName = [
                    eventName
                ];
            }

            if (typeof stageName === 'string' || !stageName[Symbol.iterator]) {
                stageName = [
                    stageName
                ];
            }

            for (const eventNameItem of eventName) {
                const state = this._eventState[eventNameItem];

                if (state) {
                    for (const stageNameItem of stageName) {
                        const subscriptions = state.subscriptions[stageNameItem];

                        if (subscriptions) {
                            for (const subscription of subscriptions.values()) {
                                if (subscription.unsubscribe(unsubscribeConfig)) {
                                    unsubscribed = true;
                                }
                            }
                        }
                    }
                }
            }
        }

        return unsubscribed;
    },
    _protectedDefineDispatcherMethod = function ({
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
        switch (typeof eventName) {
            case 'string':
            case 'symbol':
                this._defineDispatcher({
                    config,
                    eventName
                });

                break;
            default:
                if (eventName[Symbol.iterator]) {
                    for (const eventNameItem of eventName) {
                        this._defineDispatcher({
                            config,
                            eventName: eventNameItem
                        });
                    }
                } else {
                    for (const key of Reflect.ownKeys(eventName)) {
                        this._defineDispatcher({
                            config: eventName[key],
                            eventName: key
                        });
                    }
                }

                break;
        }

        return this;
    };

export default _make('Pubsub', [
    _PropertyChainer
], {
    addDistributor (distributor) {
        if (!this._onDestroyCompleteSubscriptionByDistributorMap) {
            this._onDestroyCompleteSubscriptionByDistributorMap = new Map();
        }

        if (distributor[Symbol.iterator]) {
            for (const distributorItem of distributor) {
                if (!this._onDestroyCompleteSubscriptionByDistributorMap.has(distributorItem)) {
                    this._onDestroyCompleteSubscriptionByDistributorMap.set(distributorItem, distributorItem.on('destroyComplete', event => {
                        if (event.publisher === distributorItem) {
                            event.unsubscribe();
                            this.removeDistributor(distributorItem);
                        }
                    }));
                }
            }
        } else if (!this._onDestroyCompleteSubscriptionByDistributorMap.has(distributor)) {
            this._onDestroyCompleteSubscriptionByDistributorMap.set(distributor, distributor.on('destroyComplete', event => {
                if (event.publisher === distributor) {
                    event.unsubscribe();
                    this.removeDistributor(distributor);
                }
            }));
        }

        return this;
    },
    bulkSubscribe: _createBulkSubscribeMethod('subscribe'),
    bulkUnsubscribe: _createBulkUnsubscribeMethod({
        publicUnsubscription: true
    }),
    defineDispatcher: _publicDefineDispatcherMethod,
    destroy (...args) {
        return this._publish('destroy', {
            args
        });
    },
    get destroyed () {
        return this._destroyed;
    },
    hasDistributor (distributor) {
        if (this._onDestroyCompleteSubscriptionByDistributorMap) {
            return this._onDestroyCompleteSubscriptionByDistributorMap.has(distributor);
        }

        return false;
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
        if (!this._onDestroyCompleteSubscriptionByDistributorMap) {
            return this;
        }

        if (distributor[Symbol.iterator]) {
            for (const distributorItem of distributor) {
                const subscription = this._onDestroyCompleteSubscriptionByDistributorMap.get(distributorItem);

                if (subscription) {
                    subscription.unsubscribe();
                    this._onDestroyCompleteSubscriptionByDistributorMap.delete(distributorItem);
                }
            }
        } else {
            const subscription = this._onDestroyCompleteSubscriptionByDistributorMap.get(distributor);

            if (subscription) {
                subscription.unsubscribe();
                this._onDestroyCompleteSubscriptionByDistributorMap.delete(distributor);
            }
        }

        if (!this._onDestroyCompleteSubscriptionByDistributorMap.size) {
            this._onDestroyCompleteSubscriptionByDistributorMap = null;
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
    _bulkSubscribe: _createBulkSubscribeMethod('_subscribe'),
    _bulkUnsubscribe: _createBulkUnsubscribeMethod(),
    _defineDispatcher: _protectedDefineDispatcherMethod,
    _destroy (...args) {
        this._destroyed = true;

        this._publish('destroyComplete', {
            args
        });

        this._bulkUnsubscribe();

        if (this._onDestroyCompleteSubscriptionByDistributorMap) {
            this.removeDistributor(this._onDestroyCompleteSubscriptionByDistributorMap.keys());
        }

        this._dispatcherByEventName = void null;

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
        const distributionPath = new Map(),
            distributors = [
                this
            ];

        for (let index = 0; index < distributors.length; index += 1) {
            const distributor = distributors[index];

            distributionPath.set(distributor, distributor._getEventState(eventName));

            if (distributor._onDestroyCompleteSubscriptionByDistributorMap) {
                for (const nextDistributor of distributor._onDestroyCompleteSubscriptionByDistributorMap.keys()) {
                    distributors.push(nextDistributor);
                }
            }
        }

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
            distributors,
            pubsub
        } = {}] = args;

        Reflect.apply(_PropertyChainer.prototype._init, this, args);

        this._onDestroyCompleteSubscriptionByDistributorMap = null;

        this._destroyed = false;

        this._dispatcherByEventName = Object.create(this.constructor._dispatcherByEventName);

        this._eventState = Object.create(null);

        if (pubsub) {
            this.defineDispatcher(pubsub);
        }

        if (distributors) {
            this.addDistributor(distributors);
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
    },
    [Symbol.dispose] () {
        this.destroy();
    }
}, {
    defineDispatcher: _publicDefineDispatcherMethod,
    _addSubscriptionMethods (subscriptionMethods) {
        if (typeof subscriptionMethods === 'string' || !subscriptionMethods[Symbol.iterator]) {
            subscriptionMethods = [
                subscriptionMethods
            ];
        }

        for (const stageName of subscriptionMethods) {
            const onceStageName = `once${stageName.charAt(0).toUpperCase()}${stageName.slice(1)}`,
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
        }
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
