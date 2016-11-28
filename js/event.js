import _defaultSymbol from './default-symbol.js';

import _make from 'isotropic-make';

export default _make({
    get completed () {
        return this._config.completed;
    },
    get data () {
        return this._config.data;
    },
    defaultIsPrevented () {
        return this.isPrevented(_defaultSymbol);
    },
    get dispatchStopped () {
        return this._config.dispatchStopped;
    },
    get distributionStopped () {
        return this._config.distributionStopped;
    },
    get distributor () {
        return this._config.distributor;
    },
    get eventStopped () {
        return this._config.eventStopped;
    },
    isPrevented (stageName) {
        return this._config.prevented ?
            this._config.prevented.has(stageName) :
            false;
    },
    get name () {
        return this._config.name;
    },
    prevent (stageName) {
        if (!this._config.preventable || this._config.preventable instanceof Set && !this._config.preventable.has(stageName)) {
            return this;
        }

        if (!this._config.prevented) {
            this._config.prevented = new Set();
        }

        this._config.prevented.add(stageName);

        return this;
    },
    preventDefault () {
        return this.prevent(_defaultSymbol);
    },
    get publisher () {
        return this._config.publisher;
    },
    get stageName () {
        return this._config.stageName;
    },
    stopDispatch () {
        if (this._config.dispatchStoppable) {
            this._config.dispatchStopped = true;
        }

        return this;
    },
    stopDistribution () {
        if (this._config.distributionStoppable) {
            this._config.distributionStopped = true;
        }

        return this;
    },
    stopEvent () {
        if (this._config.eventStoppable) {
            this._config.eventStopped = true;
        }

        return this;
    },
    unsubscribe () {
        return typeof this._config.unsubscribe === 'function' ?
            this._config.unsubscribe() :
            false;
    },
    _init (config = {}) {
        this._config = config;

        return this;
    }
});
