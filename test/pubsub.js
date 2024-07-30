import _Pubsub, * as _pubsub from '../js/pubsub.js';
import _chai from 'isotropic-dev-dependencies/lib/chai.js';
import _make from 'isotropic-make';
import _mocha from 'isotropic-dev-dependencies/lib/mocha.js';

_mocha.describe('pubsub', () => {
    _mocha.it('should construct pubsub objects', () => {
        _chai.expect(_Pubsub).to.be.a('function');

        const pubsub = new _Pubsub();

        _chai.expect(pubsub).to.be.an.instanceOf(_Pubsub);
    });

    _mocha.it('should be a pubsub object factory', () => {
        _chai.expect(_Pubsub).to.be.a('function');

        const pubsub = _Pubsub();

        _chai.expect(pubsub).to.be.an.instanceOf(_Pubsub);
    });

    _mocha.it('should execute staged subscribers when an event is published', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.subscribe('after', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('after 0');
            }
        });

        pubsub.subscribe('after', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('after 1');
            },
            once: true
        });

        pubsub.subscribe('after', 'testEvent', () => {
            subscriptionsExecuted.push('after 2');
        });

        pubsub.subscribe('before', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('before 0');
            }
        });

        pubsub.subscribe('before', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('before 1');
            },
            once: true
        });

        pubsub.subscribe('before', 'testEvent', () => {
            subscriptionsExecuted.push('before 2');
        });

        pubsub.subscribe('on', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('on 0');
            }
        });

        pubsub.subscribe('on', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('on 1');
            },
            once: true
        });

        pubsub.subscribe('on', 'testEvent', () => {
            subscriptionsExecuted.push('on 2');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before 0',
            'before 1',
            'before 2',
            'on 0',
            'on 1',
            'on 2',
            'after 0',
            'after 1',
            'after 2'
        ]);

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before 0',
            'before 1',
            'before 2',
            'on 0',
            'on 1',
            'on 2',
            'after 0',
            'after 1',
            'after 2',
            'before 0',
            'before 2',
            'on 0',
            'on 2',
            'after 0',
            'after 2'
        ]);

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before 0',
            'before 1',
            'before 2',
            'on 0',
            'on 1',
            'on 2',
            'after 0',
            'after 1',
            'after 2',
            'before 0',
            'before 2',
            'on 0',
            'on 2',
            'after 0',
            'after 2',
            'before 0',
            'before 2',
            'on 0',
            'on 2',
            'after 0',
            'after 2'
        ]);
    });

    _mocha.it('should execute staged subscribers when an event is published with any combination of public or protected publish or subscribe', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub._subscribe('after', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('protected after 0');
            }
        });

        pubsub._subscribe('after', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('protected after 1');
            },
            once: true
        });

        pubsub._subscribe('after', 'testEvent', () => {
            subscriptionsExecuted.push('protected after 2');
        });

        pubsub.subscribe('after', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('public after 0');
            }
        });

        pubsub.subscribe('after', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('public after 1');
            },
            once: true
        });

        pubsub.subscribe('after', 'testEvent', () => {
            subscriptionsExecuted.push('public after 2');
        });

        pubsub._subscribe('before', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('protected before 0');
            }
        });

        pubsub._subscribe('before', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('protected before 1');
            },
            once: true
        });

        pubsub._subscribe('before', 'testEvent', () => {
            subscriptionsExecuted.push('protected before 2');
        });

        pubsub.subscribe('before', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('public before 0');
            }
        });

        pubsub.subscribe('before', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('public before 1');
            },
            once: true
        });

        pubsub.subscribe('before', 'testEvent', () => {
            subscriptionsExecuted.push('public before 2');
        });

        pubsub._subscribe('on', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('protected on 0');
            }
        });

        pubsub._subscribe('on', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('protected on 1');
            },
            once: true
        });

        pubsub._subscribe('on', 'testEvent', () => {
            subscriptionsExecuted.push('protected on 2');
        });

        pubsub.subscribe('on', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('public on 0');
            }
        });

        pubsub.subscribe('on', 'testEvent', {
            callbackFunction () {
                subscriptionsExecuted.push('public on 1');
            },
            once: true
        });

        pubsub.subscribe('on', 'testEvent', () => {
            subscriptionsExecuted.push('public on 2');
        });

        pubsub._publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'protected before 0',
            'protected before 1',
            'protected before 2',
            'public before 0',
            'public before 1',
            'public before 2',
            'protected on 0',
            'protected on 1',
            'protected on 2',
            'public on 0',
            'public on 1',
            'public on 2',
            'protected after 0',
            'protected after 1',
            'protected after 2',
            'public after 0',
            'public after 1',
            'public after 2'
        ]);

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'protected before 0',
            'protected before 1',
            'protected before 2',
            'public before 0',
            'public before 1',
            'public before 2',
            'protected on 0',
            'protected on 1',
            'protected on 2',
            'public on 0',
            'public on 1',
            'public on 2',
            'protected after 0',
            'protected after 1',
            'protected after 2',
            'public after 0',
            'public after 1',
            'public after 2',
            'protected before 0',
            'protected before 2',
            'public before 0',
            'public before 2',
            'protected on 0',
            'protected on 2',
            'public on 0',
            'public on 2',
            'protected after 0',
            'protected after 2',
            'public after 0',
            'public after 2'
        ]);

        pubsub._publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'protected before 0',
            'protected before 1',
            'protected before 2',
            'public before 0',
            'public before 1',
            'public before 2',
            'protected on 0',
            'protected on 1',
            'protected on 2',
            'public on 0',
            'public on 1',
            'public on 2',
            'protected after 0',
            'protected after 1',
            'protected after 2',
            'public after 0',
            'public after 1',
            'public after 2',
            'protected before 0',
            'protected before 2',
            'public before 0',
            'public before 2',
            'protected on 0',
            'protected on 2',
            'public on 0',
            'public on 2',
            'protected after 0',
            'protected after 2',
            'public after 0',
            'public after 2',
            'protected before 0',
            'protected before 2',
            'public before 0',
            'public before 2',
            'protected on 0',
            'protected on 2',
            'public on 0',
            'public on 2',
            'protected after 0',
            'protected after 2',
            'public after 0',
            'public after 2'
        ]);
    });

    _mocha.it('should provide protected stage subscription shortcut methods', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub._after('testEvent', () => {
            subscriptionsExecuted.push('after 0');
        });

        pubsub._onceAfter('testEvent', () => {
            subscriptionsExecuted.push('after 1');
        });

        pubsub._after('testEvent', () => {
            subscriptionsExecuted.push('after 2');
        });

        pubsub._before('testEvent', () => {
            subscriptionsExecuted.push('before 0');
        });

        pubsub._onceBefore('testEvent', () => {
            subscriptionsExecuted.push('before 1');
        });

        pubsub._before('testEvent', () => {
            subscriptionsExecuted.push('before 2');
        });

        pubsub._on('testEvent', () => {
            subscriptionsExecuted.push('on 0');
        });

        pubsub._onceOn('testEvent', () => {
            subscriptionsExecuted.push('on 1');
        });

        pubsub._on('testEvent', () => {
            subscriptionsExecuted.push('on 2');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before 0',
            'before 1',
            'before 2',
            'on 0',
            'on 1',
            'on 2',
            'after 0',
            'after 1',
            'after 2'
        ]);

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before 0',
            'before 1',
            'before 2',
            'on 0',
            'on 1',
            'on 2',
            'after 0',
            'after 1',
            'after 2',
            'before 0',
            'before 2',
            'on 0',
            'on 2',
            'after 0',
            'after 2'
        ]);

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before 0',
            'before 1',
            'before 2',
            'on 0',
            'on 1',
            'on 2',
            'after 0',
            'after 1',
            'after 2',
            'before 0',
            'before 2',
            'on 0',
            'on 2',
            'after 0',
            'after 2',
            'before 0',
            'before 2',
            'on 0',
            'on 2',
            'after 0',
            'after 2'
        ]);
    });

    _mocha.it('should provide stage subscription shortcut methods', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('after 0');
        });

        pubsub.onceAfter('testEvent', () => {
            subscriptionsExecuted.push('after 1');
        });

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('after 2');
        });

        pubsub.before('testEvent', () => {
            subscriptionsExecuted.push('before 0');
        });

        pubsub.onceBefore('testEvent', () => {
            subscriptionsExecuted.push('before 1');
        });

        pubsub.before('testEvent', () => {
            subscriptionsExecuted.push('before 2');
        });

        pubsub.on('testEvent', () => {
            subscriptionsExecuted.push('on 0');
        });

        pubsub.onceOn('testEvent', () => {
            subscriptionsExecuted.push('on 1');
        });

        pubsub.on('testEvent', () => {
            subscriptionsExecuted.push('on 2');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before 0',
            'before 1',
            'before 2',
            'on 0',
            'on 1',
            'on 2',
            'after 0',
            'after 1',
            'after 2'
        ]);

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before 0',
            'before 1',
            'before 2',
            'on 0',
            'on 1',
            'on 2',
            'after 0',
            'after 1',
            'after 2',
            'before 0',
            'before 2',
            'on 0',
            'on 2',
            'after 0',
            'after 2'
        ]);

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before 0',
            'before 1',
            'before 2',
            'on 0',
            'on 1',
            'on 2',
            'after 0',
            'after 1',
            'after 2',
            'before 0',
            'before 2',
            'on 0',
            'on 2',
            'after 0',
            'after 2',
            'before 0',
            'before 2',
            'on 0',
            'on 2',
            'after 0',
            'after 2'
        ]);
    });

    _mocha.it('should not execute unsubscribed subscribers', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [],
            testSubscription = pubsub.on('testEvent', () => {
                subscriptionsExecuted.push('a');
            });

        pubsub.on('testEvent', event => {
            subscriptionsExecuted.push('b');
            _chai.expect(event.unsubscribe()).to.be.true;
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'a',
            'b'
        ]);

        _chai.expect(testSubscription.unsubscribe()).to.be.true;

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'a',
            'b'
        ]);
    });

    _mocha.it('should allow multiple unsubscription with no error', () => {
        const pubsub = _Pubsub(),
            testSubscription = pubsub.on('testEvent', () => void null);

        _chai.expect(testSubscription.unsubscribe()).to.be.true;
        _chai.expect(testSubscription.unsubscribe()).to.be.true;
    });

    _mocha.it('should acknowledge an event is complete after the default stage', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.after('testEvent', event => {
            _chai.expect(event.completed).to.be.true;
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            _chai.expect(event.completed).not.to.be.true;
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            _chai.expect(event.completed).not.to.be.true;
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    _mocha.it('should pass event data to subscribers', () => {
        const data = {
                a: 'a',
                b: 'b',
                c: 'c'
            },
            pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.after('testEvent', event => {
            _chai.expect(event.data).to.equal(data);
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            _chai.expect(event.data).to.equal(data);
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            _chai.expect(event.data).to.equal(data);
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent', data);

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    _mocha.it('should pass event name to subscribers', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.after('testEvent', event => {
            _chai.expect(event).to.have.property('name', 'testEvent');
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            _chai.expect(event).to.have.property('name', 'testEvent');
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            _chai.expect(event).to.have.property('name', 'testEvent');
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    _mocha.it('should pass event publisher to subscribers', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.after('testEvent', event => {
            _chai.expect(event).to.have.property('publisher', pubsub);
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            _chai.expect(event).to.have.property('publisher', pubsub);
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            _chai.expect(event).to.have.property('publisher', pubsub);
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    _mocha.it('should pass stage name to subscribers', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.after('testEvent', event => {
            _chai.expect(event).to.have.property('stageName', 'after');
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            _chai.expect(event).to.have.property('stageName', 'before');
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            _chai.expect(event).to.have.property('stageName', 'on');
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    _mocha.it('should prevent preventable events', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            event.preventDefault();
            _chai.expect(event.defaultIsPrevented()).to.be.true;
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            _chai.expect(event.defaultIsPrevented()).to.be.true;
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on'
        ]);
    });

    _mocha.it('should allow multiple prevention with no error', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            event.preventDefault();
            _chai.expect(event.defaultIsPrevented()).to.be.true;
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            event.preventDefault();
            _chai.expect(event.defaultIsPrevented()).to.be.true;
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on'
        ]);
    });

    _mocha.it('should prevent preventable event stages', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            event.prevent('on');
            _chai.expect(event.isPrevented('on')).to.be.true;
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', () => {
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before'
        ]);
    });

    _mocha.it('should distribute events to distributors', () => {
        const distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = _Pubsub(),
            subscriptionsExecuted = [];

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'publisher before 1',
            'publisher before 2',
            'distributor0 before 0',
            'distributor0 before 1',
            'distributor0 before 2',
            'distributor1 before 0',
            'distributor1 before 1',
            'distributor1 before 2',
            'distributor2 before 0',
            'distributor2 before 1',
            'distributor2 before 2',
            'distributor0a before 0',
            'distributor0a before 1',
            'distributor0a before 2',
            'distributor0b before 0',
            'distributor0b before 1',
            'distributor0b before 2',
            'distributor1a before 0',
            'distributor1a before 1',
            'distributor1a before 2',
            'distributor1b before 0',
            'distributor1b before 1',
            'distributor1b before 2',
            'distributor2a before 0',
            'distributor2a before 1',
            'distributor2a before 2',
            'distributor2b before 0',
            'distributor2b before 1',
            'distributor2b before 2',
            'publisher on 0',
            'publisher on 1',
            'publisher on 2',
            'distributor0 on 0',
            'distributor0 on 1',
            'distributor0 on 2',
            'distributor1 on 0',
            'distributor1 on 1',
            'distributor1 on 2',
            'distributor2 on 0',
            'distributor2 on 1',
            'distributor2 on 2',
            'distributor0a on 0',
            'distributor0a on 1',
            'distributor0a on 2',
            'distributor0b on 0',
            'distributor0b on 1',
            'distributor0b on 2',
            'distributor1a on 0',
            'distributor1a on 1',
            'distributor1a on 2',
            'distributor1b on 0',
            'distributor1b on 1',
            'distributor1b on 2',
            'distributor2a on 0',
            'distributor2a on 1',
            'distributor2a on 2',
            'distributor2b on 0',
            'distributor2b on 1',
            'distributor2b on 2',
            'publisher after 0',
            'publisher after 1',
            'publisher after 2',
            'distributor0 after 0',
            'distributor0 after 1',
            'distributor0 after 2',
            'distributor1 after 0',
            'distributor1 after 1',
            'distributor1 after 2',
            'distributor2 after 0',
            'distributor2 after 1',
            'distributor2 after 2',
            'distributor0a after 0',
            'distributor0a after 1',
            'distributor0a after 2',
            'distributor0b after 0',
            'distributor0b after 1',
            'distributor0b after 2',
            'distributor1a after 0',
            'distributor1a after 1',
            'distributor1a after 2',
            'distributor1b after 0',
            'distributor1b after 1',
            'distributor1b after 2',
            'distributor2a after 0',
            'distributor2a after 1',
            'distributor2a after 2',
            'distributor2b after 0',
            'distributor2b after 1',
            'distributor2b after 2'
        ]);
    });

    _mocha.it('should not execute further stages if the event is stopped', () => {
        const distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = _Pubsub(),
            subscriptionsExecuted = [];

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                event.stopEvent();
                _chai.expect(event.eventStopped).to.be.true;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'publisher before 1',
            'publisher before 2',
            'distributor0 before 0',
            'distributor0 before 1',
            'distributor0 before 2',
            'distributor1 before 0',
            'distributor1 before 1',
            'distributor1 before 2',
            'distributor2 before 0',
            'distributor2 before 1',
            'distributor2 before 2',
            'distributor0a before 0',
            'distributor0a before 1',
            'distributor0a before 2',
            'distributor0b before 0',
            'distributor0b before 1',
            'distributor0b before 2',
            'distributor1a before 0',
            'distributor1a before 1',
            'distributor1a before 2',
            'distributor1b before 0',
            'distributor1b before 1',
            'distributor1b before 2',
            'distributor2a before 0',
            'distributor2a before 1',
            'distributor2a before 2',
            'distributor2b before 0',
            'distributor2b before 1',
            'distributor2b before 2'
        ]);
    });

    _mocha.it('should not distribute events to distributors when distribution is stopped within a given stage', () => {
        const distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = _Pubsub(),
            subscriptionsExecuted = [];

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                event.stopDistribution();
                _chai.expect(event.distributionStopped).to.be.true;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'publisher before 1',
            'publisher before 2',
            'publisher on 0',
            'publisher on 1',
            'publisher on 2',
            'distributor0 on 0',
            'distributor0 on 1',
            'distributor0 on 2',
            'distributor1 on 0',
            'distributor1 on 1',
            'distributor1 on 2',
            'distributor2 on 0',
            'distributor2 on 1',
            'distributor2 on 2',
            'distributor0a on 0',
            'distributor0a on 1',
            'distributor0a on 2',
            'distributor0b on 0',
            'distributor0b on 1',
            'distributor0b on 2',
            'distributor1a on 0',
            'distributor1a on 1',
            'distributor1a on 2',
            'distributor1b on 0',
            'distributor1b on 1',
            'distributor1b on 2',
            'distributor2a on 0',
            'distributor2a on 1',
            'distributor2a on 2',
            'distributor2b on 0',
            'distributor2b on 1',
            'distributor2b on 2',
            'publisher after 0',
            'publisher after 1',
            'publisher after 2',
            'distributor0 after 0',
            'distributor0 after 1',
            'distributor0 after 2',
            'distributor1 after 0',
            'distributor1 after 1',
            'distributor1 after 2',
            'distributor2 after 0',
            'distributor2 after 1',
            'distributor2 after 2',
            'distributor0a after 0',
            'distributor0a after 1',
            'distributor0a after 2',
            'distributor0b after 0',
            'distributor0b after 1',
            'distributor0b after 2',
            'distributor1a after 0',
            'distributor1a after 1',
            'distributor1a after 2',
            'distributor1b after 0',
            'distributor1b after 1',
            'distributor1b after 2',
            'distributor2a after 0',
            'distributor2a after 1',
            'distributor2a after 2',
            'distributor2b after 0',
            'distributor2b after 1',
            'distributor2b after 2'
        ]);
    });

    _mocha.it('should not execute further subscribers when dispatch is stopped within a given stage', () => {
        const distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = _Pubsub(),
            subscriptionsExecuted = [];

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                event.stopDispatch();
                _chai.expect(event.dispatchStopped).to.be.true;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'distributor0 before 0',
            'distributor1 before 0',
            'distributor2 before 0',
            'distributor0a before 0',
            'distributor0b before 0',
            'distributor1a before 0',
            'distributor1b before 0',
            'distributor2a before 0',
            'distributor2b before 0',
            'publisher on 0',
            'publisher on 1',
            'publisher on 2',
            'distributor0 on 0',
            'distributor0 on 1',
            'distributor0 on 2',
            'distributor1 on 0',
            'distributor1 on 1',
            'distributor1 on 2',
            'distributor2 on 0',
            'distributor2 on 1',
            'distributor2 on 2',
            'distributor0a on 0',
            'distributor0a on 1',
            'distributor0a on 2',
            'distributor0b on 0',
            'distributor0b on 1',
            'distributor0b on 2',
            'distributor1a on 0',
            'distributor1a on 1',
            'distributor1a on 2',
            'distributor1b on 0',
            'distributor1b on 1',
            'distributor1b on 2',
            'distributor2a on 0',
            'distributor2a on 1',
            'distributor2a on 2',
            'distributor2b on 0',
            'distributor2b on 1',
            'distributor2b on 2',
            'publisher after 0',
            'publisher after 1',
            'publisher after 2',
            'distributor0 after 0',
            'distributor0 after 1',
            'distributor0 after 2',
            'distributor1 after 0',
            'distributor1 after 1',
            'distributor1 after 2',
            'distributor2 after 0',
            'distributor2 after 1',
            'distributor2 after 2',
            'distributor0a after 0',
            'distributor0a after 1',
            'distributor0a after 2',
            'distributor0b after 0',
            'distributor0b after 1',
            'distributor0b after 2',
            'distributor1a after 0',
            'distributor1a after 1',
            'distributor1a after 2',
            'distributor1b after 0',
            'distributor1b after 1',
            'distributor1b after 2',
            'distributor2a after 0',
            'distributor2a after 1',
            'distributor2a after 2',
            'distributor2b after 0',
            'distributor2b after 1',
            'distributor2b after 2'
        ]);
    });

    _mocha.it('should not distribute events to distributors after they have been removed', () => {
        const distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = _Pubsub(),
            subscriptionsExecuted = [];

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        distributor0.removeDistributor([
            distributor0a,
            distributor0b
        ]);

        distributor2.removeDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        publisher.removeDistributor(distributor1);

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'publisher before 1',
            'publisher before 2',
            'distributor0 before 0',
            'distributor0 before 1',
            'distributor0 before 2',
            'distributor1 before 0',
            'distributor1 before 1',
            'distributor1 before 2',
            'distributor2 before 0',
            'distributor2 before 1',
            'distributor2 before 2',
            'distributor0a before 0',
            'distributor0a before 1',
            'distributor0a before 2',
            'distributor0b before 0',
            'distributor0b before 1',
            'distributor0b before 2',
            'distributor1a before 0',
            'distributor1a before 1',
            'distributor1a before 2',
            'distributor1b before 0',
            'distributor1b before 1',
            'distributor1b before 2',
            'distributor2a before 0',
            'distributor2a before 1',
            'distributor2a before 2',
            'distributor2b before 0',
            'distributor2b before 1',
            'distributor2b before 2',
            'publisher on 0',
            'publisher on 1',
            'publisher on 2',
            'distributor0 on 0',
            'distributor0 on 1',
            'distributor0 on 2',
            'distributor1 on 0',
            'distributor1 on 1',
            'distributor1 on 2',
            'distributor2 on 0',
            'distributor2 on 1',
            'distributor2 on 2',
            'distributor0a on 0',
            'distributor0a on 1',
            'distributor0a on 2',
            'distributor0b on 0',
            'distributor0b on 1',
            'distributor0b on 2',
            'distributor1a on 0',
            'distributor1a on 1',
            'distributor1a on 2',
            'distributor1b on 0',
            'distributor1b on 1',
            'distributor1b on 2',
            'distributor2a on 0',
            'distributor2a on 1',
            'distributor2a on 2',
            'distributor2b on 0',
            'distributor2b on 1',
            'distributor2b on 2',
            'publisher after 0',
            'publisher after 1',
            'publisher after 2',
            'distributor0 after 0',
            'distributor0 after 1',
            'distributor0 after 2',
            'distributor1 after 0',
            'distributor1 after 1',
            'distributor1 after 2',
            'distributor2 after 0',
            'distributor2 after 1',
            'distributor2 after 2',
            'distributor0a after 0',
            'distributor0a after 1',
            'distributor0a after 2',
            'distributor0b after 0',
            'distributor0b after 1',
            'distributor0b after 2',
            'distributor1a after 0',
            'distributor1a after 1',
            'distributor1a after 2',
            'distributor1b after 0',
            'distributor1b after 1',
            'distributor1b after 2',
            'distributor2a after 0',
            'distributor2a after 1',
            'distributor2a after 2',
            'distributor2b after 0',
            'distributor2b after 1',
            'distributor2b after 2',
            'publisher before 0',
            'publisher before 1',
            'publisher before 2',
            'distributor0 before 0',
            'distributor0 before 1',
            'distributor0 before 2',
            'distributor2 before 0',
            'distributor2 before 1',
            'distributor2 before 2',
            'publisher on 0',
            'publisher on 1',
            'publisher on 2',
            'distributor0 on 0',
            'distributor0 on 1',
            'distributor0 on 2',
            'distributor2 on 0',
            'distributor2 on 1',
            'distributor2 on 2',
            'publisher after 0',
            'publisher after 1',
            'publisher after 2',
            'distributor0 after 0',
            'distributor0 after 1',
            'distributor0 after 2',
            'distributor2 after 0',
            'distributor2 after 1',
            'distributor2 after 2'
        ]);
    });

    _mocha.it('should not affect a distributor\'s event state', () => {
        const methodsExecuted = [],
            subscriptionsExecuted = [],

            A = _make([
                _Pubsub
            ], {
                a () {
                    methodsExecuted.push('a');
                }
            }, {
                _pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        defaultFunction: 'a',
                        publishOnce: true
                    }
                }
            }),
            B = _make([
                _Pubsub
            ], {
                b () {
                    methodsExecuted.push('b');
                }
            }, {
                _pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        defaultFunction: 'b',
                        publishOnce: true
                    }
                }
            }),

            a = A(),
            b = B();

        b.addDistributor(a);

        a.on('testEvent', () => {
            subscriptionsExecuted.push('a');
        });

        b.on('testEvent', () => {
            subscriptionsExecuted.push('b');
        });

        b.publish('testEvent');

        _chai.expect(methodsExecuted).to.deep.equal([
            'b'
        ]);

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'b',
            'a'
        ]);

        a.publish('testEvent');

        _chai.expect(methodsExecuted).to.deep.equal([
            'b',
            'a'
        ]);

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'b',
            'a',
            'a'
        ]);

        b.publish('testEvent');

        _chai.expect(methodsExecuted).to.deep.equal([
            'b',
            'a'
        ]);

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'b',
            'a',
            'a'
        ]);

        a.publish('testEvent');

        _chai.expect(methodsExecuted).to.deep.equal([
            'b',
            'a'
        ]);

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'b',
            'a',
            'a'
        ]);
    });

    _mocha.it('should remove non-existant distributors with no error', () => {
        const distributor = _Pubsub(),
            pubsub = _Pubsub();

        pubsub.removeDistributor(distributor);
    });

    _mocha.it('should accept bulk subscription', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [],
            testSubscription0 = pubsub.bulkSubscribe({
                config: {
                    callbackFunction () {
                        subscriptionsExecuted.push('after 0');
                    }
                },
                eventName: 'testEvent',
                stageName: 'after'
            }),
            testSubscription1 = pubsub.bulkSubscribe({
                config: [{
                    callbackFunction () {
                        subscriptionsExecuted.push('before 0');
                    }
                }, {
                    callbackFunction () {
                        subscriptionsExecuted.push('before 1');
                    },
                    once: true
                }, () => {
                    subscriptionsExecuted.push('before 2');
                }],
                eventName: 'testEvent',
                stageName: 'before'
            }),
            testSubscription2 = pubsub.bulkSubscribe([{
                config () {
                    subscriptionsExecuted.push('after 1');
                },
                eventName: 'testEvent',
                stageName: 'after'
            }, {
                config: {
                    callbackFunction () {
                        subscriptionsExecuted.push('after 2');
                    }
                },
                eventName: [
                    'anotherEvent',
                    'testEvent'
                ],
                once: true,
                stageName: 'after'
            }, {
                eventName: {
                    anotherEvent () {
                        subscriptionsExecuted.push('on 0');
                    },
                    testEvent: [{
                        callbackFunction () {
                            subscriptionsExecuted.push('on 1');
                        },
                        once: true
                    }, () => {
                        subscriptionsExecuted.push('on 2');
                    }]
                },
                stageName: 'on'
            }]),
            testSubscription3 = pubsub.bulkSubscribe({
                config: [
                    () => {
                        subscriptionsExecuted.push('on 3 a');
                    },
                    () => {
                        subscriptionsExecuted.push('on 3 b');
                    },
                    () => {
                        subscriptionsExecuted.push('on 3 c');
                    }
                ],
                eventName: [
                    'anotherEvent',
                    'testEvent'
                ],
                stageName: 'on'
            });

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);

        pubsub.publish('testEvent').publish('anotherEvent').publish('testEvent');

        testSubscription2.unsubscribe();

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before 0',
            'before 1',
            'before 2',
            'on 1',
            'on 2',
            'on 3 a',
            'on 3 b',
            'on 3 c',
            'after 0',
            'after 1',
            'after 2',
            'on 0',
            'on 3 a',
            'on 3 b',
            'on 3 c',
            'after 2',
            'before 0',
            'before 2',
            'on 2',
            'on 3 a',
            'on 3 b',
            'on 3 c',
            'after 0',
            'after 1',
            'before 0',
            'before 2',
            'on 3 a',
            'on 3 b',
            'on 3 c',
            'after 0'
        ]);
    });

    _mocha.it('should accept protected bulk subscription', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [],
            testSubscription0 = pubsub._bulkSubscribe({
                config: {
                    callbackFunction () {
                        subscriptionsExecuted.push('after 0');
                    }
                },
                eventName: 'testEvent',
                stageName: 'after'
            }),
            testSubscription1 = pubsub._bulkSubscribe({
                config: [{
                    callbackFunction () {
                        subscriptionsExecuted.push('before 0');
                    }
                }, {
                    callbackFunction () {
                        subscriptionsExecuted.push('before 1');
                    },
                    once: true
                }, () => {
                    subscriptionsExecuted.push('before 2');
                }],
                eventName: 'testEvent',
                stageName: 'before'
            }),
            testSubscription2 = pubsub._bulkSubscribe([{
                config () {
                    subscriptionsExecuted.push('after 1');
                },
                eventName: 'testEvent',
                stageName: 'after'
            }, {
                config: {
                    callbackFunction () {
                        subscriptionsExecuted.push('after 2');
                    }
                },
                eventName: [
                    'anotherEvent',
                    'testEvent'
                ],
                once: true,
                stageName: 'after'
            }, {
                eventName: {
                    anotherEvent () {
                        subscriptionsExecuted.push('on 0');
                    },
                    testEvent: [{
                        callbackFunction () {
                            subscriptionsExecuted.push('on 1');
                        },
                        once: true
                    }, () => {
                        subscriptionsExecuted.push('on 2');
                    }]
                },
                stageName: 'on'
            }]),
            testSubscription3 = pubsub._bulkSubscribe({
                config: [
                    () => {
                        subscriptionsExecuted.push('on 3 a');
                    },
                    () => {
                        subscriptionsExecuted.push('on 3 b');
                    },
                    () => {
                        subscriptionsExecuted.push('on 3 c');
                    }
                ],
                eventName: [
                    'anotherEvent',
                    'testEvent'
                ],
                stageName: 'on'
            });

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);

        pubsub.publish('testEvent').publish('anotherEvent').publish('testEvent');

        testSubscription2.unsubscribe();

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before 0',
            'before 1',
            'before 2',
            'on 1',
            'on 2',
            'on 3 a',
            'on 3 b',
            'on 3 c',
            'after 0',
            'after 1',
            'after 2',
            'on 0',
            'on 3 a',
            'on 3 b',
            'on 3 c',
            'after 2',
            'before 0',
            'before 2',
            'on 2',
            'on 3 a',
            'on 3 b',
            'on 3 c',
            'after 0',
            'after 1',
            'before 0',
            'before 2',
            'on 3 a',
            'on 3 b',
            'on 3 c',
            'after 0'
        ]);
    });

    _mocha.it('should allow bulk unsubscription of all subscriptions', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub(),
            testSubscription0 = pubsub.before('testEvent0', callbackFunction),
            testSubscription1 = pubsub.before('testEvent0', callbackFunction),
            testSubscription2 = pubsub.before('testEvent0', callbackFunction),
            testSubscription3 = pubsub.on('testEvent0', callbackFunction),
            testSubscription4 = pubsub.on('testEvent0', callbackFunction),
            testSubscription5 = pubsub.on('testEvent0', callbackFunction),
            testSubscription6 = pubsub.after('testEvent0', callbackFunction),
            testSubscription7 = pubsub.after('testEvent0', callbackFunction),
            testSubscription8 = pubsub.after('testEvent0', callbackFunction),
            testSubscription9 = pubsub.before('testEvent1', callbackFunction),
            testSubscription10 = pubsub.before('testEvent1', callbackFunction),
            testSubscription11 = pubsub.before('testEvent1', callbackFunction),
            testSubscription12 = pubsub.on('testEvent1', callbackFunction),
            testSubscription13 = pubsub.on('testEvent1', callbackFunction),
            testSubscription14 = pubsub.on('testEvent1', callbackFunction),
            testSubscription15 = pubsub.after('testEvent1', callbackFunction),
            testSubscription16 = pubsub.after('testEvent1', callbackFunction),
            testSubscription17 = pubsub.after('testEvent1', callbackFunction),
            testSubscription18 = pubsub.before('testEvent2', callbackFunction),
            testSubscription19 = pubsub.before('testEvent2', callbackFunction),
            testSubscription20 = pubsub.before('testEvent2', callbackFunction),
            testSubscription21 = pubsub.on('testEvent2', callbackFunction),
            testSubscription22 = pubsub.on('testEvent2', callbackFunction),
            testSubscription23 = pubsub.on('testEvent2', callbackFunction),
            testSubscription24 = pubsub.after('testEvent2', callbackFunction),
            testSubscription25 = pubsub.after('testEvent2', callbackFunction),
            testSubscription26 = pubsub.after('testEvent2', callbackFunction);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);

        _chai.expect(pubsub.bulkUnsubscribe()).to.equal(true);

        _chai.expect(testSubscription0).to.have.property('subscribed', false);
        _chai.expect(testSubscription1).to.have.property('subscribed', false);
        _chai.expect(testSubscription2).to.have.property('subscribed', false);
        _chai.expect(testSubscription3).to.have.property('subscribed', false);
        _chai.expect(testSubscription4).to.have.property('subscribed', false);
        _chai.expect(testSubscription5).to.have.property('subscribed', false);
        _chai.expect(testSubscription6).to.have.property('subscribed', false);
        _chai.expect(testSubscription7).to.have.property('subscribed', false);
        _chai.expect(testSubscription8).to.have.property('subscribed', false);
        _chai.expect(testSubscription9).to.have.property('subscribed', false);
        _chai.expect(testSubscription10).to.have.property('subscribed', false);
        _chai.expect(testSubscription11).to.have.property('subscribed', false);
        _chai.expect(testSubscription12).to.have.property('subscribed', false);
        _chai.expect(testSubscription13).to.have.property('subscribed', false);
        _chai.expect(testSubscription14).to.have.property('subscribed', false);
        _chai.expect(testSubscription15).to.have.property('subscribed', false);
        _chai.expect(testSubscription16).to.have.property('subscribed', false);
        _chai.expect(testSubscription17).to.have.property('subscribed', false);
        _chai.expect(testSubscription18).to.have.property('subscribed', false);
        _chai.expect(testSubscription19).to.have.property('subscribed', false);
        _chai.expect(testSubscription20).to.have.property('subscribed', false);
        _chai.expect(testSubscription21).to.have.property('subscribed', false);
        _chai.expect(testSubscription22).to.have.property('subscribed', false);
        _chai.expect(testSubscription23).to.have.property('subscribed', false);
        _chai.expect(testSubscription24).to.have.property('subscribed', false);
        _chai.expect(testSubscription25).to.have.property('subscribed', false);
        _chai.expect(testSubscription26).to.have.property('subscribed', false);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(0);

        _chai.expect(pubsub.bulkUnsubscribe()).to.equal(false);
    });

    _mocha.it('should allow bulk unsubscription of an event', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub(),
            testSubscription0 = pubsub.before('testEvent0', callbackFunction),
            testSubscription1 = pubsub.before('testEvent0', callbackFunction),
            testSubscription2 = pubsub.before('testEvent0', callbackFunction),
            testSubscription3 = pubsub.on('testEvent0', callbackFunction),
            testSubscription4 = pubsub.on('testEvent0', callbackFunction),
            testSubscription5 = pubsub.on('testEvent0', callbackFunction),
            testSubscription6 = pubsub.after('testEvent0', callbackFunction),
            testSubscription7 = pubsub.after('testEvent0', callbackFunction),
            testSubscription8 = pubsub.after('testEvent0', callbackFunction),
            testSubscription9 = pubsub.before('testEvent1', callbackFunction),
            testSubscription10 = pubsub.before('testEvent1', callbackFunction),
            testSubscription11 = pubsub.before('testEvent1', callbackFunction),
            testSubscription12 = pubsub.on('testEvent1', callbackFunction),
            testSubscription13 = pubsub.on('testEvent1', callbackFunction),
            testSubscription14 = pubsub.on('testEvent1', callbackFunction),
            testSubscription15 = pubsub.after('testEvent1', callbackFunction),
            testSubscription16 = pubsub.after('testEvent1', callbackFunction),
            testSubscription17 = pubsub.after('testEvent1', callbackFunction),
            testSubscription18 = pubsub.before('testEvent2', callbackFunction),
            testSubscription19 = pubsub.before('testEvent2', callbackFunction),
            testSubscription20 = pubsub.before('testEvent2', callbackFunction),
            testSubscription21 = pubsub.on('testEvent2', callbackFunction),
            testSubscription22 = pubsub.on('testEvent2', callbackFunction),
            testSubscription23 = pubsub.on('testEvent2', callbackFunction),
            testSubscription24 = pubsub.after('testEvent2', callbackFunction),
            testSubscription25 = pubsub.after('testEvent2', callbackFunction),
            testSubscription26 = pubsub.after('testEvent2', callbackFunction);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);

        _chai.expect(pubsub.bulkUnsubscribe('testEvent1')).to.equal(true);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', false);
        _chai.expect(testSubscription10).to.have.property('subscribed', false);
        _chai.expect(testSubscription11).to.have.property('subscribed', false);
        _chai.expect(testSubscription12).to.have.property('subscribed', false);
        _chai.expect(testSubscription13).to.have.property('subscribed', false);
        _chai.expect(testSubscription14).to.have.property('subscribed', false);
        _chai.expect(testSubscription15).to.have.property('subscribed', false);
        _chai.expect(testSubscription16).to.have.property('subscribed', false);
        _chai.expect(testSubscription17).to.have.property('subscribed', false);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(18);

        _chai.expect(pubsub.bulkUnsubscribe('testEvent1')).to.equal(false);
    });

    _mocha.it('should allow bulk unsubscription of multiple events', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub(),
            testSubscription0 = pubsub.before('testEvent0', callbackFunction),
            testSubscription1 = pubsub.before('testEvent0', callbackFunction),
            testSubscription2 = pubsub.before('testEvent0', callbackFunction),
            testSubscription3 = pubsub.on('testEvent0', callbackFunction),
            testSubscription4 = pubsub.on('testEvent0', callbackFunction),
            testSubscription5 = pubsub.on('testEvent0', callbackFunction),
            testSubscription6 = pubsub.after('testEvent0', callbackFunction),
            testSubscription7 = pubsub.after('testEvent0', callbackFunction),
            testSubscription8 = pubsub.after('testEvent0', callbackFunction),
            testSubscription9 = pubsub.before('testEvent1', callbackFunction),
            testSubscription10 = pubsub.before('testEvent1', callbackFunction),
            testSubscription11 = pubsub.before('testEvent1', callbackFunction),
            testSubscription12 = pubsub.on('testEvent1', callbackFunction),
            testSubscription13 = pubsub.on('testEvent1', callbackFunction),
            testSubscription14 = pubsub.on('testEvent1', callbackFunction),
            testSubscription15 = pubsub.after('testEvent1', callbackFunction),
            testSubscription16 = pubsub.after('testEvent1', callbackFunction),
            testSubscription17 = pubsub.after('testEvent1', callbackFunction),
            testSubscription18 = pubsub.before('testEvent2', callbackFunction),
            testSubscription19 = pubsub.before('testEvent2', callbackFunction),
            testSubscription20 = pubsub.before('testEvent2', callbackFunction),
            testSubscription21 = pubsub.on('testEvent2', callbackFunction),
            testSubscription22 = pubsub.on('testEvent2', callbackFunction),
            testSubscription23 = pubsub.on('testEvent2', callbackFunction),
            testSubscription24 = pubsub.after('testEvent2', callbackFunction),
            testSubscription25 = pubsub.after('testEvent2', callbackFunction),
            testSubscription26 = pubsub.after('testEvent2', callbackFunction);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);

        _chai.expect(pubsub.bulkUnsubscribe([
            'testEvent0',
            'testEvent1'
        ])).to.equal(true);

        _chai.expect(testSubscription0).to.have.property('subscribed', false);
        _chai.expect(testSubscription1).to.have.property('subscribed', false);
        _chai.expect(testSubscription2).to.have.property('subscribed', false);
        _chai.expect(testSubscription3).to.have.property('subscribed', false);
        _chai.expect(testSubscription4).to.have.property('subscribed', false);
        _chai.expect(testSubscription5).to.have.property('subscribed', false);
        _chai.expect(testSubscription6).to.have.property('subscribed', false);
        _chai.expect(testSubscription7).to.have.property('subscribed', false);
        _chai.expect(testSubscription8).to.have.property('subscribed', false);
        _chai.expect(testSubscription9).to.have.property('subscribed', false);
        _chai.expect(testSubscription10).to.have.property('subscribed', false);
        _chai.expect(testSubscription11).to.have.property('subscribed', false);
        _chai.expect(testSubscription12).to.have.property('subscribed', false);
        _chai.expect(testSubscription13).to.have.property('subscribed', false);
        _chai.expect(testSubscription14).to.have.property('subscribed', false);
        _chai.expect(testSubscription15).to.have.property('subscribed', false);
        _chai.expect(testSubscription16).to.have.property('subscribed', false);
        _chai.expect(testSubscription17).to.have.property('subscribed', false);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(9);

        _chai.expect(pubsub.bulkUnsubscribe([
            'testEvent0',
            'testEvent1'
        ])).to.equal(false);
    });

    _mocha.it('should allow bulk unsubscription of an event at a specific stage', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub(),
            testSubscription0 = pubsub.before('testEvent0', callbackFunction),
            testSubscription1 = pubsub.before('testEvent0', callbackFunction),
            testSubscription2 = pubsub.before('testEvent0', callbackFunction),
            testSubscription3 = pubsub.on('testEvent0', callbackFunction),
            testSubscription4 = pubsub.on('testEvent0', callbackFunction),
            testSubscription5 = pubsub.on('testEvent0', callbackFunction),
            testSubscription6 = pubsub.after('testEvent0', callbackFunction),
            testSubscription7 = pubsub.after('testEvent0', callbackFunction),
            testSubscription8 = pubsub.after('testEvent0', callbackFunction),
            testSubscription9 = pubsub.before('testEvent1', callbackFunction),
            testSubscription10 = pubsub.before('testEvent1', callbackFunction),
            testSubscription11 = pubsub.before('testEvent1', callbackFunction),
            testSubscription12 = pubsub.on('testEvent1', callbackFunction),
            testSubscription13 = pubsub.on('testEvent1', callbackFunction),
            testSubscription14 = pubsub.on('testEvent1', callbackFunction),
            testSubscription15 = pubsub.after('testEvent1', callbackFunction),
            testSubscription16 = pubsub.after('testEvent1', callbackFunction),
            testSubscription17 = pubsub.after('testEvent1', callbackFunction),
            testSubscription18 = pubsub.before('testEvent2', callbackFunction),
            testSubscription19 = pubsub.before('testEvent2', callbackFunction),
            testSubscription20 = pubsub.before('testEvent2', callbackFunction),
            testSubscription21 = pubsub.on('testEvent2', callbackFunction),
            testSubscription22 = pubsub.on('testEvent2', callbackFunction),
            testSubscription23 = pubsub.on('testEvent2', callbackFunction),
            testSubscription24 = pubsub.after('testEvent2', callbackFunction),
            testSubscription25 = pubsub.after('testEvent2', callbackFunction),
            testSubscription26 = pubsub.after('testEvent2', callbackFunction);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);

        _chai.expect(pubsub.bulkUnsubscribe('on', 'testEvent1')).to.equal(true);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', false);
        _chai.expect(testSubscription13).to.have.property('subscribed', false);
        _chai.expect(testSubscription14).to.have.property('subscribed', false);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(24);

        _chai.expect(pubsub.bulkUnsubscribe('on', 'testEvent1')).to.equal(false);
    });

    _mocha.it('should allow bulk unsubscription of an event at multiple stages', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub(),
            testSubscription0 = pubsub.before('testEvent0', callbackFunction),
            testSubscription1 = pubsub.before('testEvent0', callbackFunction),
            testSubscription2 = pubsub.before('testEvent0', callbackFunction),
            testSubscription3 = pubsub.on('testEvent0', callbackFunction),
            testSubscription4 = pubsub.on('testEvent0', callbackFunction),
            testSubscription5 = pubsub.on('testEvent0', callbackFunction),
            testSubscription6 = pubsub.after('testEvent0', callbackFunction),
            testSubscription7 = pubsub.after('testEvent0', callbackFunction),
            testSubscription8 = pubsub.after('testEvent0', callbackFunction),
            testSubscription9 = pubsub.before('testEvent1', callbackFunction),
            testSubscription10 = pubsub.before('testEvent1', callbackFunction),
            testSubscription11 = pubsub.before('testEvent1', callbackFunction),
            testSubscription12 = pubsub.on('testEvent1', callbackFunction),
            testSubscription13 = pubsub.on('testEvent1', callbackFunction),
            testSubscription14 = pubsub.on('testEvent1', callbackFunction),
            testSubscription15 = pubsub.after('testEvent1', callbackFunction),
            testSubscription16 = pubsub.after('testEvent1', callbackFunction),
            testSubscription17 = pubsub.after('testEvent1', callbackFunction),
            testSubscription18 = pubsub.before('testEvent2', callbackFunction),
            testSubscription19 = pubsub.before('testEvent2', callbackFunction),
            testSubscription20 = pubsub.before('testEvent2', callbackFunction),
            testSubscription21 = pubsub.on('testEvent2', callbackFunction),
            testSubscription22 = pubsub.on('testEvent2', callbackFunction),
            testSubscription23 = pubsub.on('testEvent2', callbackFunction),
            testSubscription24 = pubsub.after('testEvent2', callbackFunction),
            testSubscription25 = pubsub.after('testEvent2', callbackFunction),
            testSubscription26 = pubsub.after('testEvent2', callbackFunction);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);

        _chai.expect(pubsub.bulkUnsubscribe([
            'after',
            'before'
        ], 'testEvent1')).to.equal(true);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', false);
        _chai.expect(testSubscription10).to.have.property('subscribed', false);
        _chai.expect(testSubscription11).to.have.property('subscribed', false);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', false);
        _chai.expect(testSubscription16).to.have.property('subscribed', false);
        _chai.expect(testSubscription17).to.have.property('subscribed', false);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(21);

        _chai.expect(pubsub.bulkUnsubscribe([
            'after',
            'before'
        ], 'testEvent1')).to.equal(false);
    });

    _mocha.it('should allow bulk unsubscription of multiple events at a specific stage', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub(),
            testSubscription0 = pubsub.before('testEvent0', callbackFunction),
            testSubscription1 = pubsub.before('testEvent0', callbackFunction),
            testSubscription2 = pubsub.before('testEvent0', callbackFunction),
            testSubscription3 = pubsub.on('testEvent0', callbackFunction),
            testSubscription4 = pubsub.on('testEvent0', callbackFunction),
            testSubscription5 = pubsub.on('testEvent0', callbackFunction),
            testSubscription6 = pubsub.after('testEvent0', callbackFunction),
            testSubscription7 = pubsub.after('testEvent0', callbackFunction),
            testSubscription8 = pubsub.after('testEvent0', callbackFunction),
            testSubscription9 = pubsub.before('testEvent1', callbackFunction),
            testSubscription10 = pubsub.before('testEvent1', callbackFunction),
            testSubscription11 = pubsub.before('testEvent1', callbackFunction),
            testSubscription12 = pubsub.on('testEvent1', callbackFunction),
            testSubscription13 = pubsub.on('testEvent1', callbackFunction),
            testSubscription14 = pubsub.on('testEvent1', callbackFunction),
            testSubscription15 = pubsub.after('testEvent1', callbackFunction),
            testSubscription16 = pubsub.after('testEvent1', callbackFunction),
            testSubscription17 = pubsub.after('testEvent1', callbackFunction),
            testSubscription18 = pubsub.before('testEvent2', callbackFunction),
            testSubscription19 = pubsub.before('testEvent2', callbackFunction),
            testSubscription20 = pubsub.before('testEvent2', callbackFunction),
            testSubscription21 = pubsub.on('testEvent2', callbackFunction),
            testSubscription22 = pubsub.on('testEvent2', callbackFunction),
            testSubscription23 = pubsub.on('testEvent2', callbackFunction),
            testSubscription24 = pubsub.after('testEvent2', callbackFunction),
            testSubscription25 = pubsub.after('testEvent2', callbackFunction),
            testSubscription26 = pubsub.after('testEvent2', callbackFunction);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);

        _chai.expect(pubsub.bulkUnsubscribe('on', [
            'testEvent0',
            'testEvent2'
        ])).to.equal(true);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', false);
        _chai.expect(testSubscription4).to.have.property('subscribed', false);
        _chai.expect(testSubscription5).to.have.property('subscribed', false);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', false);
        _chai.expect(testSubscription22).to.have.property('subscribed', false);
        _chai.expect(testSubscription23).to.have.property('subscribed', false);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(21);

        _chai.expect(pubsub.bulkUnsubscribe('on', [
            'testEvent0',
            'testEvent2'
        ])).to.equal(false);
    });

    _mocha.it('should allow bulk unsubscription of multiple events at multiple stages', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub(),
            testSubscription0 = pubsub.before('testEvent0', callbackFunction),
            testSubscription1 = pubsub.before('testEvent0', callbackFunction),
            testSubscription2 = pubsub.before('testEvent0', callbackFunction),
            testSubscription3 = pubsub.on('testEvent0', callbackFunction),
            testSubscription4 = pubsub.on('testEvent0', callbackFunction),
            testSubscription5 = pubsub.on('testEvent0', callbackFunction),
            testSubscription6 = pubsub.after('testEvent0', callbackFunction),
            testSubscription7 = pubsub.after('testEvent0', callbackFunction),
            testSubscription8 = pubsub.after('testEvent0', callbackFunction),
            testSubscription9 = pubsub.before('testEvent1', callbackFunction),
            testSubscription10 = pubsub.before('testEvent1', callbackFunction),
            testSubscription11 = pubsub.before('testEvent1', callbackFunction),
            testSubscription12 = pubsub.on('testEvent1', callbackFunction),
            testSubscription13 = pubsub.on('testEvent1', callbackFunction),
            testSubscription14 = pubsub.on('testEvent1', callbackFunction),
            testSubscription15 = pubsub.after('testEvent1', callbackFunction),
            testSubscription16 = pubsub.after('testEvent1', callbackFunction),
            testSubscription17 = pubsub.after('testEvent1', callbackFunction),
            testSubscription18 = pubsub.before('testEvent2', callbackFunction),
            testSubscription19 = pubsub.before('testEvent2', callbackFunction),
            testSubscription20 = pubsub.before('testEvent2', callbackFunction),
            testSubscription21 = pubsub.on('testEvent2', callbackFunction),
            testSubscription22 = pubsub.on('testEvent2', callbackFunction),
            testSubscription23 = pubsub.on('testEvent2', callbackFunction),
            testSubscription24 = pubsub.after('testEvent2', callbackFunction),
            testSubscription25 = pubsub.after('testEvent2', callbackFunction),
            testSubscription26 = pubsub.after('testEvent2', callbackFunction);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);

        _chai.expect(pubsub.bulkUnsubscribe([
            'before',
            'on'
        ], [
            'testEvent0',
            'testEvent2'
        ])).to.equal(true);

        _chai.expect(testSubscription0).to.have.property('subscribed', false);
        _chai.expect(testSubscription1).to.have.property('subscribed', false);
        _chai.expect(testSubscription2).to.have.property('subscribed', false);
        _chai.expect(testSubscription3).to.have.property('subscribed', false);
        _chai.expect(testSubscription4).to.have.property('subscribed', false);
        _chai.expect(testSubscription5).to.have.property('subscribed', false);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', false);
        _chai.expect(testSubscription19).to.have.property('subscribed', false);
        _chai.expect(testSubscription20).to.have.property('subscribed', false);
        _chai.expect(testSubscription21).to.have.property('subscribed', false);
        _chai.expect(testSubscription22).to.have.property('subscribed', false);
        _chai.expect(testSubscription23).to.have.property('subscribed', false);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(15);

        _chai.expect(pubsub.bulkUnsubscribe([
            'before',
            'on'
        ], [
            'testEvent0',
            'testEvent2'
        ])).to.equal(false);
    });

    _mocha.it('should allow bulk unsubscription with specific configuration', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub(),
            testSubscription0 = pubsub.before('testEvent0', callbackFunction),
            testSubscription1 = pubsub.before('testEvent0', callbackFunction),
            testSubscription2 = pubsub.before('testEvent0', callbackFunction),
            testSubscription3 = pubsub.on('testEvent0', callbackFunction),
            testSubscription4 = pubsub.on('testEvent0', callbackFunction),
            testSubscription5 = pubsub.on('testEvent0', callbackFunction),
            testSubscription6 = pubsub.after('testEvent0', callbackFunction),
            testSubscription7 = pubsub.after('testEvent0', callbackFunction),
            testSubscription8 = pubsub.after('testEvent0', callbackFunction),
            testSubscription9 = pubsub.before('testEvent1', callbackFunction),
            testSubscription10 = pubsub.before('testEvent1', callbackFunction),
            testSubscription11 = pubsub.before('testEvent1', callbackFunction),
            testSubscription12 = pubsub.on('testEvent1', callbackFunction),
            testSubscription13 = pubsub.on('testEvent1', callbackFunction),
            testSubscription14 = pubsub.on('testEvent1', callbackFunction),
            testSubscription15 = pubsub.after('testEvent1', callbackFunction),
            testSubscription16 = pubsub.after('testEvent1', callbackFunction),
            testSubscription17 = pubsub.after('testEvent1', callbackFunction),
            testSubscription18 = pubsub.before('testEvent2', callbackFunction),
            testSubscription19 = pubsub.before('testEvent2', callbackFunction),
            testSubscription20 = pubsub.before('testEvent2', callbackFunction),
            testSubscription21 = pubsub.on('testEvent2', callbackFunction),
            testSubscription22 = pubsub.on('testEvent2', callbackFunction),
            testSubscription23 = pubsub.on('testEvent2', callbackFunction),
            testSubscription24 = pubsub.after('testEvent2', callbackFunction),
            testSubscription25 = pubsub.after('testEvent2', callbackFunction),
            testSubscription26 = pubsub.after('testEvent2', callbackFunction);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);

        _chai.expect(pubsub.bulkUnsubscribe([
            {
                eventName: 'testEvent0',
                stageName: 'before'
            },
            'testEvent1',
            {
                eventName: 'testEvent2',
                stageName: 'after'
            }
        ])).to.equal(true);

        _chai.expect(testSubscription0).to.have.property('subscribed', false);
        _chai.expect(testSubscription1).to.have.property('subscribed', false);
        _chai.expect(testSubscription2).to.have.property('subscribed', false);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', false);
        _chai.expect(testSubscription10).to.have.property('subscribed', false);
        _chai.expect(testSubscription11).to.have.property('subscribed', false);
        _chai.expect(testSubscription12).to.have.property('subscribed', false);
        _chai.expect(testSubscription13).to.have.property('subscribed', false);
        _chai.expect(testSubscription14).to.have.property('subscribed', false);
        _chai.expect(testSubscription15).to.have.property('subscribed', false);
        _chai.expect(testSubscription16).to.have.property('subscribed', false);
        _chai.expect(testSubscription17).to.have.property('subscribed', false);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', false);
        _chai.expect(testSubscription25).to.have.property('subscribed', false);
        _chai.expect(testSubscription26).to.have.property('subscribed', false);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(12);

        _chai.expect(pubsub.bulkUnsubscribe([
            {
                eventName: 'testEvent0',
                stageName: 'before'
            },
            'testEvent1',
            {
                eventName: 'testEvent2',
                stageName: 'after'
            }
        ])).to.equal(false);
    });

    _mocha.it('should handle bulk unsubscription of undefined events', () => {
        const pubsub = _Pubsub();

        _chai.expect(pubsub.bulkUnsubscribe('unknownEvent')).to.equal(false);
        _chai.expect(pubsub.bulkUnsubscribe('on', 'unknownEvent')).to.equal(false);
    });

    _mocha.it('should not allow public bulk unsubscription when allowPublicUnsubscription is false', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub({
                pubsub: {
                    testEvent0: {
                        allowPublicPublish: true,
                        allowPublicUnsubscription: false
                    },
                    testEvent1: {
                        allowPublicPublish: true,
                        allowPublicUnsubscription: false
                    },
                    testEvent2: {
                        allowPublicPublish: true,
                        allowPublicUnsubscription: false
                    }
                }
            }),
            testSubscription0 = pubsub.before('testEvent0', callbackFunction),
            testSubscription1 = pubsub.before('testEvent0', callbackFunction),
            testSubscription2 = pubsub.before('testEvent0', callbackFunction),
            testSubscription3 = pubsub.on('testEvent0', callbackFunction),
            testSubscription4 = pubsub.on('testEvent0', callbackFunction),
            testSubscription5 = pubsub.on('testEvent0', callbackFunction),
            testSubscription6 = pubsub.after('testEvent0', callbackFunction),
            testSubscription7 = pubsub.after('testEvent0', callbackFunction),
            testSubscription8 = pubsub.after('testEvent0', callbackFunction),
            testSubscription9 = pubsub.before('testEvent1', callbackFunction),
            testSubscription10 = pubsub.before('testEvent1', callbackFunction),
            testSubscription11 = pubsub.before('testEvent1', callbackFunction),
            testSubscription12 = pubsub.on('testEvent1', callbackFunction),
            testSubscription13 = pubsub.on('testEvent1', callbackFunction),
            testSubscription14 = pubsub.on('testEvent1', callbackFunction),
            testSubscription15 = pubsub.after('testEvent1', callbackFunction),
            testSubscription16 = pubsub.after('testEvent1', callbackFunction),
            testSubscription17 = pubsub.after('testEvent1', callbackFunction),
            testSubscription18 = pubsub.before('testEvent2', callbackFunction),
            testSubscription19 = pubsub.before('testEvent2', callbackFunction),
            testSubscription20 = pubsub.before('testEvent2', callbackFunction),
            testSubscription21 = pubsub.on('testEvent2', callbackFunction),
            testSubscription22 = pubsub.on('testEvent2', callbackFunction),
            testSubscription23 = pubsub.on('testEvent2', callbackFunction),
            testSubscription24 = pubsub.after('testEvent2', callbackFunction),
            testSubscription25 = pubsub.after('testEvent2', callbackFunction),
            testSubscription26 = pubsub.after('testEvent2', callbackFunction);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);

        _chai.expect(pubsub.bulkUnsubscribe()).to.equal(false);
        _chai.expect(pubsub.bulkUnsubscribe('testEvent0')).to.equal(false);
        _chai.expect(pubsub.bulkUnsubscribe('on', 'testEvent0')).to.equal(false);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);
    });

    _mocha.it('should allow protected bulk unsubscription of all subscriptions', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub(),
            testSubscription0 = pubsub.before('testEvent0', callbackFunction),
            testSubscription1 = pubsub.before('testEvent0', callbackFunction),
            testSubscription2 = pubsub.before('testEvent0', callbackFunction),
            testSubscription3 = pubsub.on('testEvent0', callbackFunction),
            testSubscription4 = pubsub.on('testEvent0', callbackFunction),
            testSubscription5 = pubsub.on('testEvent0', callbackFunction),
            testSubscription6 = pubsub.after('testEvent0', callbackFunction),
            testSubscription7 = pubsub.after('testEvent0', callbackFunction),
            testSubscription8 = pubsub.after('testEvent0', callbackFunction),
            testSubscription9 = pubsub.before('testEvent1', callbackFunction),
            testSubscription10 = pubsub.before('testEvent1', callbackFunction),
            testSubscription11 = pubsub.before('testEvent1', callbackFunction),
            testSubscription12 = pubsub.on('testEvent1', callbackFunction),
            testSubscription13 = pubsub.on('testEvent1', callbackFunction),
            testSubscription14 = pubsub.on('testEvent1', callbackFunction),
            testSubscription15 = pubsub.after('testEvent1', callbackFunction),
            testSubscription16 = pubsub.after('testEvent1', callbackFunction),
            testSubscription17 = pubsub.after('testEvent1', callbackFunction),
            testSubscription18 = pubsub.before('testEvent2', callbackFunction),
            testSubscription19 = pubsub.before('testEvent2', callbackFunction),
            testSubscription20 = pubsub.before('testEvent2', callbackFunction),
            testSubscription21 = pubsub.on('testEvent2', callbackFunction),
            testSubscription22 = pubsub.on('testEvent2', callbackFunction),
            testSubscription23 = pubsub.on('testEvent2', callbackFunction),
            testSubscription24 = pubsub.after('testEvent2', callbackFunction),
            testSubscription25 = pubsub.after('testEvent2', callbackFunction),
            testSubscription26 = pubsub.after('testEvent2', callbackFunction);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);

        _chai.expect(pubsub._bulkUnsubscribe()).to.equal(true);

        _chai.expect(testSubscription0).to.have.property('subscribed', false);
        _chai.expect(testSubscription1).to.have.property('subscribed', false);
        _chai.expect(testSubscription2).to.have.property('subscribed', false);
        _chai.expect(testSubscription3).to.have.property('subscribed', false);
        _chai.expect(testSubscription4).to.have.property('subscribed', false);
        _chai.expect(testSubscription5).to.have.property('subscribed', false);
        _chai.expect(testSubscription6).to.have.property('subscribed', false);
        _chai.expect(testSubscription7).to.have.property('subscribed', false);
        _chai.expect(testSubscription8).to.have.property('subscribed', false);
        _chai.expect(testSubscription9).to.have.property('subscribed', false);
        _chai.expect(testSubscription10).to.have.property('subscribed', false);
        _chai.expect(testSubscription11).to.have.property('subscribed', false);
        _chai.expect(testSubscription12).to.have.property('subscribed', false);
        _chai.expect(testSubscription13).to.have.property('subscribed', false);
        _chai.expect(testSubscription14).to.have.property('subscribed', false);
        _chai.expect(testSubscription15).to.have.property('subscribed', false);
        _chai.expect(testSubscription16).to.have.property('subscribed', false);
        _chai.expect(testSubscription17).to.have.property('subscribed', false);
        _chai.expect(testSubscription18).to.have.property('subscribed', false);
        _chai.expect(testSubscription19).to.have.property('subscribed', false);
        _chai.expect(testSubscription20).to.have.property('subscribed', false);
        _chai.expect(testSubscription21).to.have.property('subscribed', false);
        _chai.expect(testSubscription22).to.have.property('subscribed', false);
        _chai.expect(testSubscription23).to.have.property('subscribed', false);
        _chai.expect(testSubscription24).to.have.property('subscribed', false);
        _chai.expect(testSubscription25).to.have.property('subscribed', false);
        _chai.expect(testSubscription26).to.have.property('subscribed', false);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(0);

        _chai.expect(pubsub._bulkUnsubscribe()).to.equal(false);
    });

    _mocha.it('should allow protected bulk unsubscription of an event', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub(),
            testSubscription0 = pubsub.before('testEvent0', callbackFunction),
            testSubscription1 = pubsub.before('testEvent0', callbackFunction),
            testSubscription2 = pubsub.before('testEvent0', callbackFunction),
            testSubscription3 = pubsub.on('testEvent0', callbackFunction),
            testSubscription4 = pubsub.on('testEvent0', callbackFunction),
            testSubscription5 = pubsub.on('testEvent0', callbackFunction),
            testSubscription6 = pubsub.after('testEvent0', callbackFunction),
            testSubscription7 = pubsub.after('testEvent0', callbackFunction),
            testSubscription8 = pubsub.after('testEvent0', callbackFunction),
            testSubscription9 = pubsub.before('testEvent1', callbackFunction),
            testSubscription10 = pubsub.before('testEvent1', callbackFunction),
            testSubscription11 = pubsub.before('testEvent1', callbackFunction),
            testSubscription12 = pubsub.on('testEvent1', callbackFunction),
            testSubscription13 = pubsub.on('testEvent1', callbackFunction),
            testSubscription14 = pubsub.on('testEvent1', callbackFunction),
            testSubscription15 = pubsub.after('testEvent1', callbackFunction),
            testSubscription16 = pubsub.after('testEvent1', callbackFunction),
            testSubscription17 = pubsub.after('testEvent1', callbackFunction),
            testSubscription18 = pubsub.before('testEvent2', callbackFunction),
            testSubscription19 = pubsub.before('testEvent2', callbackFunction),
            testSubscription20 = pubsub.before('testEvent2', callbackFunction),
            testSubscription21 = pubsub.on('testEvent2', callbackFunction),
            testSubscription22 = pubsub.on('testEvent2', callbackFunction),
            testSubscription23 = pubsub.on('testEvent2', callbackFunction),
            testSubscription24 = pubsub.after('testEvent2', callbackFunction),
            testSubscription25 = pubsub.after('testEvent2', callbackFunction),
            testSubscription26 = pubsub.after('testEvent2', callbackFunction);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);

        _chai.expect(pubsub._bulkUnsubscribe('testEvent1')).to.equal(true);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', false);
        _chai.expect(testSubscription10).to.have.property('subscribed', false);
        _chai.expect(testSubscription11).to.have.property('subscribed', false);
        _chai.expect(testSubscription12).to.have.property('subscribed', false);
        _chai.expect(testSubscription13).to.have.property('subscribed', false);
        _chai.expect(testSubscription14).to.have.property('subscribed', false);
        _chai.expect(testSubscription15).to.have.property('subscribed', false);
        _chai.expect(testSubscription16).to.have.property('subscribed', false);
        _chai.expect(testSubscription17).to.have.property('subscribed', false);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(18);

        _chai.expect(pubsub._bulkUnsubscribe('testEvent1')).to.equal(false);
    });

    _mocha.it('should allow protected bulk unsubscription of multiple events', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub(),
            testSubscription0 = pubsub.before('testEvent0', callbackFunction),
            testSubscription1 = pubsub.before('testEvent0', callbackFunction),
            testSubscription2 = pubsub.before('testEvent0', callbackFunction),
            testSubscription3 = pubsub.on('testEvent0', callbackFunction),
            testSubscription4 = pubsub.on('testEvent0', callbackFunction),
            testSubscription5 = pubsub.on('testEvent0', callbackFunction),
            testSubscription6 = pubsub.after('testEvent0', callbackFunction),
            testSubscription7 = pubsub.after('testEvent0', callbackFunction),
            testSubscription8 = pubsub.after('testEvent0', callbackFunction),
            testSubscription9 = pubsub.before('testEvent1', callbackFunction),
            testSubscription10 = pubsub.before('testEvent1', callbackFunction),
            testSubscription11 = pubsub.before('testEvent1', callbackFunction),
            testSubscription12 = pubsub.on('testEvent1', callbackFunction),
            testSubscription13 = pubsub.on('testEvent1', callbackFunction),
            testSubscription14 = pubsub.on('testEvent1', callbackFunction),
            testSubscription15 = pubsub.after('testEvent1', callbackFunction),
            testSubscription16 = pubsub.after('testEvent1', callbackFunction),
            testSubscription17 = pubsub.after('testEvent1', callbackFunction),
            testSubscription18 = pubsub.before('testEvent2', callbackFunction),
            testSubscription19 = pubsub.before('testEvent2', callbackFunction),
            testSubscription20 = pubsub.before('testEvent2', callbackFunction),
            testSubscription21 = pubsub.on('testEvent2', callbackFunction),
            testSubscription22 = pubsub.on('testEvent2', callbackFunction),
            testSubscription23 = pubsub.on('testEvent2', callbackFunction),
            testSubscription24 = pubsub.after('testEvent2', callbackFunction),
            testSubscription25 = pubsub.after('testEvent2', callbackFunction),
            testSubscription26 = pubsub.after('testEvent2', callbackFunction);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);

        _chai.expect(pubsub._bulkUnsubscribe([
            'testEvent0',
            'testEvent1'
        ])).to.equal(true);

        _chai.expect(testSubscription0).to.have.property('subscribed', false);
        _chai.expect(testSubscription1).to.have.property('subscribed', false);
        _chai.expect(testSubscription2).to.have.property('subscribed', false);
        _chai.expect(testSubscription3).to.have.property('subscribed', false);
        _chai.expect(testSubscription4).to.have.property('subscribed', false);
        _chai.expect(testSubscription5).to.have.property('subscribed', false);
        _chai.expect(testSubscription6).to.have.property('subscribed', false);
        _chai.expect(testSubscription7).to.have.property('subscribed', false);
        _chai.expect(testSubscription8).to.have.property('subscribed', false);
        _chai.expect(testSubscription9).to.have.property('subscribed', false);
        _chai.expect(testSubscription10).to.have.property('subscribed', false);
        _chai.expect(testSubscription11).to.have.property('subscribed', false);
        _chai.expect(testSubscription12).to.have.property('subscribed', false);
        _chai.expect(testSubscription13).to.have.property('subscribed', false);
        _chai.expect(testSubscription14).to.have.property('subscribed', false);
        _chai.expect(testSubscription15).to.have.property('subscribed', false);
        _chai.expect(testSubscription16).to.have.property('subscribed', false);
        _chai.expect(testSubscription17).to.have.property('subscribed', false);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(9);

        _chai.expect(pubsub._bulkUnsubscribe([
            'testEvent0',
            'testEvent1'
        ])).to.equal(false);
    });

    _mocha.it('should allow protected bulk unsubscription of an event at a specific stage', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub(),
            testSubscription0 = pubsub.before('testEvent0', callbackFunction),
            testSubscription1 = pubsub.before('testEvent0', callbackFunction),
            testSubscription2 = pubsub.before('testEvent0', callbackFunction),
            testSubscription3 = pubsub.on('testEvent0', callbackFunction),
            testSubscription4 = pubsub.on('testEvent0', callbackFunction),
            testSubscription5 = pubsub.on('testEvent0', callbackFunction),
            testSubscription6 = pubsub.after('testEvent0', callbackFunction),
            testSubscription7 = pubsub.after('testEvent0', callbackFunction),
            testSubscription8 = pubsub.after('testEvent0', callbackFunction),
            testSubscription9 = pubsub.before('testEvent1', callbackFunction),
            testSubscription10 = pubsub.before('testEvent1', callbackFunction),
            testSubscription11 = pubsub.before('testEvent1', callbackFunction),
            testSubscription12 = pubsub.on('testEvent1', callbackFunction),
            testSubscription13 = pubsub.on('testEvent1', callbackFunction),
            testSubscription14 = pubsub.on('testEvent1', callbackFunction),
            testSubscription15 = pubsub.after('testEvent1', callbackFunction),
            testSubscription16 = pubsub.after('testEvent1', callbackFunction),
            testSubscription17 = pubsub.after('testEvent1', callbackFunction),
            testSubscription18 = pubsub.before('testEvent2', callbackFunction),
            testSubscription19 = pubsub.before('testEvent2', callbackFunction),
            testSubscription20 = pubsub.before('testEvent2', callbackFunction),
            testSubscription21 = pubsub.on('testEvent2', callbackFunction),
            testSubscription22 = pubsub.on('testEvent2', callbackFunction),
            testSubscription23 = pubsub.on('testEvent2', callbackFunction),
            testSubscription24 = pubsub.after('testEvent2', callbackFunction),
            testSubscription25 = pubsub.after('testEvent2', callbackFunction),
            testSubscription26 = pubsub.after('testEvent2', callbackFunction);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);

        _chai.expect(pubsub._bulkUnsubscribe('on', 'testEvent1')).to.equal(true);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', false);
        _chai.expect(testSubscription13).to.have.property('subscribed', false);
        _chai.expect(testSubscription14).to.have.property('subscribed', false);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(24);

        _chai.expect(pubsub._bulkUnsubscribe('on', 'testEvent1')).to.equal(false);
    });

    _mocha.it('should allow protected bulk unsubscription of an event at multiple stages', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub(),
            testSubscription0 = pubsub.before('testEvent0', callbackFunction),
            testSubscription1 = pubsub.before('testEvent0', callbackFunction),
            testSubscription2 = pubsub.before('testEvent0', callbackFunction),
            testSubscription3 = pubsub.on('testEvent0', callbackFunction),
            testSubscription4 = pubsub.on('testEvent0', callbackFunction),
            testSubscription5 = pubsub.on('testEvent0', callbackFunction),
            testSubscription6 = pubsub.after('testEvent0', callbackFunction),
            testSubscription7 = pubsub.after('testEvent0', callbackFunction),
            testSubscription8 = pubsub.after('testEvent0', callbackFunction),
            testSubscription9 = pubsub.before('testEvent1', callbackFunction),
            testSubscription10 = pubsub.before('testEvent1', callbackFunction),
            testSubscription11 = pubsub.before('testEvent1', callbackFunction),
            testSubscription12 = pubsub.on('testEvent1', callbackFunction),
            testSubscription13 = pubsub.on('testEvent1', callbackFunction),
            testSubscription14 = pubsub.on('testEvent1', callbackFunction),
            testSubscription15 = pubsub.after('testEvent1', callbackFunction),
            testSubscription16 = pubsub.after('testEvent1', callbackFunction),
            testSubscription17 = pubsub.after('testEvent1', callbackFunction),
            testSubscription18 = pubsub.before('testEvent2', callbackFunction),
            testSubscription19 = pubsub.before('testEvent2', callbackFunction),
            testSubscription20 = pubsub.before('testEvent2', callbackFunction),
            testSubscription21 = pubsub.on('testEvent2', callbackFunction),
            testSubscription22 = pubsub.on('testEvent2', callbackFunction),
            testSubscription23 = pubsub.on('testEvent2', callbackFunction),
            testSubscription24 = pubsub.after('testEvent2', callbackFunction),
            testSubscription25 = pubsub.after('testEvent2', callbackFunction),
            testSubscription26 = pubsub.after('testEvent2', callbackFunction);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);

        _chai.expect(pubsub._bulkUnsubscribe([
            'after',
            'before'
        ], 'testEvent1')).to.equal(true);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', false);
        _chai.expect(testSubscription10).to.have.property('subscribed', false);
        _chai.expect(testSubscription11).to.have.property('subscribed', false);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', false);
        _chai.expect(testSubscription16).to.have.property('subscribed', false);
        _chai.expect(testSubscription17).to.have.property('subscribed', false);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(21);

        _chai.expect(pubsub._bulkUnsubscribe([
            'after',
            'before'
        ], 'testEvent1')).to.equal(false);
    });

    _mocha.it('should allow protected bulk unsubscription of multiple events at a specific stage', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub(),
            testSubscription0 = pubsub.before('testEvent0', callbackFunction),
            testSubscription1 = pubsub.before('testEvent0', callbackFunction),
            testSubscription2 = pubsub.before('testEvent0', callbackFunction),
            testSubscription3 = pubsub.on('testEvent0', callbackFunction),
            testSubscription4 = pubsub.on('testEvent0', callbackFunction),
            testSubscription5 = pubsub.on('testEvent0', callbackFunction),
            testSubscription6 = pubsub.after('testEvent0', callbackFunction),
            testSubscription7 = pubsub.after('testEvent0', callbackFunction),
            testSubscription8 = pubsub.after('testEvent0', callbackFunction),
            testSubscription9 = pubsub.before('testEvent1', callbackFunction),
            testSubscription10 = pubsub.before('testEvent1', callbackFunction),
            testSubscription11 = pubsub.before('testEvent1', callbackFunction),
            testSubscription12 = pubsub.on('testEvent1', callbackFunction),
            testSubscription13 = pubsub.on('testEvent1', callbackFunction),
            testSubscription14 = pubsub.on('testEvent1', callbackFunction),
            testSubscription15 = pubsub.after('testEvent1', callbackFunction),
            testSubscription16 = pubsub.after('testEvent1', callbackFunction),
            testSubscription17 = pubsub.after('testEvent1', callbackFunction),
            testSubscription18 = pubsub.before('testEvent2', callbackFunction),
            testSubscription19 = pubsub.before('testEvent2', callbackFunction),
            testSubscription20 = pubsub.before('testEvent2', callbackFunction),
            testSubscription21 = pubsub.on('testEvent2', callbackFunction),
            testSubscription22 = pubsub.on('testEvent2', callbackFunction),
            testSubscription23 = pubsub.on('testEvent2', callbackFunction),
            testSubscription24 = pubsub.after('testEvent2', callbackFunction),
            testSubscription25 = pubsub.after('testEvent2', callbackFunction),
            testSubscription26 = pubsub.after('testEvent2', callbackFunction);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);

        _chai.expect(pubsub._bulkUnsubscribe('on', [
            'testEvent0',
            'testEvent2'
        ])).to.equal(true);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', false);
        _chai.expect(testSubscription4).to.have.property('subscribed', false);
        _chai.expect(testSubscription5).to.have.property('subscribed', false);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', false);
        _chai.expect(testSubscription22).to.have.property('subscribed', false);
        _chai.expect(testSubscription23).to.have.property('subscribed', false);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(21);

        _chai.expect(pubsub._bulkUnsubscribe('on', [
            'testEvent0',
            'testEvent2'
        ])).to.equal(false);
    });

    _mocha.it('should allow protected bulk unsubscription of multiple events at multiple stages', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub(),
            testSubscription0 = pubsub.before('testEvent0', callbackFunction),
            testSubscription1 = pubsub.before('testEvent0', callbackFunction),
            testSubscription2 = pubsub.before('testEvent0', callbackFunction),
            testSubscription3 = pubsub.on('testEvent0', callbackFunction),
            testSubscription4 = pubsub.on('testEvent0', callbackFunction),
            testSubscription5 = pubsub.on('testEvent0', callbackFunction),
            testSubscription6 = pubsub.after('testEvent0', callbackFunction),
            testSubscription7 = pubsub.after('testEvent0', callbackFunction),
            testSubscription8 = pubsub.after('testEvent0', callbackFunction),
            testSubscription9 = pubsub.before('testEvent1', callbackFunction),
            testSubscription10 = pubsub.before('testEvent1', callbackFunction),
            testSubscription11 = pubsub.before('testEvent1', callbackFunction),
            testSubscription12 = pubsub.on('testEvent1', callbackFunction),
            testSubscription13 = pubsub.on('testEvent1', callbackFunction),
            testSubscription14 = pubsub.on('testEvent1', callbackFunction),
            testSubscription15 = pubsub.after('testEvent1', callbackFunction),
            testSubscription16 = pubsub.after('testEvent1', callbackFunction),
            testSubscription17 = pubsub.after('testEvent1', callbackFunction),
            testSubscription18 = pubsub.before('testEvent2', callbackFunction),
            testSubscription19 = pubsub.before('testEvent2', callbackFunction),
            testSubscription20 = pubsub.before('testEvent2', callbackFunction),
            testSubscription21 = pubsub.on('testEvent2', callbackFunction),
            testSubscription22 = pubsub.on('testEvent2', callbackFunction),
            testSubscription23 = pubsub.on('testEvent2', callbackFunction),
            testSubscription24 = pubsub.after('testEvent2', callbackFunction),
            testSubscription25 = pubsub.after('testEvent2', callbackFunction),
            testSubscription26 = pubsub.after('testEvent2', callbackFunction);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);

        _chai.expect(pubsub._bulkUnsubscribe([
            'before',
            'on'
        ], [
            'testEvent0',
            'testEvent2'
        ])).to.equal(true);

        _chai.expect(testSubscription0).to.have.property('subscribed', false);
        _chai.expect(testSubscription1).to.have.property('subscribed', false);
        _chai.expect(testSubscription2).to.have.property('subscribed', false);
        _chai.expect(testSubscription3).to.have.property('subscribed', false);
        _chai.expect(testSubscription4).to.have.property('subscribed', false);
        _chai.expect(testSubscription5).to.have.property('subscribed', false);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', false);
        _chai.expect(testSubscription19).to.have.property('subscribed', false);
        _chai.expect(testSubscription20).to.have.property('subscribed', false);
        _chai.expect(testSubscription21).to.have.property('subscribed', false);
        _chai.expect(testSubscription22).to.have.property('subscribed', false);
        _chai.expect(testSubscription23).to.have.property('subscribed', false);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(15);

        _chai.expect(pubsub._bulkUnsubscribe([
            'before',
            'on'
        ], [
            'testEvent0',
            'testEvent2'
        ])).to.equal(false);
    });

    _mocha.it('should allow protected bulk unsubscription with specific configuration', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub(),
            testSubscription0 = pubsub.before('testEvent0', callbackFunction),
            testSubscription1 = pubsub.before('testEvent0', callbackFunction),
            testSubscription2 = pubsub.before('testEvent0', callbackFunction),
            testSubscription3 = pubsub.on('testEvent0', callbackFunction),
            testSubscription4 = pubsub.on('testEvent0', callbackFunction),
            testSubscription5 = pubsub.on('testEvent0', callbackFunction),
            testSubscription6 = pubsub.after('testEvent0', callbackFunction),
            testSubscription7 = pubsub.after('testEvent0', callbackFunction),
            testSubscription8 = pubsub.after('testEvent0', callbackFunction),
            testSubscription9 = pubsub.before('testEvent1', callbackFunction),
            testSubscription10 = pubsub.before('testEvent1', callbackFunction),
            testSubscription11 = pubsub.before('testEvent1', callbackFunction),
            testSubscription12 = pubsub.on('testEvent1', callbackFunction),
            testSubscription13 = pubsub.on('testEvent1', callbackFunction),
            testSubscription14 = pubsub.on('testEvent1', callbackFunction),
            testSubscription15 = pubsub.after('testEvent1', callbackFunction),
            testSubscription16 = pubsub.after('testEvent1', callbackFunction),
            testSubscription17 = pubsub.after('testEvent1', callbackFunction),
            testSubscription18 = pubsub.before('testEvent2', callbackFunction),
            testSubscription19 = pubsub.before('testEvent2', callbackFunction),
            testSubscription20 = pubsub.before('testEvent2', callbackFunction),
            testSubscription21 = pubsub.on('testEvent2', callbackFunction),
            testSubscription22 = pubsub.on('testEvent2', callbackFunction),
            testSubscription23 = pubsub.on('testEvent2', callbackFunction),
            testSubscription24 = pubsub.after('testEvent2', callbackFunction),
            testSubscription25 = pubsub.after('testEvent2', callbackFunction),
            testSubscription26 = pubsub.after('testEvent2', callbackFunction);

        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', true);
        _chai.expect(testSubscription10).to.have.property('subscribed', true);
        _chai.expect(testSubscription11).to.have.property('subscribed', true);
        _chai.expect(testSubscription12).to.have.property('subscribed', true);
        _chai.expect(testSubscription13).to.have.property('subscribed', true);
        _chai.expect(testSubscription14).to.have.property('subscribed', true);
        _chai.expect(testSubscription15).to.have.property('subscribed', true);
        _chai.expect(testSubscription16).to.have.property('subscribed', true);
        _chai.expect(testSubscription17).to.have.property('subscribed', true);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', true);
        _chai.expect(testSubscription25).to.have.property('subscribed', true);
        _chai.expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(27);

        _chai.expect(pubsub._bulkUnsubscribe([
            {
                eventName: 'testEvent0',
                stageName: 'before'
            },
            'testEvent1',
            {
                eventName: 'testEvent2',
                stageName: 'after'
            }
        ])).to.equal(true);

        _chai.expect(testSubscription0).to.have.property('subscribed', false);
        _chai.expect(testSubscription1).to.have.property('subscribed', false);
        _chai.expect(testSubscription2).to.have.property('subscribed', false);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);
        _chai.expect(testSubscription6).to.have.property('subscribed', true);
        _chai.expect(testSubscription7).to.have.property('subscribed', true);
        _chai.expect(testSubscription8).to.have.property('subscribed', true);
        _chai.expect(testSubscription9).to.have.property('subscribed', false);
        _chai.expect(testSubscription10).to.have.property('subscribed', false);
        _chai.expect(testSubscription11).to.have.property('subscribed', false);
        _chai.expect(testSubscription12).to.have.property('subscribed', false);
        _chai.expect(testSubscription13).to.have.property('subscribed', false);
        _chai.expect(testSubscription14).to.have.property('subscribed', false);
        _chai.expect(testSubscription15).to.have.property('subscribed', false);
        _chai.expect(testSubscription16).to.have.property('subscribed', false);
        _chai.expect(testSubscription17).to.have.property('subscribed', false);
        _chai.expect(testSubscription18).to.have.property('subscribed', true);
        _chai.expect(testSubscription19).to.have.property('subscribed', true);
        _chai.expect(testSubscription20).to.have.property('subscribed', true);
        _chai.expect(testSubscription21).to.have.property('subscribed', true);
        _chai.expect(testSubscription22).to.have.property('subscribed', true);
        _chai.expect(testSubscription23).to.have.property('subscribed', true);
        _chai.expect(testSubscription24).to.have.property('subscribed', false);
        _chai.expect(testSubscription25).to.have.property('subscribed', false);
        _chai.expect(testSubscription26).to.have.property('subscribed', false);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        _chai.expect(subscriptionExecutionCount).to.equal(12);

        _chai.expect(pubsub._bulkUnsubscribe([
            {
                eventName: 'testEvent0',
                stageName: 'before'
            },
            'testEvent1',
            {
                eventName: 'testEvent2',
                stageName: 'after'
            }
        ])).to.equal(false);
    });

    _mocha.it('should handle protected bulk unsubscription of undefined events', () => {
        const pubsub = _Pubsub();

        _chai.expect(pubsub._bulkUnsubscribe('unknownEvent')).to.equal(false);
        _chai.expect(pubsub._bulkUnsubscribe('on', 'unknownEvent')).to.equal(false);
    });

    _mocha.it('should not allow duplicate subscriptions when allowDuplicateSubscription is false', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = _Pubsub();

        pubsub.defineDispatcher('testEvent0', {
            allowDuplicateSubscription: false,
            allowPublicPublish: true
        });

        pubsub.on('testEvent0', callbackFunction);
        pubsub.on('testEvent0', callbackFunction);
        pubsub.onceOn('testEvent0', callbackFunction);
        pubsub.onceOn('testEvent0', callbackFunction);

        pubsub.on('testEvent1', callbackFunction);
        pubsub.on('testEvent1', callbackFunction);
        pubsub.onceOn('testEvent1', callbackFunction);
        pubsub.onceOn('testEvent1', callbackFunction);

        pubsub.publish('testEvent0');

        _chai.expect(subscriptionExecutionCount).to.equal(2);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent1');

        _chai.expect(subscriptionExecutionCount).to.equal(4);
    });

    _mocha.it('should not allow public publish', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineDispatcher('testEvent', {});

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', () => {
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', () => {
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([]);

        pubsub._publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    _mocha.it('should allow public publish when allowPublicPublish is true', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineDispatcher('testEvent', {
            allowPublicPublish: true
        });

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', () => {
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', () => {
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);

        pubsub._publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after',
            'before',
            'on',
            'after'
        ]);
    });

    _mocha.it('should not allow public subscribe when allowPublicSubscription is false', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            allowPublicSubscription: false
        });

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('public after');
        });

        pubsub.before('testEvent', () => {
            subscriptionsExecuted.push('public before');
        });

        pubsub.on('testEvent', () => {
            subscriptionsExecuted.push('public on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([]);

        pubsub._after('testEvent', () => {
            subscriptionsExecuted.push('protected after');
        });

        pubsub._before('testEvent', () => {
            subscriptionsExecuted.push('protected before');
        });

        pubsub._on('testEvent', () => {
            subscriptionsExecuted.push('protected on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'protected before',
            'protected on',
            'protected after'
        ]);
    });

    _mocha.it('should not publish a completeOnce event after it has already completed', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            completeOnce: true
        });

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('after');
        });

        pubsub.on('testEvent', () => {
            subscriptionsExecuted.push('on');
        });

        pubsub.onceBefore('testEvent', event => {
            event.preventDefault();
            subscriptionsExecuted.push('before');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on'
        ]);

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'on',
            'after'
        ]);

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'on',
            'after'
        ]);
    });

    _mocha.it('should not complete a completeOnce event after it has already completed', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            completeOnce: true
        });

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('after');
        });

        pubsub.on('testEvent', () => {
            subscriptionsExecuted.push('on');
        });

        pubsub.onceBefore('testEvent', () => {
            subscriptionsExecuted.push('before');
            pubsub.publish('testEvent');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after',
            'on'
        ]);
    });

    _mocha.it('should not stop dispatch when dispatchStoppable is false', () => {
        const distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = _Pubsub(),
            subscriptionsExecuted = [];

        publisher.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            dispatchStoppable: false
        });

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                event.stopDispatch();
                _chai.expect(event.dispatchStopped).not.to.be.true;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'publisher before 1',
            'publisher before 2',
            'distributor0 before 0',
            'distributor0 before 1',
            'distributor0 before 2',
            'distributor1 before 0',
            'distributor1 before 1',
            'distributor1 before 2',
            'distributor2 before 0',
            'distributor2 before 1',
            'distributor2 before 2',
            'distributor0a before 0',
            'distributor0a before 1',
            'distributor0a before 2',
            'distributor0b before 0',
            'distributor0b before 1',
            'distributor0b before 2',
            'distributor1a before 0',
            'distributor1a before 1',
            'distributor1a before 2',
            'distributor1b before 0',
            'distributor1b before 1',
            'distributor1b before 2',
            'distributor2a before 0',
            'distributor2a before 1',
            'distributor2a before 2',
            'distributor2b before 0',
            'distributor2b before 1',
            'distributor2b before 2',
            'publisher on 0',
            'publisher on 1',
            'publisher on 2',
            'distributor0 on 0',
            'distributor0 on 1',
            'distributor0 on 2',
            'distributor1 on 0',
            'distributor1 on 1',
            'distributor1 on 2',
            'distributor2 on 0',
            'distributor2 on 1',
            'distributor2 on 2',
            'distributor0a on 0',
            'distributor0a on 1',
            'distributor0a on 2',
            'distributor0b on 0',
            'distributor0b on 1',
            'distributor0b on 2',
            'distributor1a on 0',
            'distributor1a on 1',
            'distributor1a on 2',
            'distributor1b on 0',
            'distributor1b on 1',
            'distributor1b on 2',
            'distributor2a on 0',
            'distributor2a on 1',
            'distributor2a on 2',
            'distributor2b on 0',
            'distributor2b on 1',
            'distributor2b on 2',
            'publisher after 0',
            'publisher after 1',
            'publisher after 2',
            'distributor0 after 0',
            'distributor0 after 1',
            'distributor0 after 2',
            'distributor1 after 0',
            'distributor1 after 1',
            'distributor1 after 2',
            'distributor2 after 0',
            'distributor2 after 1',
            'distributor2 after 2',
            'distributor0a after 0',
            'distributor0a after 1',
            'distributor0a after 2',
            'distributor0b after 0',
            'distributor0b after 1',
            'distributor0b after 2',
            'distributor1a after 0',
            'distributor1a after 1',
            'distributor1a after 2',
            'distributor1b after 0',
            'distributor1b after 1',
            'distributor1b after 2',
            'distributor2a after 0',
            'distributor2a after 1',
            'distributor2a after 2',
            'distributor2b after 0',
            'distributor2b after 1',
            'distributor2b after 2'
        ]);
    });

    _mocha.it('should not distribute events to distributors when distributable is false', () => {
        const distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = _Pubsub(),
            subscriptionsExecuted = [];

        publisher.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            distributable: false
        });

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'publisher before 1',
            'publisher before 2',
            'publisher on 0',
            'publisher on 1',
            'publisher on 2',
            'publisher after 0',
            'publisher after 1',
            'publisher after 2'
        ]);
    });

    _mocha.it('should not stop distribution when distributionStoppable is false', () => {
        const distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = _Pubsub(),
            subscriptionsExecuted = [];

        publisher.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            distributionStoppable: false
        });

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                event.stopDistribution();
                _chai.expect(event.distributionStopped).not.to.be.true;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'publisher before 1',
            'publisher before 2',
            'distributor0 before 0',
            'distributor0 before 1',
            'distributor0 before 2',
            'distributor1 before 0',
            'distributor1 before 1',
            'distributor1 before 2',
            'distributor2 before 0',
            'distributor2 before 1',
            'distributor2 before 2',
            'distributor0a before 0',
            'distributor0a before 1',
            'distributor0a before 2',
            'distributor0b before 0',
            'distributor0b before 1',
            'distributor0b before 2',
            'distributor1a before 0',
            'distributor1a before 1',
            'distributor1a before 2',
            'distributor1b before 0',
            'distributor1b before 1',
            'distributor1b before 2',
            'distributor2a before 0',
            'distributor2a before 1',
            'distributor2a before 2',
            'distributor2b before 0',
            'distributor2b before 1',
            'distributor2b before 2',
            'publisher on 0',
            'publisher on 1',
            'publisher on 2',
            'distributor0 on 0',
            'distributor0 on 1',
            'distributor0 on 2',
            'distributor1 on 0',
            'distributor1 on 1',
            'distributor1 on 2',
            'distributor2 on 0',
            'distributor2 on 1',
            'distributor2 on 2',
            'distributor0a on 0',
            'distributor0a on 1',
            'distributor0a on 2',
            'distributor0b on 0',
            'distributor0b on 1',
            'distributor0b on 2',
            'distributor1a on 0',
            'distributor1a on 1',
            'distributor1a on 2',
            'distributor1b on 0',
            'distributor1b on 1',
            'distributor1b on 2',
            'distributor2a on 0',
            'distributor2a on 1',
            'distributor2a on 2',
            'distributor2b on 0',
            'distributor2b on 1',
            'distributor2b on 2',
            'publisher after 0',
            'publisher after 1',
            'publisher after 2',
            'distributor0 after 0',
            'distributor0 after 1',
            'distributor0 after 2',
            'distributor1 after 0',
            'distributor1 after 1',
            'distributor1 after 2',
            'distributor2 after 0',
            'distributor2 after 1',
            'distributor2 after 2',
            'distributor0a after 0',
            'distributor0a after 1',
            'distributor0a after 2',
            'distributor0b after 0',
            'distributor0b after 1',
            'distributor0b after 2',
            'distributor1a after 0',
            'distributor1a after 1',
            'distributor1a after 2',
            'distributor1b after 0',
            'distributor1b after 1',
            'distributor1b after 2',
            'distributor2a after 0',
            'distributor2a after 1',
            'distributor2a after 2',
            'distributor2b after 0',
            'distributor2b after 1',
            'distributor2b after 2'
        ]);
    });

    _mocha.it('should not stop the event when eventStoppable is false', () => {
        const distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = _Pubsub(),
            subscriptionsExecuted = [];

        publisher.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            eventStoppable: false
        });

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                event.stopEvent();
                _chai.expect(event.eventStopped).not.to.be.true;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'publisher before 1',
            'publisher before 2',
            'distributor0 before 0',
            'distributor0 before 1',
            'distributor0 before 2',
            'distributor1 before 0',
            'distributor1 before 1',
            'distributor1 before 2',
            'distributor2 before 0',
            'distributor2 before 1',
            'distributor2 before 2',
            'distributor0a before 0',
            'distributor0a before 1',
            'distributor0a before 2',
            'distributor0b before 0',
            'distributor0b before 1',
            'distributor0b before 2',
            'distributor1a before 0',
            'distributor1a before 1',
            'distributor1a before 2',
            'distributor1b before 0',
            'distributor1b before 1',
            'distributor1b before 2',
            'distributor2a before 0',
            'distributor2a before 1',
            'distributor2a before 2',
            'distributor2b before 0',
            'distributor2b before 1',
            'distributor2b before 2',
            'publisher on 0',
            'publisher on 1',
            'publisher on 2',
            'distributor0 on 0',
            'distributor0 on 1',
            'distributor0 on 2',
            'distributor1 on 0',
            'distributor1 on 1',
            'distributor1 on 2',
            'distributor2 on 0',
            'distributor2 on 1',
            'distributor2 on 2',
            'distributor0a on 0',
            'distributor0a on 1',
            'distributor0a on 2',
            'distributor0b on 0',
            'distributor0b on 1',
            'distributor0b on 2',
            'distributor1a on 0',
            'distributor1a on 1',
            'distributor1a on 2',
            'distributor1b on 0',
            'distributor1b on 1',
            'distributor1b on 2',
            'distributor2a on 0',
            'distributor2a on 1',
            'distributor2a on 2',
            'distributor2b on 0',
            'distributor2b on 1',
            'distributor2b on 2',
            'publisher after 0',
            'publisher after 1',
            'publisher after 2',
            'distributor0 after 0',
            'distributor0 after 1',
            'distributor0 after 2',
            'distributor1 after 0',
            'distributor1 after 1',
            'distributor1 after 2',
            'distributor2 after 0',
            'distributor2 after 1',
            'distributor2 after 2',
            'distributor0a after 0',
            'distributor0a after 1',
            'distributor0a after 2',
            'distributor0b after 0',
            'distributor0b after 1',
            'distributor0b after 2',
            'distributor1a after 0',
            'distributor1a after 1',
            'distributor1a after 2',
            'distributor1b after 0',
            'distributor1b after 1',
            'distributor1b after 2',
            'distributor2a after 0',
            'distributor2a after 1',
            'distributor2a after 2',
            'distributor2b after 0',
            'distributor2b after 1',
            'distributor2b after 2'
        ]);
    });

    _mocha.it('should not prevent events when preventable is false', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            preventable: false
        });

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            event.preventDefault();
            _chai.expect(event.defaultIsPrevented()).not.to.be.true;
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            _chai.expect(event.defaultIsPrevented()).not.to.be.true;
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    _mocha.it('should not prevent event stages when preventable is false', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            preventable: false
        });

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            event.prevent('on');
            _chai.expect(event.isPrevented('on')).not.to.be.true;
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', () => {
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    _mocha.it('should not publish a publishOnce event more than once', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            publishOnce: true
        });

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', () => {
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', () => {
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    _mocha.it('should allow custom event stages', () => {
        const customSymbol = Symbol('customSymbol'),
            pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            stages: [
                'wayBefore',
                'before',
                customSymbol,
                'on',
                'about-to-happen',
                _pubsub.defaultSymbol,
                'it just happened!'
            ]
        });

        pubsub.subscribe('about-to-happen', 'testEvent', event => {
            _chai.expect(event.completed).not.to.be.true;
            subscriptionsExecuted.push('about-to-happen');
        });

        pubsub.subscribe('after', 'testEvent', () => {
            subscriptionsExecuted.push('after');
        });

        pubsub.subscribe('before', 'testEvent', event => {
            _chai.expect(event.completed).not.to.be.true;
            subscriptionsExecuted.push('before');
        });

        pubsub.subscribe(customSymbol, 'testEvent', event => {
            _chai.expect(event.completed).not.to.be.true;
            subscriptionsExecuted.push('customSymbol');
        });

        pubsub.subscribe('it just happened!', 'testEvent', event => {
            _chai.expect(event.completed).to.be.true;
            subscriptionsExecuted.push('it just happened!');
        });

        pubsub.subscribe('on', 'testEvent', event => {
            _chai.expect(event.completed).not.to.be.true;
            subscriptionsExecuted.push('on');
        });

        pubsub.subscribe('wayBefore', 'testEvent', event => {
            _chai.expect(event.completed).not.to.be.true;
            subscriptionsExecuted.push('wayBefore');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'wayBefore',
            'before',
            'customSymbol',
            'on',
            'about-to-happen',
            'it just happened!'
        ]);
    });

    _mocha.it('should only prevent preventable event stages', () => {
        const pubsub = _Pubsub();

        let subscriptionsExecuted = [];

        pubsub.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            preventable: new Set([
                'b',
                'd'
            ]),
            stages: [
                'a',
                'b',
                'c',
                'd'
            ]
        });

        pubsub.subscribe('a', 'testEvent', {
            callbackFunction (event) {
                event.prevent('b');
                _chai.expect(event.isPrevented('b')).to.be.true;
                subscriptionsExecuted.push('a');
            },
            once: true
        });

        pubsub.subscribe('b', 'testEvent', () => {
            subscriptionsExecuted.push('b');
        });

        pubsub.subscribe('c', 'testEvent', () => {
            subscriptionsExecuted.push('c');
        });

        pubsub.subscribe('d', 'testEvent', () => {
            subscriptionsExecuted.push('d');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'a'
        ]);

        subscriptionsExecuted = [];

        pubsub.subscribe('a', 'testEvent', {
            callbackFunction (event) {
                event.prevent('c');
                _chai.expect(event.isPrevented('c')).not.to.be.true;
                subscriptionsExecuted.push('a');
            },
            once: true
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'a',
            'b',
            'c',
            'd'
        ]);

        subscriptionsExecuted = [];

        pubsub.subscribe('a', 'testEvent', {
            callbackFunction (event) {
                event.prevent('d');
                _chai.expect(event.isPrevented('d')).to.be.true;
                subscriptionsExecuted.push('a');
            },
            once: true
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'a',
            'b',
            'c'
        ]);
    });

    _mocha.it('should pass configured event data to subscribers', () => {
        const data = {
                a: 'a',
                b: 'b',
                c: 'c'
            },
            pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            data
        });

        pubsub.on('testEvent', event => {
            _chai.expect(event).to.have.property('data', data);

            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'on'
        ]);
    });

    _mocha.it('should merge configured event data with published event data', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            data: {
                a: 'a',
                b: 'b',
                c: 'c'
            }
        });

        pubsub.on('testEvent', event => {
            _chai.expect(event.data).to.deep.equal({
                a: 'xyz',
                b: 'b',
                c: 'c',
                x: 'x',
                y: 'y',
                z: 'z'
            });

            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent', {
            a: 'xyz',
            x: 'x',
            y: 'y',
            z: 'z'
        });

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'on'
        ]);
    });

    _mocha.it('should accept dispatcher definitions as a config object', () => {
        const pubsub = _Pubsub({
                pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        publishOnce: true
                    }
                }
            }),
            subscriptionsExecuted = [];

        pubsub.on('testEvent', () => {
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'on'
        ]);

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'on'
        ]);
    });

    _mocha.it('should accept a Dispatcher instance when defining a dispatcher', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineDispatcher('testEvent', _pubsub.Dispatcher({
            allowPublicPublish: true,
            name: 'testEvent',
            publishOnce: true
        }));

        pubsub.on('testEvent', () => {
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'on'
        ]);

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'on'
        ]);
    });

    _mocha.it('should accept a custom dispatcher when defining a dispatcher', () => {
        const methodsExecuted = [],
            pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineDispatcher('testEvent', {
            newState () {
                methodsExecuted.push('newState');
                return {
                    subscriptions: {}
                };
            },
            publish () {
                methodsExecuted.push('publish');
            },
            subscribe () {
                methodsExecuted.push('subscribe');
                return _pubsub.Subscription();
            }
        });

        _chai.expect(methodsExecuted).to.deep.equal([]);

        pubsub.on('testEvent', () => {
            subscriptionsExecuted.push('on');
        });

        _chai.expect(methodsExecuted).to.deep.equal([
            'newState',
            'subscribe'
        ]);

        pubsub.publish('testEvent');

        _chai.expect(methodsExecuted).to.deep.equal([
            'newState',
            'subscribe',
            'publish'
        ]);

        _chai.expect(subscriptionsExecuted).to.deep.equal([]);

        pubsub.publish('testEvent');

        _chai.expect(methodsExecuted).to.deep.equal([
            'newState',
            'subscribe',
            'publish',
            'publish'
        ]);

        _chai.expect(subscriptionsExecuted).to.deep.equal([]);
    });

    _mocha.it('should allow static dispatcher definitions', () => {
        const pubsub0 = _Pubsub(),
            pubsub1 = _Pubsub();

        let subscriptionsExecuted = [];

        pubsub0.defineDispatcher('testEvent0', {
            allowPublicPublish: true,
            publishOnce: true
        });

        pubsub1.defineDispatcher('testEvent1', {
            allowPublicPublish: true,
            publishOnce: true
        });

        _Pubsub.defineDispatcher('testEvent2', {
            allowPublicPublish: true,
            publishOnce: true
        });

        pubsub0.on('testEvent0', () => {
            subscriptionsExecuted.push('on 00');
        });

        pubsub0.on('testEvent1', () => {
            subscriptionsExecuted.push('on 01');
        });

        pubsub0.on('testEvent2', () => {
            subscriptionsExecuted.push('on 02');
        });

        pubsub1.on('testEvent0', () => {
            subscriptionsExecuted.push('on 10');
        });

        pubsub1.on('testEvent1', () => {
            subscriptionsExecuted.push('on 11');
        });

        pubsub1.on('testEvent2', () => {
            subscriptionsExecuted.push('on 12');
        });

        pubsub0.publish('testEvent0');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'on 00'
        ]);

        subscriptionsExecuted = [];

        pubsub1.publish('testEvent0');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'on 10'
        ]);

        subscriptionsExecuted = [];

        pubsub0.publish('testEvent1');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'on 01'
        ]);

        subscriptionsExecuted = [];

        pubsub1.publish('testEvent1');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'on 11'
        ]);

        subscriptionsExecuted = [];

        pubsub0.publish('testEvent2');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'on 02'
        ]);

        subscriptionsExecuted = [];

        pubsub1.publish('testEvent2');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'on 12'
        ]);

        subscriptionsExecuted = [];

        pubsub0.publish('testEvent0');

        _chai.expect(subscriptionsExecuted).to.deep.equal([]);

        subscriptionsExecuted = [];

        pubsub1.publish('testEvent0');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'on 10'
        ]);

        subscriptionsExecuted = [];

        pubsub0.publish('testEvent1');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'on 01'
        ]);

        subscriptionsExecuted = [];

        pubsub1.publish('testEvent1');

        _chai.expect(subscriptionsExecuted).to.deep.equal([]);

        subscriptionsExecuted = [];

        pubsub0.publish('testEvent2');

        _chai.expect(subscriptionsExecuted).to.deep.equal([]);

        subscriptionsExecuted = [];

        pubsub1.publish('testEvent2');

        _chai.expect(subscriptionsExecuted).to.deep.equal([]);
    });

    _mocha.it('should allow new subscriptions while the event is in progress', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        pubsub.before('testEvent', () => {
            pubsub.on('testEvent', () => {
                pubsub.after('testEvent', () => {
                    subscriptionsExecuted.push('after');
                });

                subscriptionsExecuted.push('on');
            });

            subscriptionsExecuted.push('before');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    _mocha.it('should immediately execute late subscribers to once events if the event was not prevented', () => {
        const data = {
                a: 'a',
                b: 'b',
                c: 'c'
            },
            pubsub = _Pubsub();

        let subscriptionsExecuted = [];

        pubsub.defineDispatcher([
            'testEvent0',
            'testEvent1'
        ], {
            allowPublicPublish: true,
            publishOnce: true
        });

        pubsub.publish('testEvent0', data);

        _chai.expect(subscriptionsExecuted).to.deep.equal([]);

        pubsub.on('testEvent0', event => {
            _chai.expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('on');
        });

        pubsub.before('testEvent0', event => {
            _chai.expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('before');
        });

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'on',
            'before'
        ]);

        subscriptionsExecuted = [];

        pubsub.onceBefore('testEvent1', event => {
            event.prevent('on');
        });

        pubsub.publish('testEvent1', data);

        pubsub.on('testEvent1', event => {
            _chai.expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('on');
        });

        pubsub.before('testEvent1', event => {
            _chai.expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('before');
        });

        pubsub.after('testEvent1', event => {
            _chai.expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('after');
        });

        _chai.expect(subscriptionsExecuted).to.deep.equal([]);

        pubsub.defineDispatcher([
            'testEvent2',
            'testEvent3'
        ], {
            allowPublicPublish: true,
            completeOnce: true
        });

        pubsub.publish('testEvent2', data);

        _chai.expect(subscriptionsExecuted).to.deep.equal([]);

        pubsub.on('testEvent2', event => {
            _chai.expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('on');
        });

        pubsub.before('testEvent2', event => {
            _chai.expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('before');
        });

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'on',
            'before'
        ]);

        subscriptionsExecuted = [];

        pubsub.onceBefore('testEvent3', event => {
            event.prevent('on');
        });

        pubsub.publish('testEvent3', data);

        pubsub.on('testEvent3', event => {
            _chai.expect(event).to.have.property('data', data);
            event.prevent('after');
            subscriptionsExecuted.push('on');
        });

        pubsub.before('testEvent3', event => {
            _chai.expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('before');
        });

        pubsub.after('testEvent3', event => {
            _chai.expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('after');
        });

        _chai.expect(subscriptionsExecuted).to.deep.equal([]);

        pubsub.publish('testEvent3', data);

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on'
        ]);

        subscriptionsExecuted = [];

        pubsub.on('testEvent3', event => {
            _chai.expect(event).to.have.property('data', data);
            event.prevent('after');
            subscriptionsExecuted.push('on');
        });

        pubsub.before('testEvent3', event => {
            _chai.expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('before');
        });

        pubsub.after('testEvent3', event => {
            _chai.expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('after');
        });

        _chai.expect(subscriptionsExecuted).to.deep.equal([]);
    });

    // TODO: test late subscribers to once events when dispatch, distribution, and event is stopped

    _mocha.it('should chain static dispatcher configurations', () => {
        const PubsubA = _make(_Pubsub, {
                _init (...args) {
                    return Reflect.apply(_Pubsub.prototype._init, this, args);
                }
            }, {
                _pubsub: {
                    testEventA: {
                        allowPublicPublish: true,
                        data: {
                            a: 'a'
                        }
                    }
                }
            }),
            PubsubB = _make(PubsubA, {
                _init (...args) {
                    return Reflect.apply(PubsubA.prototype._init, this, args);
                }
            }, {
                _pubsub: {
                    testEventB: {
                        allowPublicPublish: true,
                        data: {
                            b: 'b'
                        }
                    }
                }
            }),
            PubsubC = _make(PubsubB, {
                _init (...args) {
                    return Reflect.apply(PubsubB.prototype._init, this, args);
                }
            }, {
                _pubsub: {
                    testEventA: {
                        allowPublicPublish: true,
                        data: {
                            c: 'c'
                        }
                    },
                    testEventC: {
                        allowPublicPublish: true,
                        data: {
                            c: 'c'
                        }
                    }
                }
            }),

            pubsub = PubsubC(),
            subscriptionsExecuted = [];

        pubsub.on('testEventA', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                c: 'c'
            });
            subscriptionsExecuted.push('a');
        });

        pubsub.on('testEventB', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                b: 'b'
            });
            subscriptionsExecuted.push('b');
        });

        pubsub.on('testEventC', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                c: 'c'
            });
            subscriptionsExecuted.push('c');
        });

        pubsub
            .publish('testEventA')
            .publish('testEventB')
            .publish('testEventC');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'a',
            'b',
            'c'
        ]);
    });

    _mocha.it('should chain static dispatcher configurations including mixins', () => {
        let destroyed = false;

        const MixinX = _make(_Pubsub, {
                _differentDestroyComplete ({
                    data: {
                        args
                    }
                }) {
                    destroyed = true;
                    this._destroyComplete(...args);
                },
                _init (...args) {
                    return Reflect.apply(_Pubsub.prototype._init, this, args);
                }
            }, {
                _pubsub: {
                    destroyComplete: {
                        defaultFunction: '_differentDestroyComplete',
                        publishOnce: true
                    },
                    testEventX: {
                        allowPublicPublish: true,
                        data: {
                            x: 'x'
                        }
                    }
                }
            }),
            MixinY = _make(_Pubsub, {
                _init (...args) {
                    return Reflect.apply(_Pubsub.prototype._init, this, args);
                }
            }, {
                _pubsub: {
                    testEventB: {
                        allowPublicPublish: true,
                        data: {
                            y: 'y'
                        }
                    },
                    testEventY: {
                        allowPublicPublish: true,
                        data: {
                            y: 'y'
                        }
                    }
                }
            }),
            MixinZ = _make(_Pubsub, {
                _init (...args) {
                    return Reflect.apply(_Pubsub.prototype._init, this, args);
                }
            }, {
                _pubsub: {
                    testEventY: {
                        allowPublicPublish: true,
                        data: {
                            z: 'z'
                        }
                    },
                    testEventZ: {
                        allowPublicPublish: true,
                        data: {
                            z: 'z'
                        }
                    }
                }
            }),
            PubsubA = _make(_Pubsub, {
                _init (...args) {
                    return Reflect.apply(_Pubsub.prototype._init, this, args);
                }
            }, {
                _pubsub: {
                    testEventA: {
                        allowPublicPublish: true,
                        data: {
                            a: 'a'
                        }
                    }
                }
            }),
            PubsubB = _make(PubsubA, {
                _init (...args) {
                    return Reflect.apply(PubsubA.prototype._init, this, args);
                }
            }, {
                _pubsub: {
                    testEventB: {
                        allowPublicPublish: true,
                        data: {
                            b: 'b'
                        }
                    }
                }
            }),
            PubsubC = _make(PubsubB, [
                MixinX,
                MixinY,
                MixinZ
            ], {
                _init (...args) {
                    return Reflect.apply(PubsubB.prototype._init, this, args);
                }
            }, {
                _pubsub: {
                    testEventA: {
                        allowPublicPublish: true,
                        data: {
                            c: 'c'
                        }
                    },
                    testEventC: {
                        allowPublicPublish: true,
                        data: {
                            c: 'c'
                        }
                    },
                    testEventX: {
                        allowPublicPublish: true,
                        data: {
                            c: 'c'
                        }
                    }
                }
            }),

            pubsub = PubsubC(),
            subscriptionsExecuted = [];

        pubsub.on('testEventA', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                c: 'c'
            });
            subscriptionsExecuted.push('a');
        });

        pubsub.on('testEventB', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                y: 'y'
            });
            subscriptionsExecuted.push('b');
        });

        pubsub.on('testEventC', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                c: 'c'
            });
            subscriptionsExecuted.push('c');
        });

        pubsub.on('testEventX', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                c: 'c'
            });
            subscriptionsExecuted.push('x');
        });

        pubsub.on('testEventY', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                z: 'z'
            });
            subscriptionsExecuted.push('y');
        });

        pubsub.on('testEventZ', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                z: 'z'
            });
            subscriptionsExecuted.push('z');
        });

        pubsub
            .publish('testEventA')
            .publish('testEventB')
            .publish('testEventC')
            .publish('testEventX')
            .publish('testEventY')
            .publish('testEventZ');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'a',
            'b',
            'c',
            'x',
            'y',
            'z'
        ]);

        _chai.expect(destroyed).to.be.false;

        pubsub.destroy();

        _chai.expect(destroyed).to.be.true;
    });

    _mocha.it('should chain static dispatcher configurations even when an intermediate has no static dispatcher configuration', () => {
        const PubsubA = _make(_Pubsub, {
                _init (...args) {
                    return Reflect.apply(_Pubsub.prototype._init, this, args);
                }
            }, {
                _pubsub: {
                    testEventA: {
                        allowPublicPublish: true,
                        data: {
                            a: 'a'
                        }
                    }
                }
            }),
            PubsubB = _make(PubsubA, {
                _init (...args) {
                    return Reflect.apply(PubsubA.prototype._init, this, args);
                }
            }),
            PubsubC = _make(PubsubB, {
                _init (...args) {
                    return Reflect.apply(PubsubB.prototype._init, this, args);
                }
            }, {
                _pubsub: {
                    testEventA: {
                        allowPublicPublish: true,
                        data: {
                            c: 'c'
                        }
                    },
                    testEventC: {
                        allowPublicPublish: true,
                        data: {
                            c: 'c'
                        }
                    }
                }
            }),

            pubsub = PubsubC(),
            subscriptionsExecuted = [];

        pubsub.on('testEventA', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                c: 'c'
            });
            subscriptionsExecuted.push('a');
        });

        pubsub.on('testEventC', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                c: 'c'
            });
            subscriptionsExecuted.push('c');
        });

        pubsub
            .publish('testEventA')
            .publish('testEventC');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'a',
            'c'
        ]);
    });

    _mocha.it('should not affect a parent\'s dispatcher definitions', () => {
        const PubsubA = _make(_Pubsub, {
                _init (...args) {
                    return Reflect.apply(_Pubsub.prototype._init, this, args);
                }
            }, {
                _pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        data: {
                            testProperty: 'a'
                        }
                    }
                }
            }),
            PubsubB = _make(PubsubA, {
                _init (...args) {
                    return Reflect.apply(PubsubA.prototype._init, this, args);
                }
            }),

            pubsubA = PubsubA(),
            pubsubB = PubsubB(),
            subscriptionsExecuted = [];

        PubsubB.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            data: {
                testProperty: 'b'
            }
        });

        pubsubA.on('testEvent', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                testProperty: 'a'
            });
            subscriptionsExecuted.push('a');
        });

        pubsubB.on('testEvent', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                testProperty: 'b'
            });
            subscriptionsExecuted.push('b');
        });

        pubsubA.publish('testEvent');
        pubsubB.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'a',
            'b'
        ]);
    });

    _mocha.it('should work as a mixin', () => {
        const subscriptionsExecuted = [],

            PubsubA = _make([
                _Pubsub
            ], {
                _init (...args) {
                    return Reflect.apply(_Pubsub.prototype._init, this, args);
                }
            }, {
                _init (...args) {
                    return Reflect.apply(_Pubsub._init, this, args);
                },
                _pubsub: {
                    testEventA: {
                        allowPublicPublish: true,
                        data: {
                            a: 'a'
                        }
                    }
                }
            }),
            PubsubB = _make(PubsubA, {
                _init (...args) {
                    return Reflect.apply(PubsubA.prototype._init, this, args);
                }
            }, {
                _pubsub: {
                    testEventB: {
                        allowPublicPublish: true,
                        data: {
                            b: 'b'
                        }
                    }
                }
            }),
            PubsubC = _make(PubsubB, {
                _destroy (string) {
                    subscriptionsExecuted.push(string);
                },
                _init (...args) {
                    return Reflect.apply(PubsubB.prototype._init, this, args);
                }
            }, {
                _pubsub: {
                    testEventA: {
                        allowPublicPublish: true,
                        data: {
                            c: 'c'
                        }
                    },
                    testEventC: {
                        allowPublicPublish: true,
                        data: {
                            c: 'c'
                        }
                    }
                }
            }),

            pubsub = PubsubC();

        pubsub.on('testEventA', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                c: 'c'
            });
            subscriptionsExecuted.push('a');
        });

        pubsub.on('testEventB', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                b: 'b'
            });
            subscriptionsExecuted.push('b');
        });

        pubsub.on('testEventC', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                c: 'c'
            });
            subscriptionsExecuted.push('c');
        });

        pubsub.on('testEventD', () => {
            subscriptionsExecuted.push('d');
        });

        pubsub
            .publish('testEventA')
            .publish('testEventB')
            .publish('testEventC')
            .publish('testEventD')
            .destroy('e');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'a',
            'b',
            'c',
            'd',
            'e'
        ]);
    });

    _mocha.it('should work as a mixin\'s mixin', () => {
        const subscriptionsExecuted = [],

            PubsubA = _make([
                _Pubsub
            ], {
                _init (...args) {
                    return Reflect.apply(_Pubsub.prototype._init, this, args);
                }
            }, {
                _init (...args) {
                    return Reflect.apply(_Pubsub._init, this, args);
                },
                _pubsub: {
                    testEventA: {
                        allowPublicPublish: true,
                        data: {
                            a: 'a'
                        }
                    }
                }
            }),
            PubsubB = _make([
                PubsubA
            ], {
                _init (...args) {
                    return Reflect.apply(PubsubA.prototype._init, this, args);
                }
            }, {
                _pubsub: {
                    testEventB: {
                        allowPublicPublish: true,
                        data: {
                            b: 'b'
                        }
                    }
                }
            }),
            PubsubC = _make([
                PubsubB
            ], {
                _destroy (string) {
                    subscriptionsExecuted.push(string);
                },
                _init (...args) {
                    return Reflect.apply(PubsubB.prototype._init, this, args);
                }
            }, {
                _pubsub: {
                    testEventA: {
                        allowPublicPublish: true,
                        data: {
                            c: 'c'
                        }
                    },
                    testEventC: {
                        allowPublicPublish: true,
                        data: {
                            c: 'c'
                        }
                    }
                }
            }),

            pubsub = PubsubC();

        pubsub.on('testEventA', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                c: 'c'
            });
            subscriptionsExecuted.push('a');
        });

        pubsub.on('testEventB', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                b: 'b'
            });
            subscriptionsExecuted.push('b');
        });

        pubsub.on('testEventC', event => {
            _chai.expect(event).to.have.property('data').that.deep.equals({
                c: 'c'
            });
            subscriptionsExecuted.push('c');
        });

        pubsub.on('testEventD', () => {
            subscriptionsExecuted.push('d');
        });

        pubsub
            .publish('testEventA')
            .publish('testEventB')
            .publish('testEventC')
            .publish('testEventD')
            .destroy('e');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'a',
            'b',
            'c',
            'd',
            'e'
        ]);
    });

    _mocha.it('should allow a method name as a late bound subscription callback function', () => {
        const subscriptionsExecuted = [],

            customMethodSymbol = Symbol('customMethodSymbol'),
            CustomPubsub = _make(_Pubsub, {
                [customMethodSymbol] () {
                    subscriptionsExecuted.push('on');
                },
                _beforeTestEvent () {
                    subscriptionsExecuted.push('before');
                },
                _init (...args) {
                    return Reflect.apply(_Pubsub.prototype._init, this, args);
                }
            }),
            customPubsub = CustomPubsub();

        customPubsub.before('testEvent', '_beforeTestEvent');
        customPubsub.on('testEvent', customMethodSymbol);

        customPubsub.publish('testEvent');

        customPubsub._beforeTestEvent = function () {
            _chai.expect(this).to.equal(customPubsub);
            subscriptionsExecuted.push('different before');
        };

        customPubsub[customMethodSymbol] = function () {
            _chai.expect(this).to.equal(customPubsub);
            subscriptionsExecuted.push('different on');
        };

        customPubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'different before',
            'different on'
        ]);
    });

    _mocha.it('should allow a method name as late bound subscription callback function with a custom host', () => {
        const customMethodSymbol = Symbol('customMethodSymbol'),
            pubsub = _Pubsub(),
            subscriptionsExecuted = [],

            customHost = {
                [customMethodSymbol] () {
                    subscriptionsExecuted.push('on');
                },
                _beforeTestEvent () {
                    subscriptionsExecuted.push('before');
                }
            };

        pubsub.before('testEvent', {
            callbackFunction: '_beforeTestEvent',
            host: customHost
        });
        pubsub.on('testEvent', {
            callbackFunction: customMethodSymbol,
            host: customHost
        });

        pubsub.publish('testEvent');

        customHost._beforeTestEvent = function () {
            _chai.expect(this).to.equal(customHost);
            subscriptionsExecuted.push('different before');
        };

        customHost[customMethodSymbol] = function () {
            _chai.expect(this).to.equal(customHost);
            subscriptionsExecuted.push('different on');
        };

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'different before',
            'different on'
        ]);
    });

    _mocha.it('should allow a method name as a late bound once subscription callback function', () => {
        const subscriptionsExecuted = [],

            customMethodSymbol = Symbol('customMethodSymbol'),
            CustomPubsub = _make(_Pubsub, {
                [customMethodSymbol] () {
                    subscriptionsExecuted.push('on');
                },
                _beforeTestEvent () {
                    subscriptionsExecuted.push('before');
                },
                _init (...args) {
                    return Reflect.apply(_Pubsub.prototype._init, this, args);
                }
            }),
            customPubsub = CustomPubsub();

        customPubsub.onceBefore('testEvent', '_beforeTestEvent');
        customPubsub.onceOn('testEvent', customMethodSymbol);

        customPubsub.publish('testEvent');

        customPubsub.onceBefore('testEvent', '_beforeTestEvent');
        customPubsub.onceOn('testEvent', customMethodSymbol);

        customPubsub._beforeTestEvent = function () {
            _chai.expect(this).to.equal(customPubsub);
            subscriptionsExecuted.push('different before');
        };

        customPubsub[customMethodSymbol] = function () {
            _chai.expect(this).to.equal(customPubsub);
            subscriptionsExecuted.push('different on');
        };

        customPubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'different before',
            'different on'
        ]);
    });

    _mocha.it('should allow a method name as a late bound once subscription callback function with a custom host', () => {
        const customMethodSymbol = Symbol('customMethodSymbol'),
            pubsub = _Pubsub(),
            subscriptionsExecuted = [],

            customHost = {
                [customMethodSymbol] () {
                    subscriptionsExecuted.push('on');
                },
                _beforeTestEvent () {
                    subscriptionsExecuted.push('before');
                }
            };

        pubsub.onceBefore('testEvent', {
            callbackFunction: '_beforeTestEvent',
            host: customHost
        });
        pubsub.onceOn('testEvent', {
            callbackFunction: customMethodSymbol,
            host: customHost
        });

        pubsub.publish('testEvent');

        pubsub.onceBefore('testEvent', {
            callbackFunction: '_beforeTestEvent',
            host: customHost
        });
        pubsub.onceOn('testEvent', {
            callbackFunction: customMethodSymbol,
            host: customHost
        });

        customHost._beforeTestEvent = function () {
            _chai.expect(this).to.equal(customHost);
            subscriptionsExecuted.push('different before');
        };

        customHost[customMethodSymbol] = function () {
            _chai.expect(this).to.equal(customHost);
            subscriptionsExecuted.push('different on');
        };

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'different before',
            'different on'
        ]);
    });

    _mocha.it('should not error if late bound subscription callback functions are invalid', () => {
        const pubsub = _Pubsub();

        pubsub.subscribe('on', 'testEvent', 'someMethodThatDoesNotExist');
        pubsub.subscribe('on', 'testEvent', {
            callbackFunction: {
                thisIsAnObject: 'notAFunction'
            }
        });
        pubsub.subscribe('on', 'testEvent', {
            callbackFunction: 'someMethodThatDoesNotExist',
            once: true
        });
        pubsub.subscribe('on', 'testEvent', {
            callbackFunction: {
                thisIsAnObject: 'notAFunction'
            },
            once: true
        });

        pubsub.publish('testEvent');
    });

    _mocha.it('should execute the default lifecycle function during the default stage', () => {
        const executedSubscribers = [],
            pubsub = _Pubsub();

        let calledDefaultFunction,
            eventObject;

        pubsub.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            defaultFunction (event) {
                _chai.expect(event).to.equal(eventObject);
                calledDefaultFunction = true;
            }
        });

        pubsub.after('testEvent', event => {
            _chai.expect(calledDefaultFunction).to.be.true;
            _chai.expect(event).to.equal(eventObject);
            executedSubscribers.push('after');
        });

        pubsub.before('testEvent', event => {
            _chai.expect(calledDefaultFunction).to.be.undefined;
            eventObject = event;
            executedSubscribers.push('before');
        });

        pubsub.on('testEvent', event => {
            _chai.expect(calledDefaultFunction).to.be.undefined;
            _chai.expect(event).to.equal(eventObject);
            executedSubscribers.push('on');
        });

        pubsub.publish('testEvent');

        _chai.expect(executedSubscribers).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    _mocha.it('should allow a method name as a late bound default lifecycle function', () => {
        let calledDefaultFunction,
            eventObject;

        const CustomPubsub = _make(_Pubsub, {
                _eventTestEvent (event) {
                    _chai.expect(event).to.equal(eventObject);
                    calledDefaultFunction = true;
                }
            }, {
                _pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        defaultFunction: '_eventTestEvent'
                    }
                }
            }),
            customPubsub = CustomPubsub(),
            executedSubscribers = [];

        customPubsub.after('testEvent', event => {
            _chai.expect(calledDefaultFunction).to.be.true;
            _chai.expect(event).to.equal(eventObject);
            executedSubscribers.push('after');
        });

        customPubsub.before('testEvent', event => {
            _chai.expect(calledDefaultFunction).to.be.undefined;
            eventObject = event;
            executedSubscribers.push('before');
        });

        customPubsub.on('testEvent', event => {
            _chai.expect(calledDefaultFunction).to.be.undefined;
            _chai.expect(event).to.equal(eventObject);
            executedSubscribers.push('on');
        });

        customPubsub.publish('testEvent');

        _chai.expect(executedSubscribers).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    _mocha.it('should allow a method name as a late bound default lifecycle function with a custom lifecycle host', () => {
        let calledDefaultFunction,
            eventObject;

        const customLifecycleHost = {
                _eventTestEvent (event) {
                    _chai.expect(event).to.equal(eventObject);
                    calledDefaultFunction = true;
                }
            },
            CustomPubsub = _make(_Pubsub, {}, {
                _pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        defaultFunction: '_eventTestEvent',
                        lifecycleHost: customLifecycleHost
                    }
                }
            }),
            customPubsub = CustomPubsub(),
            executedSubscribers = [];

        customPubsub.after('testEvent', event => {
            _chai.expect(calledDefaultFunction).to.be.true;
            _chai.expect(event).to.equal(eventObject);
            executedSubscribers.push('after');
        });

        customPubsub.before('testEvent', event => {
            _chai.expect(calledDefaultFunction).to.be.undefined;
            eventObject = event;
            executedSubscribers.push('before');
        });

        customPubsub.on('testEvent', event => {
            _chai.expect(calledDefaultFunction).to.be.undefined;
            _chai.expect(event).to.equal(eventObject);
            executedSubscribers.push('on');
        });

        customPubsub.publish('testEvent');

        _chai.expect(executedSubscribers).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    _mocha.it('should execute the dispatch stopped lifecycle function when dispatch is stopped', () => {
        const distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = _Pubsub(),
            subscriptionsExecuted = [];

        let calledDispatchStoppedFunction,
            eventObject;

        publisher.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            dispatchStoppedFunction (event) {
                _chai.expect(event).to.equal(eventObject);
                calledDispatchStoppedFunction = true;
            }
        });

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                if (eventObject) {
                    _chai.expect(event).to.equal(eventObject);
                } else {
                    eventObject = event;
                }

                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                event.stopDispatch();
                _chai.expect(event.dispatchStopped).to.be.true;

                if (pubsub === publisher) {
                    _chai.expect(calledDispatchStoppedFunction).to.be.undefined;
                } else {
                    _chai.expect(calledDispatchStoppedFunction).to.be.true;
                }

                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'distributor0 before 0',
            'distributor1 before 0',
            'distributor2 before 0',
            'distributor0a before 0',
            'distributor0b before 0',
            'distributor1a before 0',
            'distributor1b before 0',
            'distributor2a before 0',
            'distributor2b before 0',
            'publisher on 0',
            'publisher on 1',
            'publisher on 2',
            'distributor0 on 0',
            'distributor0 on 1',
            'distributor0 on 2',
            'distributor1 on 0',
            'distributor1 on 1',
            'distributor1 on 2',
            'distributor2 on 0',
            'distributor2 on 1',
            'distributor2 on 2',
            'distributor0a on 0',
            'distributor0a on 1',
            'distributor0a on 2',
            'distributor0b on 0',
            'distributor0b on 1',
            'distributor0b on 2',
            'distributor1a on 0',
            'distributor1a on 1',
            'distributor1a on 2',
            'distributor1b on 0',
            'distributor1b on 1',
            'distributor1b on 2',
            'distributor2a on 0',
            'distributor2a on 1',
            'distributor2a on 2',
            'distributor2b on 0',
            'distributor2b on 1',
            'distributor2b on 2',
            'publisher after 0',
            'publisher after 1',
            'publisher after 2',
            'distributor0 after 0',
            'distributor0 after 1',
            'distributor0 after 2',
            'distributor1 after 0',
            'distributor1 after 1',
            'distributor1 after 2',
            'distributor2 after 0',
            'distributor2 after 1',
            'distributor2 after 2',
            'distributor0a after 0',
            'distributor0a after 1',
            'distributor0a after 2',
            'distributor0b after 0',
            'distributor0b after 1',
            'distributor0b after 2',
            'distributor1a after 0',
            'distributor1a after 1',
            'distributor1a after 2',
            'distributor1b after 0',
            'distributor1b after 1',
            'distributor1b after 2',
            'distributor2a after 0',
            'distributor2a after 1',
            'distributor2a after 2',
            'distributor2b after 0',
            'distributor2b after 1',
            'distributor2b after 2'
        ]);
    });

    _mocha.it('should allow a method name as a late bound dispatch stopped lifecycle function', () => {
        let calledDispatchStoppedFunction,
            eventObject;

        const CustomPubsub = _make(_Pubsub, {
                _dispatchStoppedTestEvent (event) {
                    _chai.expect(event).to.equal(eventObject);
                    calledDispatchStoppedFunction = true;
                }
            }, {
                _pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        dispatchStoppedFunction: '_dispatchStoppedTestEvent'
                    }
                }
            }),
            distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = CustomPubsub(),
            subscriptionsExecuted = [];

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                if (eventObject) {
                    _chai.expect(event).to.equal(eventObject);
                } else {
                    eventObject = event;
                }

                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                event.stopDispatch();
                _chai.expect(event.dispatchStopped).to.be.true;

                if (pubsub === publisher) {
                    _chai.expect(calledDispatchStoppedFunction).to.be.undefined;
                } else {
                    _chai.expect(calledDispatchStoppedFunction).to.be.true;
                }

                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'distributor0 before 0',
            'distributor1 before 0',
            'distributor2 before 0',
            'distributor0a before 0',
            'distributor0b before 0',
            'distributor1a before 0',
            'distributor1b before 0',
            'distributor2a before 0',
            'distributor2b before 0',
            'publisher on 0',
            'publisher on 1',
            'publisher on 2',
            'distributor0 on 0',
            'distributor0 on 1',
            'distributor0 on 2',
            'distributor1 on 0',
            'distributor1 on 1',
            'distributor1 on 2',
            'distributor2 on 0',
            'distributor2 on 1',
            'distributor2 on 2',
            'distributor0a on 0',
            'distributor0a on 1',
            'distributor0a on 2',
            'distributor0b on 0',
            'distributor0b on 1',
            'distributor0b on 2',
            'distributor1a on 0',
            'distributor1a on 1',
            'distributor1a on 2',
            'distributor1b on 0',
            'distributor1b on 1',
            'distributor1b on 2',
            'distributor2a on 0',
            'distributor2a on 1',
            'distributor2a on 2',
            'distributor2b on 0',
            'distributor2b on 1',
            'distributor2b on 2',
            'publisher after 0',
            'publisher after 1',
            'publisher after 2',
            'distributor0 after 0',
            'distributor0 after 1',
            'distributor0 after 2',
            'distributor1 after 0',
            'distributor1 after 1',
            'distributor1 after 2',
            'distributor2 after 0',
            'distributor2 after 1',
            'distributor2 after 2',
            'distributor0a after 0',
            'distributor0a after 1',
            'distributor0a after 2',
            'distributor0b after 0',
            'distributor0b after 1',
            'distributor0b after 2',
            'distributor1a after 0',
            'distributor1a after 1',
            'distributor1a after 2',
            'distributor1b after 0',
            'distributor1b after 1',
            'distributor1b after 2',
            'distributor2a after 0',
            'distributor2a after 1',
            'distributor2a after 2',
            'distributor2b after 0',
            'distributor2b after 1',
            'distributor2b after 2'
        ]);
    });

    _mocha.it('should allow a method name as a late bound dispatch stopped lifecycle function with a custom lifecycle host', () => {
        let calledDispatchStoppedFunction,
            eventObject;

        const customLifecycleHost = {
                _dispatchStoppedTestEvent (event) {
                    _chai.expect(event).to.equal(eventObject);
                    calledDispatchStoppedFunction = true;
                }
            },
            CustomPubsub = _make(_Pubsub, {}, {
                _pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        dispatchStoppedFunction: '_dispatchStoppedTestEvent',
                        lifecycleHost: customLifecycleHost
                    }
                }
            }),
            distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = CustomPubsub(),
            subscriptionsExecuted = [];

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                if (eventObject) {
                    _chai.expect(event).to.equal(eventObject);
                } else {
                    eventObject = event;
                }

                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                event.stopDispatch();
                _chai.expect(event.dispatchStopped).to.be.true;

                if (pubsub === publisher) {
                    _chai.expect(calledDispatchStoppedFunction).to.be.undefined;
                } else {
                    _chai.expect(calledDispatchStoppedFunction).to.be.true;
                }

                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'distributor0 before 0',
            'distributor1 before 0',
            'distributor2 before 0',
            'distributor0a before 0',
            'distributor0b before 0',
            'distributor1a before 0',
            'distributor1b before 0',
            'distributor2a before 0',
            'distributor2b before 0',
            'publisher on 0',
            'publisher on 1',
            'publisher on 2',
            'distributor0 on 0',
            'distributor0 on 1',
            'distributor0 on 2',
            'distributor1 on 0',
            'distributor1 on 1',
            'distributor1 on 2',
            'distributor2 on 0',
            'distributor2 on 1',
            'distributor2 on 2',
            'distributor0a on 0',
            'distributor0a on 1',
            'distributor0a on 2',
            'distributor0b on 0',
            'distributor0b on 1',
            'distributor0b on 2',
            'distributor1a on 0',
            'distributor1a on 1',
            'distributor1a on 2',
            'distributor1b on 0',
            'distributor1b on 1',
            'distributor1b on 2',
            'distributor2a on 0',
            'distributor2a on 1',
            'distributor2a on 2',
            'distributor2b on 0',
            'distributor2b on 1',
            'distributor2b on 2',
            'publisher after 0',
            'publisher after 1',
            'publisher after 2',
            'distributor0 after 0',
            'distributor0 after 1',
            'distributor0 after 2',
            'distributor1 after 0',
            'distributor1 after 1',
            'distributor1 after 2',
            'distributor2 after 0',
            'distributor2 after 1',
            'distributor2 after 2',
            'distributor0a after 0',
            'distributor0a after 1',
            'distributor0a after 2',
            'distributor0b after 0',
            'distributor0b after 1',
            'distributor0b after 2',
            'distributor1a after 0',
            'distributor1a after 1',
            'distributor1a after 2',
            'distributor1b after 0',
            'distributor1b after 1',
            'distributor1b after 2',
            'distributor2a after 0',
            'distributor2a after 1',
            'distributor2a after 2',
            'distributor2b after 0',
            'distributor2b after 1',
            'distributor2b after 2'
        ]);
    });

    _mocha.it('should execute the distribution stopped lifecycle function when distribution is stopped', () => {
        const distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = _Pubsub(),
            subscriptionsExecuted = [];

        let calledDistributionStoppedFunction,
            eventObject;

        publisher.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            distributionStoppedFunction (event) {
                _chai.expect(event).to.equal(eventObject);
                calledDistributionStoppedFunction = true;
            }
        });

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                if (eventObject) {
                    _chai.expect(event).to.equal(eventObject);
                } else {
                    eventObject = event;
                }

                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                event.stopDistribution();
                _chai.expect(event.distributionStopped).to.be.true;
                _chai.expect(calledDistributionStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'publisher before 1',
            'publisher before 2',
            'publisher on 0',
            'publisher on 1',
            'publisher on 2',
            'distributor0 on 0',
            'distributor0 on 1',
            'distributor0 on 2',
            'distributor1 on 0',
            'distributor1 on 1',
            'distributor1 on 2',
            'distributor2 on 0',
            'distributor2 on 1',
            'distributor2 on 2',
            'distributor0a on 0',
            'distributor0a on 1',
            'distributor0a on 2',
            'distributor0b on 0',
            'distributor0b on 1',
            'distributor0b on 2',
            'distributor1a on 0',
            'distributor1a on 1',
            'distributor1a on 2',
            'distributor1b on 0',
            'distributor1b on 1',
            'distributor1b on 2',
            'distributor2a on 0',
            'distributor2a on 1',
            'distributor2a on 2',
            'distributor2b on 0',
            'distributor2b on 1',
            'distributor2b on 2',
            'publisher after 0',
            'publisher after 1',
            'publisher after 2',
            'distributor0 after 0',
            'distributor0 after 1',
            'distributor0 after 2',
            'distributor1 after 0',
            'distributor1 after 1',
            'distributor1 after 2',
            'distributor2 after 0',
            'distributor2 after 1',
            'distributor2 after 2',
            'distributor0a after 0',
            'distributor0a after 1',
            'distributor0a after 2',
            'distributor0b after 0',
            'distributor0b after 1',
            'distributor0b after 2',
            'distributor1a after 0',
            'distributor1a after 1',
            'distributor1a after 2',
            'distributor1b after 0',
            'distributor1b after 1',
            'distributor1b after 2',
            'distributor2a after 0',
            'distributor2a after 1',
            'distributor2a after 2',
            'distributor2b after 0',
            'distributor2b after 1',
            'distributor2b after 2'
        ]);
    });

    _mocha.it('should allow a method name as a late bound distribution stopped lifecycle function', () => {
        let calledDistributionStoppedFunction,
            eventObject;

        const CustomPubsub = _make(_Pubsub, {
                _distributionStoppedTestEvent (event) {
                    _chai.expect(event).to.equal(eventObject);
                    calledDistributionStoppedFunction = true;
                }
            }, {
                _pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        distributionStoppedFunction: '_distributionStoppedTestEvent'
                    }
                }
            }),
            distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = CustomPubsub(),
            subscriptionsExecuted = [];

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                if (eventObject) {
                    _chai.expect(event).to.equal(eventObject);
                } else {
                    eventObject = event;
                }

                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                event.stopDistribution();
                _chai.expect(event.distributionStopped).to.be.true;
                _chai.expect(calledDistributionStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'publisher before 1',
            'publisher before 2',
            'publisher on 0',
            'publisher on 1',
            'publisher on 2',
            'distributor0 on 0',
            'distributor0 on 1',
            'distributor0 on 2',
            'distributor1 on 0',
            'distributor1 on 1',
            'distributor1 on 2',
            'distributor2 on 0',
            'distributor2 on 1',
            'distributor2 on 2',
            'distributor0a on 0',
            'distributor0a on 1',
            'distributor0a on 2',
            'distributor0b on 0',
            'distributor0b on 1',
            'distributor0b on 2',
            'distributor1a on 0',
            'distributor1a on 1',
            'distributor1a on 2',
            'distributor1b on 0',
            'distributor1b on 1',
            'distributor1b on 2',
            'distributor2a on 0',
            'distributor2a on 1',
            'distributor2a on 2',
            'distributor2b on 0',
            'distributor2b on 1',
            'distributor2b on 2',
            'publisher after 0',
            'publisher after 1',
            'publisher after 2',
            'distributor0 after 0',
            'distributor0 after 1',
            'distributor0 after 2',
            'distributor1 after 0',
            'distributor1 after 1',
            'distributor1 after 2',
            'distributor2 after 0',
            'distributor2 after 1',
            'distributor2 after 2',
            'distributor0a after 0',
            'distributor0a after 1',
            'distributor0a after 2',
            'distributor0b after 0',
            'distributor0b after 1',
            'distributor0b after 2',
            'distributor1a after 0',
            'distributor1a after 1',
            'distributor1a after 2',
            'distributor1b after 0',
            'distributor1b after 1',
            'distributor1b after 2',
            'distributor2a after 0',
            'distributor2a after 1',
            'distributor2a after 2',
            'distributor2b after 0',
            'distributor2b after 1',
            'distributor2b after 2'
        ]);
    });

    _mocha.it('should allow a method name as a late bound distribution stopped lifecycle function with a custom lifecycle host', () => {
        let calledDistributionStoppedFunction,
            eventObject;

        const customLifecycleHost = {
                _distributionStoppedTestEvent (event) {
                    _chai.expect(event).to.equal(eventObject);
                    calledDistributionStoppedFunction = true;
                }
            },
            CustomPubsub = _make(_Pubsub, {}, {
                _pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        distributionStoppedFunction: '_distributionStoppedTestEvent',
                        lifecycleHost: customLifecycleHost
                    }
                }
            }),
            distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = CustomPubsub(),
            subscriptionsExecuted = [];

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                if (eventObject) {
                    _chai.expect(event).to.equal(eventObject);
                } else {
                    eventObject = event;
                }

                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                event.stopDistribution();
                _chai.expect(event.distributionStopped).to.be.true;
                _chai.expect(calledDistributionStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'publisher before 1',
            'publisher before 2',
            'publisher on 0',
            'publisher on 1',
            'publisher on 2',
            'distributor0 on 0',
            'distributor0 on 1',
            'distributor0 on 2',
            'distributor1 on 0',
            'distributor1 on 1',
            'distributor1 on 2',
            'distributor2 on 0',
            'distributor2 on 1',
            'distributor2 on 2',
            'distributor0a on 0',
            'distributor0a on 1',
            'distributor0a on 2',
            'distributor0b on 0',
            'distributor0b on 1',
            'distributor0b on 2',
            'distributor1a on 0',
            'distributor1a on 1',
            'distributor1a on 2',
            'distributor1b on 0',
            'distributor1b on 1',
            'distributor1b on 2',
            'distributor2a on 0',
            'distributor2a on 1',
            'distributor2a on 2',
            'distributor2b on 0',
            'distributor2b on 1',
            'distributor2b on 2',
            'publisher after 0',
            'publisher after 1',
            'publisher after 2',
            'distributor0 after 0',
            'distributor0 after 1',
            'distributor0 after 2',
            'distributor1 after 0',
            'distributor1 after 1',
            'distributor1 after 2',
            'distributor2 after 0',
            'distributor2 after 1',
            'distributor2 after 2',
            'distributor0a after 0',
            'distributor0a after 1',
            'distributor0a after 2',
            'distributor0b after 0',
            'distributor0b after 1',
            'distributor0b after 2',
            'distributor1a after 0',
            'distributor1a after 1',
            'distributor1a after 2',
            'distributor1b after 0',
            'distributor1b after 1',
            'distributor1b after 2',
            'distributor2a after 0',
            'distributor2a after 1',
            'distributor2a after 2',
            'distributor2b after 0',
            'distributor2b after 1',
            'distributor2b after 2'
        ]);
    });

    _mocha.it('should execute the event stopped lifecycle function when the event is stopped', () => {
        const distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = _Pubsub(),
            subscriptionsExecuted = [];

        let calledEventStoppedFunction,
            eventObject;

        publisher.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            eventStoppedFunction (event) {
                _chai.expect(event).to.equal(eventObject);
                calledEventStoppedFunction = true;
            }
        });

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                if (eventObject) {
                    _chai.expect(event).to.equal(eventObject);
                } else {
                    eventObject = event;
                }

                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                event.stopEvent();
                _chai.expect(event.eventStopped).to.be.true;
                _chai.expect(calledEventStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'publisher before 1',
            'publisher before 2',
            'distributor0 before 0',
            'distributor0 before 1',
            'distributor0 before 2',
            'distributor1 before 0',
            'distributor1 before 1',
            'distributor1 before 2',
            'distributor2 before 0',
            'distributor2 before 1',
            'distributor2 before 2',
            'distributor0a before 0',
            'distributor0a before 1',
            'distributor0a before 2',
            'distributor0b before 0',
            'distributor0b before 1',
            'distributor0b before 2',
            'distributor1a before 0',
            'distributor1a before 1',
            'distributor1a before 2',
            'distributor1b before 0',
            'distributor1b before 1',
            'distributor1b before 2',
            'distributor2a before 0',
            'distributor2a before 1',
            'distributor2a before 2',
            'distributor2b before 0',
            'distributor2b before 1',
            'distributor2b before 2'
        ]);

        _chai.expect(calledEventStoppedFunction).to.be.true;
    });

    _mocha.it('should allow a method name as a late bound stopped lifecycle function', () => {
        let calledEventStoppedFunction,
            eventObject;

        const CustomPubsub = _make(_Pubsub, {
                _eventStoppedTestEvent (event) {
                    _chai.expect(event).to.equal(eventObject);
                    calledEventStoppedFunction = true;
                }
            }, {
                _pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        eventStoppedFunction: '_eventStoppedTestEvent'
                    }
                }
            }),
            distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = CustomPubsub(),
            subscriptionsExecuted = [];

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                if (eventObject) {
                    _chai.expect(event).to.equal(eventObject);
                } else {
                    eventObject = event;
                }

                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                event.stopEvent();
                _chai.expect(event.eventStopped).to.be.true;
                _chai.expect(calledEventStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'publisher before 1',
            'publisher before 2',
            'distributor0 before 0',
            'distributor0 before 1',
            'distributor0 before 2',
            'distributor1 before 0',
            'distributor1 before 1',
            'distributor1 before 2',
            'distributor2 before 0',
            'distributor2 before 1',
            'distributor2 before 2',
            'distributor0a before 0',
            'distributor0a before 1',
            'distributor0a before 2',
            'distributor0b before 0',
            'distributor0b before 1',
            'distributor0b before 2',
            'distributor1a before 0',
            'distributor1a before 1',
            'distributor1a before 2',
            'distributor1b before 0',
            'distributor1b before 1',
            'distributor1b before 2',
            'distributor2a before 0',
            'distributor2a before 1',
            'distributor2a before 2',
            'distributor2b before 0',
            'distributor2b before 1',
            'distributor2b before 2'
        ]);

        _chai.expect(calledEventStoppedFunction).to.be.true;
    });

    _mocha.it('should allow a method name as a late bound stopped lifecycle function with a custom lifecycle host', () => {
        let calledEventStoppedFunction,
            eventObject;

        const customLifecycleHost = {
                _eventStoppedTestEvent (event) {
                    _chai.expect(event).to.equal(eventObject);
                    calledEventStoppedFunction = true;
                }
            },
            CustomPubsub = _make(_Pubsub, {}, {
                _pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        eventStoppedFunction: '_eventStoppedTestEvent',
                        lifecycleHost: customLifecycleHost
                    }
                }
            }),
            distributor0 = _Pubsub(),
            distributor0a = _Pubsub(),
            distributor0b = _Pubsub(),
            distributor1 = _Pubsub(),
            distributor1a = _Pubsub(),
            distributor1b = _Pubsub(),
            distributor2 = _Pubsub(),
            distributor2a = _Pubsub(),
            distributor2b = _Pubsub(),
            publisher = CustomPubsub(),
            subscriptionsExecuted = [];

        publisher.addDistributor([
            distributor0,
            distributor1,
            distributor2
        ]);

        distributor0.addDistributor(distributor0a).addDistributor(distributor0b);

        distributor1.addDistributor([
            distributor1a,
            distributor1b
        ]);

        distributor2.addDistributor(new Set([
            distributor2a,
            distributor2b
        ]));

        [[
            'distributor0',
            distributor0
        ], [
            'distributor0a',
            distributor0a
        ], [
            'distributor0b',
            distributor0b
        ], [
            'distributor1',
            distributor1
        ], [
            'distributor1a',
            distributor1a
        ], [
            'distributor1b',
            distributor1b
        ], [
            'distributor2',
            distributor2
        ], [
            'distributor2a',
            distributor2a
        ], [
            'distributor2b',
            distributor2b
        ], [
            'publisher',
            publisher
        ]].forEach(([
            name,
            pubsub
        ]) => {
            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                if (eventObject) {
                    _chai.expect(event).to.equal(eventObject);
                } else {
                    eventObject = event;
                }

                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                event.stopEvent();
                _chai.expect(event.eventStopped).to.be.true;
                _chai.expect(calledEventStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                _chai.expect(event).to.equal(eventObject);
                _chai.expect(event).to.have.property('distributor', pubsub);
                _chai.expect(event).to.have.property('publisher', publisher);
                _chai.expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'publisher before 0',
            'publisher before 1',
            'publisher before 2',
            'distributor0 before 0',
            'distributor0 before 1',
            'distributor0 before 2',
            'distributor1 before 0',
            'distributor1 before 1',
            'distributor1 before 2',
            'distributor2 before 0',
            'distributor2 before 1',
            'distributor2 before 2',
            'distributor0a before 0',
            'distributor0a before 1',
            'distributor0a before 2',
            'distributor0b before 0',
            'distributor0b before 1',
            'distributor0b before 2',
            'distributor1a before 0',
            'distributor1a before 1',
            'distributor1a before 2',
            'distributor1b before 0',
            'distributor1b before 1',
            'distributor1b before 2',
            'distributor2a before 0',
            'distributor2a before 1',
            'distributor2a before 2',
            'distributor2b before 0',
            'distributor2b before 1',
            'distributor2b before 2'
        ]);

        _chai.expect(calledEventStoppedFunction).to.be.true;
    });

    _mocha.it('should execute the prevented lifecycle function when the event is prevented', () => {
        const pubsub = _Pubsub(),
            subscriptionsExecuted = [];

        let calledPreventedFunction,
            eventObject;

        pubsub.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            preventedFunction (event) {
                _chai.expect(event).to.equal(eventObject);
                calledPreventedFunction = true;
            }
        });

        pubsub.before('testEvent', event => {
            eventObject = event;
            event.prevent('on');
            _chai.expect(event.isPrevented('on')).to.be.true;
            _chai.expect(calledPreventedFunction).to.be.undefined;
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            _chai.expect(event).to.equal(eventObject);
            _chai.expect(event.defaultIsPrevented()).to.be.true;
            _chai.expect(calledPreventedFunction).to.be.true;
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before'
        ]);

        _chai.expect(calledPreventedFunction).to.be.true;
    });

    _mocha.it('should allow a method name as a late bound prevented lifecycle function', () => {
        let calledPreventedFunction,
            eventObject;

        const CustomPubsub = _make(_Pubsub, {
                _preventedTestEvent (event) {
                    _chai.expect(event).to.equal(eventObject);
                    calledPreventedFunction = true;
                }
            }, {
                _pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        preventedFunction: '_preventedTestEvent'
                    }
                }
            }),
            customPubsub = CustomPubsub(),
            subscriptionsExecuted = [];

        customPubsub.before('testEvent', event => {
            eventObject = event;
            event.prevent('on');
            _chai.expect(event.isPrevented('on')).to.be.true;
            _chai.expect(calledPreventedFunction).to.be.undefined;
            subscriptionsExecuted.push('before');
        });

        customPubsub.on('testEvent', event => {
            _chai.expect(event).to.equal(eventObject);
            _chai.expect(event.defaultIsPrevented()).to.be.true;
            _chai.expect(calledPreventedFunction).to.be.true;
            subscriptionsExecuted.push('on');
        });

        customPubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before'
        ]);

        _chai.expect(calledPreventedFunction).to.be.true;
    });

    _mocha.it('should allow a method name as a late bound prevented lifecycle function with a custom lifecycle host', () => {
        let calledPreventedFunction,
            eventObject;

        const customLifecycleHost = {
                _preventedTestEvent (event) {
                    _chai.expect(event).to.equal(eventObject);
                    calledPreventedFunction = true;
                }
            },
            CustomPubsub = _make(_Pubsub, {}, {
                _pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        lifecycleHost: customLifecycleHost,
                        preventedFunction: '_preventedTestEvent'
                    }
                }
            }),
            customPubsub = CustomPubsub(),
            subscriptionsExecuted = [];

        customPubsub.before('testEvent', event => {
            eventObject = event;
            event.prevent('on');
            _chai.expect(event.isPrevented('on')).to.be.true;
            _chai.expect(calledPreventedFunction).to.be.undefined;
            subscriptionsExecuted.push('before');
        });

        customPubsub.on('testEvent', event => {
            _chai.expect(event).to.equal(eventObject);
            _chai.expect(event.defaultIsPrevented()).to.be.true;
            _chai.expect(calledPreventedFunction).to.be.true;
            subscriptionsExecuted.push('on');
        });

        customPubsub.publish('testEvent');

        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'before'
        ]);

        _chai.expect(calledPreventedFunction).to.be.true;
    });

    _mocha.it('should execute the subscribed lifecycle function when the event is subscribed to', () => {
        let calledSubscribedFunction,
            subscriptionExecuted;

        const pubsub = _Pubsub(),
            subscriptionConfig = {
                callbackFunction () {
                    subscriptionExecuted = true;
                }
            };

        pubsub.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            subscribedFunction ({
                config,
                dispatcher
            }) {
                _chai.expect(config).to.have.property('callbackFunction', subscriptionConfig.callbackFunction);
                _chai.expect(config).to.have.property('host', pubsub);
                _chai.expect(config).to.have.property('lifecycleHost', pubsub);
                _chai.expect(config).to.have.property('publicSubscription', true);
                _chai.expect(config).to.have.property('stageName', 'on');
                _chai.expect(config.state).to.be.an('object');
                _chai.expect(dispatcher).to.be.an.instanceOf(_pubsub.Dispatcher);
                calledSubscribedFunction = true;
            }
        });

        {
            const subscription = pubsub.subscribe('on', 'testEvent', subscriptionConfig);

            _chai.expect(calledSubscribedFunction).to.be.true;

            pubsub.publish('testEvent');

            _chai.expect(subscriptionExecuted).to.be.true;

            subscription.unsubscribe();
            subscriptionExecuted = false;

            pubsub.publish('testEvent');

            _chai.expect(subscriptionExecuted).to.be.false;
        }
    });

    _mocha.it('should allow a method name as a late bound subscribed lifecycle function', () => {
        let calledSubscribedFunction,
            subscriptionExecuted;

        const CustomPubsub = _make(_Pubsub, {
                callbackFunction () {
                    subscriptionExecuted = true;
                },
                _subscribedTestEvent ({
                    config,
                    dispatcher
                }) {
                    _chai.expect(config).to.have.property('callbackFunction', 'callbackFunction');
                    _chai.expect(config).to.have.property('host', this);
                    _chai.expect(config).to.have.property('lifecycleHost', this);
                    _chai.expect(config).to.have.property('publicSubscription', true);
                    _chai.expect(config).to.have.property('stageName', 'on');
                    _chai.expect(config.state).to.be.an('object');
                    _chai.expect(dispatcher).to.be.an.instanceOf(_pubsub.Dispatcher);
                    calledSubscribedFunction = true;
                }
            }, {
                _pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        subscribedFunction: '_subscribedTestEvent'
                    }
                }
            }),
            customPubsub = CustomPubsub();

        {
            const subscription = customPubsub.subscribe('on', 'testEvent', 'callbackFunction');

            _chai.expect(calledSubscribedFunction).to.be.true;

            customPubsub.publish('testEvent');

            _chai.expect(subscriptionExecuted).to.be.true;

            subscription.unsubscribe();
            subscriptionExecuted = false;

            customPubsub.publish('testEvent');

            _chai.expect(subscriptionExecuted).to.be.false;
        }
    });

    _mocha.it('should allow a method name as a late bound subscribed lifecycle function with a custom lifecycle host', () => {
        let calledSubscribedFunction,
            subscriptionExecuted;

        const customHost = {
                callbackFunction () {
                    subscriptionExecuted = true;
                }
            },
            customLifecycleHost = {
                _subscribedTestEvent ({
                    config,
                    dispatcher
                }) {
                    _chai.expect(config).to.have.property('callbackFunction', 'callbackFunction');
                    _chai.expect(config).to.have.property('host', customHost);
                    _chai.expect(config).to.have.property('lifecycleHost', customLifecycleHost);
                    _chai.expect(config).to.have.property('publicSubscription', true);
                    _chai.expect(config).to.have.property('stageName', 'on');
                    _chai.expect(config.state).to.be.an('object');
                    _chai.expect(dispatcher).to.be.an.instanceOf(_pubsub.Dispatcher);
                    calledSubscribedFunction = true;
                }
            },
            CustomPubsub = _make(_Pubsub, {}, {
                _pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        lifecycleHost: customLifecycleHost,
                        subscribedFunction: '_subscribedTestEvent'
                    }
                }
            }),
            customPubsub = CustomPubsub();

        {
            const subscription = customPubsub.subscribe('on', 'testEvent', {
                callbackFunction: 'callbackFunction',
                host: customHost
            });

            _chai.expect(calledSubscribedFunction).to.be.true;

            customPubsub.publish('testEvent');

            _chai.expect(subscriptionExecuted).to.be.true;

            subscription.unsubscribe();
            subscriptionExecuted = false;

            customPubsub.publish('testEvent');

            _chai.expect(subscriptionExecuted).to.be.false;
        }
    });

    _mocha.it('should return the subscription object returned by the subscribed lifecycle function', () => {
        const customSubscription = {},
            pubsub = _Pubsub();

        pubsub.defineDispatcher('testEvent', {
            subscribedFunction () {
                return customSubscription;
            }
        });

        {
            const subscription = pubsub.subscribe('on', 'testEvent', () => void null);

            _chai.expect(subscription).to.equal(customSubscription);
        }
    });

    _mocha.it('should execute the unsubscribed lifecycle function when the event is unsubscribed from', () => {
        let calledUnsubscribedFunction,
            subscriptionExecuted;

        const pubsub = _Pubsub(),
            subscriptionConfig = {
                callbackFunction () {
                    subscriptionExecuted = true;
                }
            };

        pubsub.defineDispatcher('testEvent', {
            allowPublicPublish: true,
            unsubscribedFunction ({
                config,
                dispatcher
            }) {
                _chai.expect(config).to.have.property('callbackFunction', subscriptionConfig.callbackFunction);
                _chai.expect(config).to.have.property('host', pubsub);
                _chai.expect(config).to.have.property('lifecycleHost', pubsub);
                _chai.expect(config).to.have.property('publicSubscription', true);
                _chai.expect(config).to.have.property('stageName', 'on');
                _chai.expect(config).to.have.property('state').that.is.an('object');
                _chai.expect(dispatcher).to.be.an.instanceOf(_pubsub.Dispatcher);
                calledUnsubscribedFunction = true;
            }
        });

        {
            const subscription = pubsub.subscribe('on', 'testEvent', subscriptionConfig);

            pubsub.publish('testEvent');

            _chai.expect(subscriptionExecuted).to.be.true;

            subscription.unsubscribe();

            _chai.expect(calledUnsubscribedFunction).to.be.true;

            calledUnsubscribedFunction = false;
            subscriptionExecuted = false;

            subscriptionConfig.callbackFunction = event => {
                event.unsubscribe();
                _chai.expect(calledUnsubscribedFunction).to.be.true;
                subscriptionExecuted = true;
            };

            pubsub.subscribe('on', 'testEvent', subscriptionConfig);
            pubsub.publish('testEvent');

            _chai.expect(subscriptionExecuted).to.be.true;
        }
    });

    _mocha.it('should allow a method name as a late bound unsubscribed lifecycle function', () => {
        let calledUnsubscribedFunction,
            subscriptionExecuted;

        const CustomPubsub = _make(_Pubsub, {
                callbackFunction () {
                    subscriptionExecuted = true;
                },
                _unsubscribedTestEvent ({
                    config,
                    dispatcher
                }) {
                    _chai.expect(config).to.have.property('callbackFunction', 'callbackFunction');
                    _chai.expect(config).to.have.property('host', this);
                    _chai.expect(config).to.have.property('lifecycleHost', this);
                    _chai.expect(config).to.have.property('publicSubscription', true);
                    _chai.expect(config).to.have.property('stageName', 'on');
                    _chai.expect(config).to.have.property('state').that.is.an('object');
                    _chai.expect(dispatcher).to.be.an.instanceOf(_pubsub.Dispatcher);
                    calledUnsubscribedFunction = true;
                }
            }, {
                _pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        unsubscribedFunction: '_unsubscribedTestEvent'
                    }
                }
            }),
            customPubsub = CustomPubsub();

        {
            const subscription = customPubsub.subscribe('on', 'testEvent', 'callbackFunction');

            customPubsub.publish('testEvent');

            _chai.expect(subscriptionExecuted).to.be.true;

            subscription.unsubscribe();

            _chai.expect(calledUnsubscribedFunction).to.be.true;

            calledUnsubscribedFunction = false;
            subscriptionExecuted = false;

            customPubsub.callbackFunction = event => {
                event.unsubscribe();
                _chai.expect(calledUnsubscribedFunction).to.be.true;
                subscriptionExecuted = true;
            };

            customPubsub.subscribe('on', 'testEvent', 'callbackFunction');
            customPubsub.publish('testEvent');

            _chai.expect(subscriptionExecuted).to.be.true;
        }
    });

    _mocha.it('should allow a method name as a late bound unsubscribed lifecycle function with a custom lifecycle host', () => {
        let calledUnsubscribedFunction,
            subscriptionExecuted;

        const customHost = {
                callbackFunction () {
                    subscriptionExecuted = true;
                }
            },
            customLifecycleHost = {
                _unsubscribedTestEvent ({
                    config,
                    dispatcher
                }) {
                    _chai.expect(config).to.have.property('callbackFunction', 'callbackFunction');
                    _chai.expect(config).to.have.property('host', customHost);
                    _chai.expect(config).to.have.property('lifecycleHost', customLifecycleHost);
                    _chai.expect(config).to.have.property('publicSubscription', true);
                    _chai.expect(config).to.have.property('stageName', 'on');
                    _chai.expect(config).to.have.property('state').that.is.an('object');
                    _chai.expect(dispatcher).to.be.an.instanceOf(_pubsub.Dispatcher);
                    calledUnsubscribedFunction = true;
                }
            },
            CustomPubsub = _make(_Pubsub, {}, {
                _pubsub: {
                    testEvent: {
                        allowPublicPublish: true,
                        lifecycleHost: customLifecycleHost,
                        unsubscribedFunction: '_unsubscribedTestEvent'
                    }
                }
            }),
            customPubsub = CustomPubsub();

        {
            const subscription = customPubsub.subscribe('on', 'testEvent', {
                callbackFunction: 'callbackFunction',
                host: customHost
            });

            customPubsub.publish('testEvent');

            _chai.expect(subscriptionExecuted).to.be.true;

            subscription.unsubscribe();

            _chai.expect(calledUnsubscribedFunction).to.be.true;

            calledUnsubscribedFunction = false;
            subscriptionExecuted = false;

            customPubsub.callbackFunction = event => {
                event.unsubscribe();
                _chai.expect(calledUnsubscribedFunction).to.be.true;
                subscriptionExecuted = true;
            };

            customPubsub.subscribe('on', 'testEvent', {
                callbackFunction: 'callbackFunction',
                host: customHost
            });
            customPubsub.publish('testEvent');

            _chai.expect(subscriptionExecuted).to.be.true;
        }
    });

    _mocha.it('should prevent unsubscription when the unsubscribed lifecycle function returns false', () => {
        let calledUnsubscribedFunction,
            subscriptionExecuted;

        const pubsub = _Pubsub(),
            subscriptionConfig = {
                callbackFunction () {
                    subscriptionExecuted = true;
                }
            };

        pubsub.defineDispatcher([
            'testEvent0',
            'testEvent1'
        ], {
            allowPublicPublish: true,
            unsubscribedFunction ({
                config,
                dispatcher
            }) {
                _chai.expect(config).to.have.property('callbackFunction', subscriptionConfig.callbackFunction);
                _chai.expect(config).to.have.property('host', pubsub);
                _chai.expect(config).to.have.property('lifecycleHost', pubsub);
                _chai.expect(config).to.have.property('publicSubscription', true);
                _chai.expect(config).to.have.property('stageName', 'on');
                _chai.expect(config).to.have.property('state').that.is.an('object');
                _chai.expect(dispatcher).to.be.an.instanceOf(_pubsub.Dispatcher);
                calledUnsubscribedFunction = true;
                return false;
            }
        });

        {
            const subscription = pubsub.subscribe('on', 'testEvent0', subscriptionConfig);

            pubsub.publish('testEvent0');

            _chai.expect(subscriptionExecuted).to.be.true;
            _chai.expect(subscription.unsubscribe()).to.be.false;
            _chai.expect(calledUnsubscribedFunction).to.be.true;
            _chai.expect(subscription.subscribed).to.be.true;

            subscriptionExecuted = false;
            pubsub.publish('testEvent0');
            _chai.expect(subscriptionExecuted).to.be.true;

            calledUnsubscribedFunction = false;
            subscriptionExecuted = false;

            subscriptionConfig.callbackFunction = event => {
                _chai.expect(event.unsubscribe()).to.be.false;
                event.unsubscribe();
                _chai.expect(calledUnsubscribedFunction).to.be.true;
                subscriptionExecuted = true;
            };

            pubsub.subscribe('on', 'testEvent1', subscriptionConfig);
            pubsub.publish('testEvent1');
            _chai.expect(subscriptionExecuted).to.be.true;

            calledUnsubscribedFunction = false;
            subscriptionExecuted = false;
            pubsub.publish('testEvent0');
            _chai.expect(subscriptionExecuted).to.be.true;
        }
    });

    _mocha.it('should be destroyable', () => {
        let subscriptionsExecuted = [];

        const pubsub = _Pubsub(),
            testSubscription0 = pubsub.onceOn('destroy', event => {
                _chai.expect(pubsub).to.have.property('destroyed', false);
                subscriptionsExecuted.push('onceOnDestroy');
                event.preventDefault();
            }),
            testSubscription1 = pubsub.on('destroy', () => {
                _chai.expect(pubsub).to.have.property('destroyed', false);
                subscriptionsExecuted.push('onDestroy');
            }),
            testSubscription2 = pubsub.after('destroy', () => {
                _chai.expect(pubsub).to.have.property('destroyed', true);
                subscriptionsExecuted.push('afterDestroy');
            }),
            testSubscription3 = pubsub.after('destroyComplete', () => {
                _chai.expect(pubsub).to.have.property('destroyed', true);
                subscriptionsExecuted.push('afterDestroyComplete');
            }),
            testSubscription4 = pubsub.on('destroyComplete', () => {
                _chai.expect(pubsub).to.have.property('destroyed', true);
                subscriptionsExecuted.push('onDestroyComplete');
            }),
            testSubscription5 = pubsub.on('anotherEvent', () => {
                _chai.expect(pubsub).to.have.property('destroyed', false);
                subscriptionsExecuted.push('onAnotherEvent');
            });

        _chai.expect(pubsub).to.have.property('destroyed', false);
        _chai.expect(testSubscription0).to.have.property('subscribed', true);
        _chai.expect(testSubscription1).to.have.property('subscribed', true);
        _chai.expect(testSubscription2).to.have.property('subscribed', true);
        _chai.expect(testSubscription3).to.have.property('subscribed', true);
        _chai.expect(testSubscription4).to.have.property('subscribed', true);
        _chai.expect(testSubscription5).to.have.property('subscribed', true);

        _chai.expect(() => {
            pubsub.destroyed = true;
        }).to.throw(TypeError); // eslint-disable-line no-restricted-globals -- This is testing a value provided by the runtime environment.

        _chai.expect(pubsub).to.have.property('destroyed', false);

        pubsub._destroy = function (...args) {
            _chai.expect(args).to.deep.equal([
                'a',
                'b',
                'c'
            ]);
            subscriptionsExecuted.push('defaultDestroy');
            Reflect.apply(_Pubsub.prototype._destroy, this, args);
        };

        pubsub._destroyComplete = function (...args) {
            _chai.expect(args).to.deep.equal([
                'a',
                'b',
                'c'
            ]);
            subscriptionsExecuted.push('defaultDestroyComplete');
            Reflect.apply(_Pubsub.prototype._destroyComplete, this, args);
        };

        pubsub.publish('anotherEvent').publish('destroy');

        _chai.expect(pubsub).to.have.property('destroyed', false);
        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'onAnotherEvent'
        ]);

        subscriptionsExecuted = [];

        pubsub.publish('anotherEvent').destroy('a', 'b', 'c');

        _chai.expect(pubsub).to.have.property('destroyed', false);
        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'onAnotherEvent',
            'onceOnDestroy',
            'onDestroy'
        ]);
        _chai.expect(testSubscription0).to.have.property('subscribed', false);

        subscriptionsExecuted = [];

        pubsub.publish('anotherEvent').destroy('a', 'b', 'c');

        _chai.expect(pubsub).to.have.property('destroyed', true);
        _chai.expect(subscriptionsExecuted).to.deep.equal([
            'onAnotherEvent',
            'onDestroy',
            'defaultDestroy',
            'onDestroyComplete',
            'defaultDestroyComplete',
            'afterDestroyComplete'
        ]);
        _chai.expect(testSubscription1).to.have.property('subscribed', false);
        _chai.expect(testSubscription2).to.have.property('subscribed', false);
        _chai.expect(testSubscription3).to.have.property('subscribed', false);
        _chai.expect(testSubscription4).to.have.property('subscribed', false);
        _chai.expect(testSubscription5).to.have.property('subscribed', false);

        subscriptionsExecuted = [];

        _chai.expect(() => {
            pubsub.publish('anotherEvent');
        }).to.throw(TypeError); // eslint-disable-line no-restricted-globals -- This is testing a value provided by the runtime environment.

        _chai.expect(() => {
            pubsub.destroy('a', 'b', 'c');
        }).to.throw(TypeError); // eslint-disable-line no-restricted-globals -- This is testing a value provided by the runtime environment.

        _chai.expect(pubsub).to.have.property('destroyed', true);
        _chai.expect(subscriptionsExecuted).to.deep.equal([]);
    });
});
