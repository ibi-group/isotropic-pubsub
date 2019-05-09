import _Dispatcher, {
    Event as _Event
} from './dispatcher.js';
import _defaultSymbol from './default-symbol.js';
import _make from 'isotropic-make';
import _PropertyChainer from 'isotropic-property-chainer';
import _Subscription from './subscription.js';

const _protectedDefineEventMethod = function ({
        config = {},
        eventName
    }) {
        this._events[eventName] = typeof config.newState === 'function' && typeof config.publish === 'function' && typeof config.subscribe === 'function' ?
            config :
            (config.Dispatcher || this._Dispatcher)({
                ...config,
                name: eventName
            });

        return this;
    },

    _publicDefineEventMethod = function (eventName, config) {
        if (typeof eventName === 'string') {
            this._defineEvent({
                config,
                eventName
            });
        } else if (Array.isArray(eventName)) {
            eventName.forEach(eventName => this._defineEvent({
                config,
                eventName
            }));
        } else {
            Reflect.ownKeys(eventName).forEach(key => this._defineEvent({
                config: eventName[key],
                eventName: key
            }));
        }

        return this;
    },

    _Pubsub = _make([
        _PropertyChainer
    ], {
        addDistributor (distributor) {
            if (!this._distributors) {
                this._distributors = new Set();
            }

            if (Array.isArray(distributor) || distributor instanceof Set) {
                distributor.forEach(distributor => this._distributors.add(distributor));
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
                        this.subscriptions.forEach(subscription => subscription.unsubscribe());
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
        defineEvent: _publicDefineEventMethod,
        destroy (...args) {
            return this._publish('destroy', {
                args
            });
        },
        get destroyed () {
            return this._destroyed;
        },
        publish (eventName, data) {
            this._getEvent(eventName).publish({
                data,
                eventName,
                getDistributionPath: () => this._getDistributionPath(eventName),
                host: this,
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
                distributor.forEach(distributor => this._distributors.delete(distributor));
            } else {
                this._distributors.delete(distributor);
            }

            if (!this._distributors.size) {
                this._distributors = null;
            }

            return this;
        },
        subscribe (stageName, eventName, config) {
            return this._getEvent(eventName).subscribe({
                ...typeof config === 'object' ?
                    config :
                    {
                        callbackFunction: config
                    },
                host: this,
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
                        this.subscriptions.forEach(subscription => subscription.unsubscribe());
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
        _defineEvent: _protectedDefineEventMethod,
        _destroy (...args) {
            this._destroyed = true;

            this._publish('destroyComplete', {
                args
            });

            this._bulkUnsubscribe();

            this._distributors = void null;

            this._events = void null;

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
        _getDistributionPath (eventName) {
            const distributionPath = new Map([[
                this,
                this._getEventState(eventName)
            ]]);

            distributionPath.forEach((eventState, distributor) => {
                if (distributor._distributors) {
                    distributor._distributors.forEach(distributor => distributionPath.set(distributor, distributor._getEventState(eventName)));
                }
            });

            return distributionPath;
        },
        _getEvent (eventName) {
            return this._events[eventName] || this._events[_defaultSymbol];
        },
        _getEventState (eventName) {
            let eventState = this._eventState[eventName];

            if (!eventState) {
                eventState = this._getEvent(eventName).newState();
                this._eventState[eventName] = eventState;
            }

            return eventState;
        },
        _init (...args) {
            const [{
                events
            } = {}] = args;

            Reflect.apply(_PropertyChainer.prototype._init, this, args);

            this._destroyed = false;

            this._distributors = null;

            this._events = Object.create(this.constructor._events);

            this._eventState = Object.create(null);

            if (events) {
                this.defineEvent(events);
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
            this._getEvent(eventName).publish({
                data,
                eventName,
                getDistributionPath: () => this._getDistributionPath(eventName),
                host: this,
                publisher: this,
                state: this._getEventState(eventName)
            });

            return this;
        },
        _subscribe (stageName, eventName, config) {
            return this._getEvent(eventName).subscribe({
                ...typeof config === 'object' ?
                    config :
                    {
                        callbackFunction: config
                    },
                host: this,
                stageName,
                state: this._getEventState(eventName)
            });
        }
    }, {
        defineEvent: _publicDefineEventMethod,
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
        _defineEvent: _protectedDefineEventMethod,
        _Dispatcher,
        _events: Object.assign(Object.create(null), {
            destroy: {
                allowPublicPublish: false,
                completeOnce: true,
                defaultFunction: '_eventDestroy',
                Dispatcher: _Dispatcher
            },
            destroyComplete: {
                allowPublicPublish: false,
                defaultFunction: '_eventDestroyComplete',
                Dispatcher: _Dispatcher,
                publishOnce: true
            },
            [_defaultSymbol]: {}
        }),
        _init (...args) {
            Reflect.apply(_PropertyChainer._init, this, args);

            if (this.hasOwnProperty('_events')) {
                this.defineEvent(this._events);
            }

            if (this.hasOwnProperty('_subscriptionMethods')) {
                this._addSubscriptionMethods(this._subscriptionMethods);
            }

            return this;
        },
        _propertyChains: new Set([
            '_events'
        ]),
        _subscriptionMethods: [
            'after',
            'before',
            'on'
        ]
    });

export {
    _Pubsub as default,
    _defaultSymbol as defaultSymbol,
    _Dispatcher as Dispatcher,
    _Event as Event,
    _Subscription as Subscription
};
