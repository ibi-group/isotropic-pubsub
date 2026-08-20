import _CallbackFunctionHost from './callback-function-host.js';
import _defaultSymbol from './default-symbol.js';
import _Dispatcher from './dispatcher.js';
import _make from 'isotropic-make';
import _PropertyChainer from 'isotropic-property-chainer';
import _Subscription from './subscription.js';
import _TimeoutCancel from 'isotropic-timeout-cancel';

export default _make('Pubsub', [
    _CallbackFunctionHost,
    _PropertyChainer
], {
    addDistributor (distributor) {
        if (!this._onDestroyCompleteSubscriptionByDistributorMap) {
            this._onDestroyCompleteSubscriptionByDistributorMap = new Map();
        }

        if (distributor[Symbol.iterator]) {
            for (const distributorItem of distributor) {
                if (!this._onDestroyCompleteSubscriptionByDistributorMap.has(distributorItem)) {
                    this._onDestroyCompleteSubscriptionByDistributorMap.set(distributorItem, distributorItem.on('destroyComplete', {
                        callbackFunction: () => {
                            this.removeDistributor(distributorItem);
                        },
                        filterFunction: event => event.publisher === distributorItem,
                        once: true
                    }));
                }
            }
        } else if (!this._onDestroyCompleteSubscriptionByDistributorMap.has(distributor)) {
            this._onDestroyCompleteSubscriptionByDistributorMap.set(distributor, distributor.on('destroyComplete', {
                callbackFunction: () => {
                    this.removeDistributor(distributor);
                },
                filterFunction: event => event.publisher === distributor,
                once: true
            }));
        }

        return this;
    },
    destroy (...args) {
        return this._destroyed ?
            this :
            this._publish('destroy', {
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

        this._eventStateByEventName = void null;
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

        distributionPath.set(this, this._getEventState(eventName));

        for (let index = 0; index < distributors.length; index += 1) {
            const distributor = distributors[index];

            if (distributor._onDestroyCompleteSubscriptionByDistributorMap) {
                for (const nextDistributor of distributor._onDestroyCompleteSubscriptionByDistributorMap.keys()) {
                    if (!distributionPath.has(nextDistributor)) {
                        distributionPath.set(nextDistributor, nextDistributor._getEventState(eventName));
                        distributors.push(nextDistributor);
                    }
                }
            }
        }

        return distributionPath;
    },
    _getEventState (eventName) {
        let eventState = this._eventStateByEventName[eventName];

        if (!eventState) {
            eventState = this._getDispatcher(eventName).newState();
            this._eventStateByEventName[eventName] = eventState;
        }

        return eventState;
    },
    _init (...args) {
        const [{
            distributors,
            pubsub,
            subscribe
        } = {}] = args;

        Reflect.apply(_PropertyChainer.prototype._init, this, args);

        this._onDestroyCompleteSubscriptionByDistributorMap = null;

        this._destroyed = false;

        this._dispatcherByEventName = Object.create(this.constructor._dispatcherByEventName);

        this._eventStateByEventName = Object.create(null);

        if (pubsub) {
            this.defineDispatcher(pubsub);
        }

        if (distributors) {
            this.addDistributor(distributors);
        }

        if (subscribe) {
            this.bulkSubscribe(this._normalizeSubscribeConfig(subscribe));
        }

        return this;
    },
    _normalizeBulkSubscribeConfig (bulkSubscribeConfig, config, onceGroup) {
        const filterFunctions = [];

        if (bulkSubscribeConfig.filterFunction) {
            filterFunctions.push(bulkSubscribeConfig.filterFunction);
        }

        if (config && typeof config === 'object') {
            if (config.filterFunction) {
                filterFunctions.push(config.filterFunction);
            }

            config = {
                ...config,
                once: !!(bulkSubscribeConfig.once || config.once)
            };
        } else {
            config = {
                callbackFunction: config,
                once: !!bulkSubscribeConfig.once
            };
        }

        if (onceGroup) {
            const me = this;

            config.filterFunction = function (event) {
                if (
                    onceGroup.published && onceGroup.event !== event ||
                    !filterFunctions.every(filterFunction => me._callCallbackFunction(filterFunction, this, event))
                ) {
                    return false;
                }

                if (!onceGroup.published) {
                    onceGroup.published = true;
                    onceGroup.event = event;

                    for (const eventName of Reflect.ownKeys(onceGroup.subscriptionsByEventName)) {
                        if (eventName !== event.name) {
                            for (const subscription of onceGroup.subscriptionsByEventName[eventName]) {
                                subscription.unsubscribe();
                            }

                            delete onceGroup.subscriptionsByEventName[eventName];
                        }
                    }

                    const subscriptions = onceGroup.subscriptionsByEventName[event.name];

                    delete onceGroup.subscriptionsByEventName[event.name];

                    if (subscriptions && subscriptions.length) {
                        queueMicrotask(() => {
                            for (const subscription of subscriptions) {
                                subscription.unsubscribe();
                            }
                        });
                    }
                }

                return true;
            };
        } else if (filterFunctions.length) {
            const me = this;

            config.filterFunction = function (event) {
                return filterFunctions.every(filterFunction => me._callCallbackFunction(filterFunction, this, event));
            };
        }

        return config;
    },
    _normalizeSubscribeConfig (subscribeConfig) {
        const bulkSubscribeConfig = [];

        for (const eventName of Reflect.ownKeys(subscribeConfig)) {
            let config = subscribeConfig[eventName];

            if (typeof config === 'string' || !config[Symbol.iterator]) {
                config = [
                    config
                ];
            }

            for (const configItem of config) {
                if (typeof configItem === 'object') {
                    const {
                        filterFunction,
                        stageName = 'on',
                        ...config
                    } = configItem;

                    bulkSubscribeConfig.push({
                        config,
                        eventName,
                        filterFunction,
                        stageName
                    });
                } else {
                    bulkSubscribeConfig.push({
                        config: {
                            callbackFunction: configItem
                        },
                        eventName,
                        stageName: 'on'
                    });
                }
            }
        }

        return bulkSubscribeConfig;
    },
    [Symbol.dispose] () {
        this.destroy();
    }
}, {
    defineDispatcher (eventName, config) {
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
    },
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

            if (typeof this.prototype[stageName] !== 'function') {
                this.prototype[stageName] = function (eventName, config) {
                    return this.bulkSubscribe({
                        config,
                        eventName,
                        stageName
                    });
                };
            }

            if (typeof this.prototype[onceStageName] !== 'function') {
                this.prototype[onceStageName] = function (eventName, config) {
                    return this.bulkSubscribe({
                        config,
                        eventName,
                        once: true,
                        stageName
                    });
                };
            }

            if (typeof this.prototype[protectedOnceStageName] !== 'function') {
                this.prototype[protectedOnceStageName] = function (eventName, config) {
                    return this._bulkSubscribe({
                        config,
                        eventName,
                        once: true,
                        stageName
                    });
                };
            }

            if (typeof this.prototype[protectedStageName] !== 'function') {
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
    _createBulkSubscribeMethod ({
        subscribeMethodName
    }) {
        return function (bulkConfig) {
            if (!bulkConfig[Symbol.iterator]) {
                bulkConfig = [
                    bulkConfig
                ];
            }

            const subscriptions = [];

            for (const bulkConfigItem of bulkConfig) {
                const itemConfig = Object.hasOwn(bulkConfigItem, 'callbackFunction') ?
                        bulkConfigItem.callbackFunction :
                        bulkConfigItem.config,
                    onceGroup = bulkConfigItem.once ?
                        {
                            event: null,
                            published: false,
                            subscriptionsByEventName: {}
                        } :
                        null,
                    subscribe = (eventName, config, onceGroup) => {
                        const subscription = this[subscribeMethodName](bulkConfigItem.stageName, eventName, this._normalizeBulkSubscribeConfig(bulkConfigItem, config, onceGroup));

                        if (subscription.subscribed) {
                            subscriptions.push(subscription);

                            if (onceGroup) {
                                let subscriptions = onceGroup.subscriptionsByEventName[eventName];

                                if (!subscriptions) {
                                    subscriptions = [];
                                    onceGroup.subscriptionsByEventName[eventName] = subscriptions;
                                }

                                subscriptions.push(subscription);
                            }
                        }
                    };

                switch (typeof bulkConfigItem.eventName) {
                    case 'string':
                    case 'symbol':
                        if (typeof itemConfig !== 'string' && itemConfig[Symbol.iterator]) {
                            for (const config of itemConfig) {
                                subscribe(bulkConfigItem.eventName, config, onceGroup);
                            }
                        } else {
                            subscribe(bulkConfigItem.eventName, itemConfig, null);
                        }

                        break;
                    default:
                        if (bulkConfigItem.eventName[Symbol.iterator]) {
                            for (const eventName of bulkConfigItem.eventName) {
                                if (typeof itemConfig !== 'string' && itemConfig[Symbol.iterator]) {
                                    for (const config of itemConfig) {
                                        subscribe(eventName, config, onceGroup);
                                    }
                                } else {
                                    subscribe(eventName, itemConfig, onceGroup);
                                }
                            }
                        } else {
                            for (const eventName of Reflect.ownKeys(bulkConfigItem.eventName)) {
                                const config = bulkConfigItem.eventName[eventName];

                                if (typeof config !== 'string' && config[Symbol.iterator]) {
                                    for (const configItem of config) {
                                        subscribe(eventName, configItem, onceGroup);
                                    }
                                } else {
                                    subscribe(eventName, config, onceGroup);
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

                        return true;
                    }
                });
        };
    },
    _createBulkUnsubscribeMethod (unsubscribeConfig) {
        return function (stageName, eventName) {
            let unsubscribed = false;

            if (typeof eventName === 'undefined') {
                if (typeof stageName === 'undefined') {
                    for (const state of Object.values(this._eventStateByEventName)) {
                        for (const subscriptionMap of Object.values(state.subscriptionMapByStageName)) {
                            for (const subscription of subscriptionMap.values()) {
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

                        const state = this._eventStateByEventName[eventName];

                        if (state) {
                            for (
                                const subscriptionMap of stageName ?
                                    [
                                        state.subscriptionMapByStageName[stageName] || new Map()
                                    ] :
                                    Object.values(state.subscriptionMapByStageName)
                            ) {
                                for (const subscription of subscriptionMap.values()) {
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
                    const state = this._eventStateByEventName[eventNameItem];

                    if (state) {
                        for (const stageNameItem of stageName) {
                            const subscriptionMap = state.subscriptionMapByStageName[stageNameItem];

                            if (subscriptionMap) {
                                for (const subscription of subscriptionMap.values()) {
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
        };
    },
    _createGetOnceEventSnapshotMethod ({
        publicRequest
    }) {
        return function (eventName) {
            return this._destroyed ?
                null :
                this._getDispatcher(eventName).getOnceEventSnapshot({
                    publicRequest,
                    state: this._eventStateByEventName[eventName]
                });
        };
    },
    _createPublishMethod ({
        publicPublish
    }) {
        return function (eventName, data) {
            this._getDispatcher(eventName).publish({
                data,
                eventName,
                getDistributionPath: () => this._getDistributionPath(eventName),
                lifecycleHost: this,
                publicPublish,
                publisher: this,
                state: this._getEventState(eventName)
            });

            return this;
        };
    },
    _createSubscribeMethod ({
        publicSubscription
    }) {
        return function (stageName, eventName, config) {
            if (stageName && typeof stageName === 'object') {
                ({
                    eventName,
                    stageName,
                    ...config
                } = stageName);
            }

            return this._getDispatcher(eventName).subscribe({
                host: this,
                ...typeof config === 'object' ?
                    config :
                    {
                        callbackFunction: config
                    },
                lifecycleHost: this,
                publicSubscription,
                stageName,
                state: this._getEventState(eventName)
            });
        };
    },
    _createUntilMethod ({
        bulkSubscribeMethodName
    }) {
        return function (config) {
            let subscription = null;

            const {
                    details,
                    eventName,
                    signal,
                    silent = false,
                    stageName = 'after',
                    subject = 'Event',
                    timeout,
                    ...subscriptionConfig
                } = typeof config === 'string' || typeof config === 'symbol' ?
                    {
                        eventName: config
                    } :
                    config,
                {
                    promise,
                    reject,
                    resolve
                } = Promise.withResolvers(),

                cancel = _TimeoutCancel({
                    details,
                    onCancel: ({
                        error
                    }) => {
                        subscription?.unsubscribe();

                        if (error && !silent) {
                            reject(error);
                        }
                    },
                    signal,
                    subject,
                    timeout
                });

            try {
                subscription = this[bulkSubscribeMethodName]({
                    ...subscriptionConfig,
                    callbackFunction: event => {
                        cancel.complete();
                        resolve(event.snapshot);
                    },
                    eventName,
                    once: true,
                    stageName
                });
            } catch (error) {
                cancel.complete();

                throw error;
            }

            if (cancel.completed) {
                subscription.unsubscribe();
            }

            return Object.defineProperties(promise, {
                cancel: {
                    value (cancelConfig) {
                        cancel.cancel(cancelConfig);

                        return promise;
                    }
                },
                canceled: {
                    get () {
                        return cancel.canceled;
                    }
                },
                subscribed: {
                    get () {
                        return subscription.subscribed;
                    }
                },
                unsubscribe: {
                    value () {
                        cancel.complete();

                        return subscription.unsubscribe();
                    }
                },
                [Symbol.dispose]: {
                    value () {
                        cancel.complete();
                        subscription.unsubscribe();
                    }
                }
            });
        };
    },
    _defineDispatcher ({
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
    _Dispatcher,
    _init (...args) {
        this._dispatcherByEventName = Object.create(null);

        Reflect.apply(_PropertyChainer._init, this, args);

        if (typeof this.prototype.bulkSubscribe !== 'function') {
            this.prototype.bulkSubscribe = this._createBulkSubscribeMethod({
                subscribeMethodName: 'subscribe'
            });
        }

        if (typeof this.prototype.bulkUnsubscribe !== 'function') {
            this.prototype.bulkUnsubscribe = this._createBulkUnsubscribeMethod({
                publicUnsubscription: true
            });
        }

        if (typeof this.prototype.defineDispatcher !== 'function') {
            this.prototype.defineDispatcher = this.defineDispatcher;
        }

        if (typeof this.prototype.getOnceEventSnapshot !== 'function') {
            this.prototype.getOnceEventSnapshot = this._createGetOnceEventSnapshotMethod({
                publicRequest: true
            });
        }

        if (typeof this.prototype.publish !== 'function') {
            this.prototype.publish = this._createPublishMethod({
                publicPublish: true
            });
        }

        if (typeof this.prototype.subscribe !== 'function') {
            this.prototype.subscribe = this._createSubscribeMethod({
                publicSubscription: true
            });
        }

        if (typeof this.prototype.until !== 'function') {
            this.prototype.until = this._createUntilMethod({
                bulkSubscribeMethodName: 'bulkSubscribe'
            });
        }

        if (typeof this.prototype._bulkSubscribe !== 'function') {
            this.prototype._bulkSubscribe = this._createBulkSubscribeMethod({
                subscribeMethodName: '_subscribe'
            });
        }

        if (typeof this.prototype._bulkUnsubscribe !== 'function') {
            this.prototype._bulkUnsubscribe = this._createBulkUnsubscribeMethod();
        }

        if (typeof this.prototype._defineDispatcher !== 'function') {
            this.prototype._defineDispatcher = this._defineDispatcher;
        }

        if (typeof this.prototype._getOnceEventSnapshot !== 'function') {
            this.prototype._getOnceEventSnapshot = this._createGetOnceEventSnapshotMethod({
                publicRequest: false
            });
        }

        if (typeof this.prototype._publish !== 'function') {
            this.prototype._publish = this._createPublishMethod({
                publicPublish: false
            });
        }

        if (typeof this.prototype._subscribe !== 'function') {
            this.prototype._subscribe = this._createSubscribeMethod({
                publicSubscription: false
            });
        }

        if (typeof this.prototype._until !== 'function') {
            this.prototype._until = this._createUntilMethod({
                bulkSubscribeMethodName: '_bulkSubscribe'
            });
        }

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
