import _make from 'isotropic-make';

export default _make('CallbackFunctionHost', {
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
    }
});
