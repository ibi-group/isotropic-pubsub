import _defaultSymbol from './default-symbol.js';
import _Event from './event.js';
import _make from 'isotropic-make';
import _Subscription from './subscription.js';

export default _make({
    newState () {
        return Object.assign(Object.create(null), {
            subscriptions: Object.create(null)
        });
    },
    publish ({
        data,
        eventName,
        getDistributionPath,
        lifecycleHost,
        publicPublish,
        publisher,
        state
    }) {
        if (publicPublish && !this._config.allowPublicPublish || state.event) {
            return this;
        }

        if (this._config.data) {
            data = data ?
                Object.assign(Object.create(null), this._config.data, data) :
                this._config.data;
        }

        if (this._config.lifecycleHost) {
            lifecycleHost = this._config.lifecycleHost;
        }

        const config = Object.assign(Object.create(null), {
                data,
                dispatchStoppable: this._config.dispatchStoppable,
                distributionStoppable: this._config.distributionStoppable,
                eventStoppable: this._config.eventStoppable,
                name: eventName,
                preventable: this._config.preventable,
                publisher
            }),
            distributionPath = this._config.distributable ?
                getDistributionPath() :
                new Map([[
                    publisher,
                    state
                ]]),
            event = this._Event(config);

        let once;

        if (this._config.publishOnce) {
            once = true;
            state.event = event;
        }

        this._config.stages.some(stageName => {
            config.dispatchStopped = false;
            config.distributionStopped = false;
            config.stageName = stageName;

            if (event.isPrevented(stageName)) {
                this._callLifecycleFunction('preventedFunction', lifecycleHost, event);

                return true;
            }

            if (stageName === _defaultSymbol) {
                if (this._config.completeOnce) {
                    if (state.event) {
                        return true;
                    }

                    once = true;
                    state.event = event;
                }

                config.completed = true;
                config.distributor = publisher;
                config.unsubscribe = null;

                this._callLifecycleFunction('defaultFunction', lifecycleHost, event);
            } else {
                for (const [
                    distributor,
                    state
                ] of distributionPath) {
                    if (!state.subscriptions[stageName]) {
                        continue;
                    }

                    config.distributor = distributor;

                    for (const subscription of state.subscriptions[stageName].values()) {
                        config.unsubscribe = this._unsubscribe.bind(this, subscription);

                        this._callCallbackFunction(subscription.callbackFunction, subscription.host, event);

                        if (event.dispatchStopped) {
                            this._callLifecycleFunction('dispatchStoppedFunction', lifecycleHost, event);

                            break;
                        }
                    }

                    if (event.distributionStopped) {
                        this._callLifecycleFunction('distributionStoppedFunction', lifecycleHost, event);

                        break;
                    }
                }
            }

            if (event.eventStopped) {
                this._callLifecycleFunction('eventStoppedFunction', lifecycleHost, event);

                return true;
            }

            return false;
        });

        if (once) {
            config.distributor = publisher;
            config.unsubscribe = null;
        }

        return this;
    },
    subscribe (config) {
        if (this._config.lifecycleHost) {
            config.lifecycleHost = this._config.lifecycleHost;
        }

        return config.publicSubscription && !this._config.allowPublicSubscription ?
            this._Subscription() :
            this._callLifecycleFunction('subscribedFunction', config.lifecycleHost, {
                config,
                dispatcher: this
            }) || this._subscribe(config);
    },
    _callCallbackFunction (callbackFunction, host = this, ...args) {
        switch (typeof callbackFunction) {
            case 'function':
                return Reflect.apply(callbackFunction, host, args);
            case 'string':
            case 'symbol':
                callbackFunction = host[callbackFunction];

                if (typeof callbackFunction === 'function') {
                    return Reflect.apply(callbackFunction, host, args);
                }
        }
    },
    _callLifecycleFunction (name, lifecycleHost, ...args) {
        return this._callCallbackFunction(this._config[name], lifecycleHost, ...args);
    },
    get _Event () {
        return this._config.Event || this.constructor._Event;
    },
    _getOnceCallbackFunction (callbackFunction, host = this) {
        switch (typeof callbackFunction) {
            case 'function':
                return function (...args) {
                    const [
                        event
                    ] = args;

                    event.unsubscribe();

                    return Reflect.apply(callbackFunction, host, args);
                };
            case 'string':
            case 'symbol':
                return function (...args) {
                    const [
                        event
                    ] = args;

                    event.unsubscribe();

                    callbackFunction = host[callbackFunction];

                    if (typeof callbackFunction === 'function') {
                        return Reflect.apply(callbackFunction, host, args);
                    }
                };
        }

        return event => {
            event.unsubscribe();
        };
    },
    _init (config = {}) {
        config = {
            ...config
        };

        if (config.allowDuplicateSubscription !== false) {
            config.allowDuplicateSubscription = true;
        }

        config.allowPublicPublish = !!config.allowPublicPublish;

        if (config.allowPublicSubscription !== false) {
            config.allowPublicSubscription = true;
        }

        if (config.allowPublicUnsubscription !== false) {
            config.allowPublicUnsubscription = true;
        }

        config.completeOnce = config.publishOnce ?
            false :
            !!config.completeOnce;

        if (config.dispatchStoppable !== false) {
            config.dispatchStoppable = true;
        }

        if (config.distributable !== false) {
            config.distributable = true;
        }

        if (config.distributionStoppable !== false) {
            config.distributionStoppable = true;
        }

        if (config.eventStoppable !== false) {
            config.eventStoppable = true;
        }

        if (config.preventable !== false && !(config.preventable instanceof Set)) {
            config.preventable = true;
        }

        config.publishOnce = !!config.publishOnce;

        if (!config.stages) {
            config.stages = [
                'before',
                'on',
                _defaultSymbol,
                'after'
            ];
        }

        this._config = config;

        return this;
    },
    _subscribe (config) {
        if (config.state.event) {
            if (!config.state.event.isPrevented(config.state.event.stageName)) {
                this._callCallbackFunction(config.callbackFunction, config.host, config.state.event);
            }

            return this._Subscription();
        }

        if (config.once) {
            config.onceCallbackFunction = config.callbackFunction;
            config.callbackFunction = this._getOnceCallbackFunction(config.callbackFunction, config.host);
        }

        let subscriptions = config.state.subscriptions[config.stageName];

        if (!subscriptions) {
            subscriptions = new Map();
            config.state.subscriptions[config.stageName] = subscriptions;
        }

        if (!this._config.allowDuplicateSubscription) {
            for (const subscription of subscriptions.values()) {
                if (subscription.host === config.host && (subscription.callbackFunction === config.callbackFunction || subscription.onceCallbackFunction && subscription.onceCallbackFunction === config.onceCallbackFunction)) {
                    return this._Subscription();
                }
            }
        }

        config.subscriptionId = Symbol('subscriptionId');
        config.unsubscribe = ({
            publicUnsubscription
        } = {}) => (!publicUnsubscription || this._config.allowPublicUnsubscription) && this._unsubscribe(config);

        subscriptions.set(config.subscriptionId, config);

        config.subscription = {
            subscribed: true,
            unsubscribe: config.unsubscribe
        };

        return this._Subscription(config.subscription);
    },
    get _Subscription () {
        return this._config.Subscription || this.constructor._Subscription;
    },
    _unsubscribe (config) {
        const subscriptions = config.state.subscriptions[config.stageName],

            subscription = subscriptions && subscriptions.get(config.subscriptionId);

        if (subscription) {
            if (this._callLifecycleFunction('unsubscribedFunction', config.lifecycleHost, {
                config,
                dispatcher: this
            }) === false) {
                return false;
            }

            subscriptions.delete(config.subscriptionId);

            if (!subscriptions.size) {
                Reflect.deleteProperty(config.state.subscriptions, config.stageName);
            }
        }

        config.subscription.subscribed = false;
        config.subscription.unsubscribe = null;

        return true;
    }
}, {
    _Event,
    _Subscription
});
