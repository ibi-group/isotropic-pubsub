import _Dispatcher, {
    Event as _Event
} from './dispatcher.js';

import _defaultSymbol from './default-symbol.js';

import _make from 'isotropic-make';

import _PropertyChainer from 'isotropic-property-chainer';

import _Subscription from './subscription.js';

import Dict from 'core-js/core/dict';

/* eslint-disable indent, no-invalid-this */
const _protectedDefineEventMethod = function ({
        config = {},
        eventName
    }) {
        this._events[eventName] = (config.Dispatcher || this._Dispatcher)(Object.assign({}, config, {
            name: eventName
        }));

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
/* eslint-enable indent, no-invalid-this */

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
        defineEvent: _publicDefineEventMethod,
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
            return this._getEvent(eventName).subscribe(Object.assign(
                {},
                typeof config === 'object' ?
                    config :
                    /* eslint-disable indent */
                    {
                        callbackFunction: config
                    }, /* eslint-enable indent */
                {
                    host: this,
                    publicSubscription: true,
                    stageName,
                    state: this._getEventState(eventName)
                }
            ));
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
        get _Dispatcher () {
            return this.constructor._Dispatcher;
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

            this._distributors = null;

            this._events = Object.create(this.constructor._events);

            this._eventState = new Dict();

            if (events) {
                this.defineEvent(events);
            }

            return this;
        },
        _defineEvent: _protectedDefineEventMethod,
        _normalizeBulkSubscribeConfig (bulkSubscribeConfig, config = bulkSubscribeConfig.config) {
            if (bulkSubscribeConfig.once) {
                if (typeof config === 'object') {
                    return Object.assign({}, config, {
                        once: true
                    });
                }

                return {
                    callbackFunction: config,
                    once: true
                };
            }

            return config;
        },
        _subscribe (stageName, eventName, config) {
            return this._getEvent(eventName).subscribe(Object.assign(
                {},
                typeof config === 'object' ?
                    config :
                    /* eslint-disable indent */
                    {
                        callbackFunction: config
                    }, /* eslint-enable indent */
                {
                    host: this,
                    stageName,
                    state: this._getEventState(eventName)
                }
            ));
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
        _Dispatcher,
        _events: new Dict({
            [_defaultSymbol]: {}
        }),
        _init (...args) {
            Reflect.apply(_PropertyChainer._init, this, args);

            if (this._events) {
                this.defineEvent(this._events);
            }

            if (this._subscriptionMethods) {
                this._addSubscriptionMethods(this._subscriptionMethods);
            }

            return this;
        },
        _propertyChains: new Set([
            '_events'
        ]),
        _defineEvent: _protectedDefineEventMethod,
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
