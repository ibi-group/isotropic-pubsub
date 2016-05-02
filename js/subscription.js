import _make from 'isotropic-make';

export default _make({
    get subscribed () {
        return this._config.subscribed;
    },
    unsubscribe () {
        return this._config.subscribed ? typeof this._config.unsubscribe === 'function' ? this._config.unsubscribe() : false : true;
    },
    _init (config = {}) {
        this._config = config;

        return this;
    }
});
