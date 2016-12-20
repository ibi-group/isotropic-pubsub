import {
    describe,
    it
} from 'mocha';

import Pubsub, {
    defaultSymbol,
    Dispatcher
} from '../js/pubsub.js';

import {
    expect
} from 'chai';

import make from 'isotropic-make';

describe('pubsub', () => {
    it('should construct pubsub objects', () => {
        expect(Pubsub).to.be.a('function');

        const pubsub = new Pubsub();

        expect(pubsub).to.be.an.instanceOf(Pubsub);
    });

    it('should be a pubsub object factory', () => {
        expect(Pubsub).to.be.a('function');

        const pubsub = Pubsub();

        expect(pubsub).to.be.an.instanceOf(Pubsub);
    });

    it('should execute staged subscribers when an event is published', () => {
        const pubsub = Pubsub(),
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

        expect(subscriptionsExecuted).to.deep.equal([
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

        expect(subscriptionsExecuted).to.deep.equal([
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

        expect(subscriptionsExecuted).to.deep.equal([
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

    it('should execute staged subscribers when an event is published with any combination of public or protected publish or subscribe', () => {
        const pubsub = Pubsub(),
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

        expect(subscriptionsExecuted).to.deep.equal([
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

        expect(subscriptionsExecuted).to.deep.equal([
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

        expect(subscriptionsExecuted).to.deep.equal([
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

    it('should provide protected stage subscription shortcut methods', () => {
        const pubsub = Pubsub(),
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

        expect(subscriptionsExecuted).to.deep.equal([
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

        expect(subscriptionsExecuted).to.deep.equal([
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

        expect(subscriptionsExecuted).to.deep.equal([
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

    it('should provide stage subscription shortcut methods', () => {
        const pubsub = Pubsub(),
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

        expect(subscriptionsExecuted).to.deep.equal([
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

        expect(subscriptionsExecuted).to.deep.equal([
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

        expect(subscriptionsExecuted).to.deep.equal([
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

    it('should not execute unsubscribed subscribers', () => {
        const pubsub = Pubsub(),
            subscriptionsExecuted = [],
            testSubscription = pubsub.on('testEvent', () => {
                subscriptionsExecuted.push('a');
            });

        pubsub.on('testEvent', event => {
            subscriptionsExecuted.push('b');
            expect(event.unsubscribe()).to.be.true;
        });

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'a',
            'b'
        ]);

        expect(testSubscription.unsubscribe()).to.be.true;

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'a',
            'b'
        ]);
    });

    it('should allow multiple unsubscription with no error', () => {
        const pubsub = Pubsub(),
            testSubscription = pubsub.on('testEvent', () => void null);

        expect(testSubscription.unsubscribe()).to.be.true;
        expect(testSubscription.unsubscribe()).to.be.true;
    });

    it('should acknowledge an event is complete after the default stage', () => {
        const pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.after('testEvent', event => {
            expect(event.completed).to.be.true;
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            expect(event.completed).not.to.be.true;
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            expect(event.completed).not.to.be.true;
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    it('should pass event data to subscribers', () => {
        const data = {
                a: 'a',
                b: 'b',
                c: 'c'
            },
            pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.after('testEvent', event => {
            expect(event.data).to.equal(data);
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            expect(event.data).to.equal(data);
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            expect(event.data).to.equal(data);
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent', data);

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    it('should pass event name to subscribers', () => {
        const pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.after('testEvent', event => {
            expect(event).to.have.property('name', 'testEvent');
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            expect(event).to.have.property('name', 'testEvent');
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            expect(event).to.have.property('name', 'testEvent');
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    it('should pass event publisher to subscribers', () => {
        const pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.after('testEvent', event => {
            expect(event).to.have.property('publisher', pubsub);
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            expect(event).to.have.property('publisher', pubsub);
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            expect(event).to.have.property('publisher', pubsub);
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    it('should pass stage name to subscribers', () => {
        const pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.after('testEvent', event => {
            expect(event).to.have.property('stageName', 'after');
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            expect(event).to.have.property('stageName', 'before');
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            expect(event).to.have.property('stageName', 'on');
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    it('should prevent preventable events', () => {
        const pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            event.preventDefault();
            expect(event.defaultIsPrevented()).to.be.true;
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            expect(event.defaultIsPrevented()).to.be.true;
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on'
        ]);
    });

    it('should allow multiple prevention with no error', () => {
        const pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            event.preventDefault();
            expect(event.defaultIsPrevented()).to.be.true;
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            event.preventDefault();
            expect(event.defaultIsPrevented()).to.be.true;
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on'
        ]);
    });

    it('should prevent preventable event stages', () => {
        const pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            event.prevent('on');
            expect(event.isPrevented('on')).to.be.true;
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', () => {
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'before'
        ]);
    });

    it('should distribute events to distributors', () => {
        const distributor0 = Pubsub(),
            distributor0a = Pubsub(),
            distributor0b = Pubsub(),
            distributor1 = Pubsub(),
            distributor1a = Pubsub(),
            distributor1b = Pubsub(),
            distributor2 = Pubsub(),
            distributor2a = Pubsub(),
            distributor2b = Pubsub(),
            publisher = Pubsub(),
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
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
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

    it('should not execute further stages if the event is stopped', () => {
        const distributor0 = Pubsub(),
            distributor0a = Pubsub(),
            distributor0b = Pubsub(),
            distributor1 = Pubsub(),
            distributor1a = Pubsub(),
            distributor1b = Pubsub(),
            distributor2 = Pubsub(),
            distributor2a = Pubsub(),
            distributor2b = Pubsub(),
            publisher = Pubsub(),
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
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                event.stopEvent();
                expect(event.eventStopped).to.be.true;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
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

    it('should not distribute events to distributors when distribution is stopped within a given stage', () => {
        const distributor0 = Pubsub(),
            distributor0a = Pubsub(),
            distributor0b = Pubsub(),
            distributor1 = Pubsub(),
            distributor1a = Pubsub(),
            distributor1b = Pubsub(),
            distributor2 = Pubsub(),
            distributor2a = Pubsub(),
            distributor2b = Pubsub(),
            publisher = Pubsub(),
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
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                event.stopDistribution();
                expect(event.distributionStopped).to.be.true;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
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

    it('should not execute further subscribers when dispatch is stopped within a given stage', () => {
        const distributor0 = Pubsub(),
            distributor0a = Pubsub(),
            distributor0b = Pubsub(),
            distributor1 = Pubsub(),
            distributor1a = Pubsub(),
            distributor1b = Pubsub(),
            distributor2 = Pubsub(),
            distributor2a = Pubsub(),
            distributor2b = Pubsub(),
            publisher = Pubsub(),
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
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                event.stopDispatch();
                expect(event.dispatchStopped).to.be.true;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
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

    it('should not distribute events to distributors after they have been removed', () => {
        const distributor0 = Pubsub(),
            distributor0a = Pubsub(),
            distributor0b = Pubsub(),
            distributor1 = Pubsub(),
            distributor1a = Pubsub(),
            distributor1b = Pubsub(),
            distributor2 = Pubsub(),
            distributor2a = Pubsub(),
            distributor2b = Pubsub(),
            publisher = Pubsub(),
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
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
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

        expect(subscriptionsExecuted).to.deep.equal([
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

    it('should remove non-existant distributors with no error', () => {
        const distributor = Pubsub(),
            pubsub = Pubsub();

        pubsub.removeDistributor(distributor);
    });

    it('should accept bulk subscription', () => {
        const pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);

        pubsub.publish('testEvent').publish('anotherEvent').publish('testEvent');

        testSubscription2.unsubscribe();

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
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

    it('should accept protected bulk subscription', () => {
        const pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);

        pubsub.publish('testEvent').publish('anotherEvent').publish('testEvent');

        testSubscription2.unsubscribe();

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
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

    it('should allow bulk unsubscription of all subscriptions', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);

        expect(pubsub.bulkUnsubscribe()).to.equal(true);

        expect(testSubscription0).to.have.property('subscribed', false);
        expect(testSubscription1).to.have.property('subscribed', false);
        expect(testSubscription2).to.have.property('subscribed', false);
        expect(testSubscription3).to.have.property('subscribed', false);
        expect(testSubscription4).to.have.property('subscribed', false);
        expect(testSubscription5).to.have.property('subscribed', false);
        expect(testSubscription6).to.have.property('subscribed', false);
        expect(testSubscription7).to.have.property('subscribed', false);
        expect(testSubscription8).to.have.property('subscribed', false);
        expect(testSubscription9).to.have.property('subscribed', false);
        expect(testSubscription10).to.have.property('subscribed', false);
        expect(testSubscription11).to.have.property('subscribed', false);
        expect(testSubscription12).to.have.property('subscribed', false);
        expect(testSubscription13).to.have.property('subscribed', false);
        expect(testSubscription14).to.have.property('subscribed', false);
        expect(testSubscription15).to.have.property('subscribed', false);
        expect(testSubscription16).to.have.property('subscribed', false);
        expect(testSubscription17).to.have.property('subscribed', false);
        expect(testSubscription18).to.have.property('subscribed', false);
        expect(testSubscription19).to.have.property('subscribed', false);
        expect(testSubscription20).to.have.property('subscribed', false);
        expect(testSubscription21).to.have.property('subscribed', false);
        expect(testSubscription22).to.have.property('subscribed', false);
        expect(testSubscription23).to.have.property('subscribed', false);
        expect(testSubscription24).to.have.property('subscribed', false);
        expect(testSubscription25).to.have.property('subscribed', false);
        expect(testSubscription26).to.have.property('subscribed', false);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(0);

        expect(pubsub.bulkUnsubscribe()).to.equal(false);
    });

    it('should allow bulk unsubscription of an event', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);

        expect(pubsub.bulkUnsubscribe('testEvent1')).to.equal(true);

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', false);
        expect(testSubscription10).to.have.property('subscribed', false);
        expect(testSubscription11).to.have.property('subscribed', false);
        expect(testSubscription12).to.have.property('subscribed', false);
        expect(testSubscription13).to.have.property('subscribed', false);
        expect(testSubscription14).to.have.property('subscribed', false);
        expect(testSubscription15).to.have.property('subscribed', false);
        expect(testSubscription16).to.have.property('subscribed', false);
        expect(testSubscription17).to.have.property('subscribed', false);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(18);

        expect(pubsub.bulkUnsubscribe('testEvent1')).to.equal(false);
    });

    it('should allow bulk unsubscription of multiple events', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);

        expect(pubsub.bulkUnsubscribe([
            'testEvent0',
            'testEvent1'
        ])).to.equal(true);

        expect(testSubscription0).to.have.property('subscribed', false);
        expect(testSubscription1).to.have.property('subscribed', false);
        expect(testSubscription2).to.have.property('subscribed', false);
        expect(testSubscription3).to.have.property('subscribed', false);
        expect(testSubscription4).to.have.property('subscribed', false);
        expect(testSubscription5).to.have.property('subscribed', false);
        expect(testSubscription6).to.have.property('subscribed', false);
        expect(testSubscription7).to.have.property('subscribed', false);
        expect(testSubscription8).to.have.property('subscribed', false);
        expect(testSubscription9).to.have.property('subscribed', false);
        expect(testSubscription10).to.have.property('subscribed', false);
        expect(testSubscription11).to.have.property('subscribed', false);
        expect(testSubscription12).to.have.property('subscribed', false);
        expect(testSubscription13).to.have.property('subscribed', false);
        expect(testSubscription14).to.have.property('subscribed', false);
        expect(testSubscription15).to.have.property('subscribed', false);
        expect(testSubscription16).to.have.property('subscribed', false);
        expect(testSubscription17).to.have.property('subscribed', false);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(9);

        expect(pubsub.bulkUnsubscribe([
            'testEvent0',
            'testEvent1'
        ])).to.equal(false);
    });

    it('should allow bulk unsubscription of an event at a specific stage', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);

        expect(pubsub.bulkUnsubscribe('on', 'testEvent1')).to.equal(true);

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', false);
        expect(testSubscription13).to.have.property('subscribed', false);
        expect(testSubscription14).to.have.property('subscribed', false);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(24);

        expect(pubsub.bulkUnsubscribe('on', 'testEvent1')).to.equal(false);
    });

    it('should allow bulk unsubscription of an event at multiple stages', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);

        expect(pubsub.bulkUnsubscribe([
            'after',
            'before'
        ], 'testEvent1')).to.equal(true);

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', false);
        expect(testSubscription10).to.have.property('subscribed', false);
        expect(testSubscription11).to.have.property('subscribed', false);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', false);
        expect(testSubscription16).to.have.property('subscribed', false);
        expect(testSubscription17).to.have.property('subscribed', false);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(21);

        expect(pubsub.bulkUnsubscribe([
            'after',
            'before'
        ], 'testEvent1')).to.equal(false);
    });

    it('should allow bulk unsubscription of multiple events at a specific stage', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);

        expect(pubsub.bulkUnsubscribe('on', [
            'testEvent0',
            'testEvent2'
        ])).to.equal(true);

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', false);
        expect(testSubscription4).to.have.property('subscribed', false);
        expect(testSubscription5).to.have.property('subscribed', false);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', false);
        expect(testSubscription22).to.have.property('subscribed', false);
        expect(testSubscription23).to.have.property('subscribed', false);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(21);

        expect(pubsub.bulkUnsubscribe('on', [
            'testEvent0',
            'testEvent2'
        ])).to.equal(false);
    });

    it('should allow bulk unsubscription of multiple events at multiple stages', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);

        expect(pubsub.bulkUnsubscribe([
            'before',
            'on'
        ], [
            'testEvent0',
            'testEvent2'
        ])).to.equal(true);

        expect(testSubscription0).to.have.property('subscribed', false);
        expect(testSubscription1).to.have.property('subscribed', false);
        expect(testSubscription2).to.have.property('subscribed', false);
        expect(testSubscription3).to.have.property('subscribed', false);
        expect(testSubscription4).to.have.property('subscribed', false);
        expect(testSubscription5).to.have.property('subscribed', false);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', false);
        expect(testSubscription19).to.have.property('subscribed', false);
        expect(testSubscription20).to.have.property('subscribed', false);
        expect(testSubscription21).to.have.property('subscribed', false);
        expect(testSubscription22).to.have.property('subscribed', false);
        expect(testSubscription23).to.have.property('subscribed', false);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(15);

        expect(pubsub.bulkUnsubscribe([
            'before',
            'on'
        ], [
            'testEvent0',
            'testEvent2'
        ])).to.equal(false);
    });

    it('should allow bulk unsubscription with specific configuration', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);

        expect(pubsub.bulkUnsubscribe([
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

        expect(testSubscription0).to.have.property('subscribed', false);
        expect(testSubscription1).to.have.property('subscribed', false);
        expect(testSubscription2).to.have.property('subscribed', false);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', false);
        expect(testSubscription10).to.have.property('subscribed', false);
        expect(testSubscription11).to.have.property('subscribed', false);
        expect(testSubscription12).to.have.property('subscribed', false);
        expect(testSubscription13).to.have.property('subscribed', false);
        expect(testSubscription14).to.have.property('subscribed', false);
        expect(testSubscription15).to.have.property('subscribed', false);
        expect(testSubscription16).to.have.property('subscribed', false);
        expect(testSubscription17).to.have.property('subscribed', false);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', false);
        expect(testSubscription25).to.have.property('subscribed', false);
        expect(testSubscription26).to.have.property('subscribed', false);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(12);

        expect(pubsub.bulkUnsubscribe([
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

    it('should handle bulk unsubscription of undefined events', () => {
        const pubsub = Pubsub();

        expect(pubsub.bulkUnsubscribe('unknownEvent')).to.equal(false);
        expect(pubsub.bulkUnsubscribe('on', 'unknownEvent')).to.equal(false);
    });

    it('should not allow public bulk unsubscription when allowPublicUnsubscription is false', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub({
                events: {
                    testEvent0: {
                        allowPublicUnsubscription: false
                    },
                    testEvent1: {
                        allowPublicUnsubscription: false
                    },
                    testEvent2: {
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);

        expect(pubsub.bulkUnsubscribe()).to.equal(false);
        expect(pubsub.bulkUnsubscribe('testEvent0')).to.equal(false);
        expect(pubsub.bulkUnsubscribe('on', 'testEvent0')).to.equal(false);

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);
    });

    it('should allow protected bulk unsubscription of all subscriptions', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);

        expect(pubsub._bulkUnsubscribe()).to.equal(true);

        expect(testSubscription0).to.have.property('subscribed', false);
        expect(testSubscription1).to.have.property('subscribed', false);
        expect(testSubscription2).to.have.property('subscribed', false);
        expect(testSubscription3).to.have.property('subscribed', false);
        expect(testSubscription4).to.have.property('subscribed', false);
        expect(testSubscription5).to.have.property('subscribed', false);
        expect(testSubscription6).to.have.property('subscribed', false);
        expect(testSubscription7).to.have.property('subscribed', false);
        expect(testSubscription8).to.have.property('subscribed', false);
        expect(testSubscription9).to.have.property('subscribed', false);
        expect(testSubscription10).to.have.property('subscribed', false);
        expect(testSubscription11).to.have.property('subscribed', false);
        expect(testSubscription12).to.have.property('subscribed', false);
        expect(testSubscription13).to.have.property('subscribed', false);
        expect(testSubscription14).to.have.property('subscribed', false);
        expect(testSubscription15).to.have.property('subscribed', false);
        expect(testSubscription16).to.have.property('subscribed', false);
        expect(testSubscription17).to.have.property('subscribed', false);
        expect(testSubscription18).to.have.property('subscribed', false);
        expect(testSubscription19).to.have.property('subscribed', false);
        expect(testSubscription20).to.have.property('subscribed', false);
        expect(testSubscription21).to.have.property('subscribed', false);
        expect(testSubscription22).to.have.property('subscribed', false);
        expect(testSubscription23).to.have.property('subscribed', false);
        expect(testSubscription24).to.have.property('subscribed', false);
        expect(testSubscription25).to.have.property('subscribed', false);
        expect(testSubscription26).to.have.property('subscribed', false);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(0);

        expect(pubsub._bulkUnsubscribe()).to.equal(false);
    });

    it('should allow protected bulk unsubscription of an event', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);

        expect(pubsub._bulkUnsubscribe('testEvent1')).to.equal(true);

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', false);
        expect(testSubscription10).to.have.property('subscribed', false);
        expect(testSubscription11).to.have.property('subscribed', false);
        expect(testSubscription12).to.have.property('subscribed', false);
        expect(testSubscription13).to.have.property('subscribed', false);
        expect(testSubscription14).to.have.property('subscribed', false);
        expect(testSubscription15).to.have.property('subscribed', false);
        expect(testSubscription16).to.have.property('subscribed', false);
        expect(testSubscription17).to.have.property('subscribed', false);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(18);

        expect(pubsub._bulkUnsubscribe('testEvent1')).to.equal(false);
    });

    it('should allow protected bulk unsubscription of multiple events', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);

        expect(pubsub._bulkUnsubscribe([
            'testEvent0',
            'testEvent1'
        ])).to.equal(true);

        expect(testSubscription0).to.have.property('subscribed', false);
        expect(testSubscription1).to.have.property('subscribed', false);
        expect(testSubscription2).to.have.property('subscribed', false);
        expect(testSubscription3).to.have.property('subscribed', false);
        expect(testSubscription4).to.have.property('subscribed', false);
        expect(testSubscription5).to.have.property('subscribed', false);
        expect(testSubscription6).to.have.property('subscribed', false);
        expect(testSubscription7).to.have.property('subscribed', false);
        expect(testSubscription8).to.have.property('subscribed', false);
        expect(testSubscription9).to.have.property('subscribed', false);
        expect(testSubscription10).to.have.property('subscribed', false);
        expect(testSubscription11).to.have.property('subscribed', false);
        expect(testSubscription12).to.have.property('subscribed', false);
        expect(testSubscription13).to.have.property('subscribed', false);
        expect(testSubscription14).to.have.property('subscribed', false);
        expect(testSubscription15).to.have.property('subscribed', false);
        expect(testSubscription16).to.have.property('subscribed', false);
        expect(testSubscription17).to.have.property('subscribed', false);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(9);

        expect(pubsub._bulkUnsubscribe([
            'testEvent0',
            'testEvent1'
        ])).to.equal(false);
    });

    it('should allow protected bulk unsubscription of an event at a specific stage', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);

        expect(pubsub._bulkUnsubscribe('on', 'testEvent1')).to.equal(true);

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', false);
        expect(testSubscription13).to.have.property('subscribed', false);
        expect(testSubscription14).to.have.property('subscribed', false);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(24);

        expect(pubsub._bulkUnsubscribe('on', 'testEvent1')).to.equal(false);
    });

    it('should allow protected bulk unsubscription of an event at multiple stages', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);

        expect(pubsub._bulkUnsubscribe([
            'after',
            'before'
        ], 'testEvent1')).to.equal(true);

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', false);
        expect(testSubscription10).to.have.property('subscribed', false);
        expect(testSubscription11).to.have.property('subscribed', false);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', false);
        expect(testSubscription16).to.have.property('subscribed', false);
        expect(testSubscription17).to.have.property('subscribed', false);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(21);

        expect(pubsub._bulkUnsubscribe([
            'after',
            'before'
        ], 'testEvent1')).to.equal(false);
    });

    it('should allow protected bulk unsubscription of multiple events at a specific stage', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);

        expect(pubsub._bulkUnsubscribe('on', [
            'testEvent0',
            'testEvent2'
        ])).to.equal(true);

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', false);
        expect(testSubscription4).to.have.property('subscribed', false);
        expect(testSubscription5).to.have.property('subscribed', false);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', false);
        expect(testSubscription22).to.have.property('subscribed', false);
        expect(testSubscription23).to.have.property('subscribed', false);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(21);

        expect(pubsub._bulkUnsubscribe('on', [
            'testEvent0',
            'testEvent2'
        ])).to.equal(false);
    });

    it('should allow protected bulk unsubscription of multiple events at multiple stages', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);

        expect(pubsub._bulkUnsubscribe([
            'before',
            'on'
        ], [
            'testEvent0',
            'testEvent2'
        ])).to.equal(true);

        expect(testSubscription0).to.have.property('subscribed', false);
        expect(testSubscription1).to.have.property('subscribed', false);
        expect(testSubscription2).to.have.property('subscribed', false);
        expect(testSubscription3).to.have.property('subscribed', false);
        expect(testSubscription4).to.have.property('subscribed', false);
        expect(testSubscription5).to.have.property('subscribed', false);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', false);
        expect(testSubscription19).to.have.property('subscribed', false);
        expect(testSubscription20).to.have.property('subscribed', false);
        expect(testSubscription21).to.have.property('subscribed', false);
        expect(testSubscription22).to.have.property('subscribed', false);
        expect(testSubscription23).to.have.property('subscribed', false);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(15);

        expect(pubsub._bulkUnsubscribe([
            'before',
            'on'
        ], [
            'testEvent0',
            'testEvent2'
        ])).to.equal(false);
    });

    it('should allow protected bulk unsubscription with specific configuration', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub(),
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

        expect(testSubscription0).to.have.property('subscribed', true);
        expect(testSubscription1).to.have.property('subscribed', true);
        expect(testSubscription2).to.have.property('subscribed', true);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', true);
        expect(testSubscription10).to.have.property('subscribed', true);
        expect(testSubscription11).to.have.property('subscribed', true);
        expect(testSubscription12).to.have.property('subscribed', true);
        expect(testSubscription13).to.have.property('subscribed', true);
        expect(testSubscription14).to.have.property('subscribed', true);
        expect(testSubscription15).to.have.property('subscribed', true);
        expect(testSubscription16).to.have.property('subscribed', true);
        expect(testSubscription17).to.have.property('subscribed', true);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', true);
        expect(testSubscription25).to.have.property('subscribed', true);
        expect(testSubscription26).to.have.property('subscribed', true);

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(27);

        expect(pubsub._bulkUnsubscribe([
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

        expect(testSubscription0).to.have.property('subscribed', false);
        expect(testSubscription1).to.have.property('subscribed', false);
        expect(testSubscription2).to.have.property('subscribed', false);
        expect(testSubscription3).to.have.property('subscribed', true);
        expect(testSubscription4).to.have.property('subscribed', true);
        expect(testSubscription5).to.have.property('subscribed', true);
        expect(testSubscription6).to.have.property('subscribed', true);
        expect(testSubscription7).to.have.property('subscribed', true);
        expect(testSubscription8).to.have.property('subscribed', true);
        expect(testSubscription9).to.have.property('subscribed', false);
        expect(testSubscription10).to.have.property('subscribed', false);
        expect(testSubscription11).to.have.property('subscribed', false);
        expect(testSubscription12).to.have.property('subscribed', false);
        expect(testSubscription13).to.have.property('subscribed', false);
        expect(testSubscription14).to.have.property('subscribed', false);
        expect(testSubscription15).to.have.property('subscribed', false);
        expect(testSubscription16).to.have.property('subscribed', false);
        expect(testSubscription17).to.have.property('subscribed', false);
        expect(testSubscription18).to.have.property('subscribed', true);
        expect(testSubscription19).to.have.property('subscribed', true);
        expect(testSubscription20).to.have.property('subscribed', true);
        expect(testSubscription21).to.have.property('subscribed', true);
        expect(testSubscription22).to.have.property('subscribed', true);
        expect(testSubscription23).to.have.property('subscribed', true);
        expect(testSubscription24).to.have.property('subscribed', false);
        expect(testSubscription25).to.have.property('subscribed', false);
        expect(testSubscription26).to.have.property('subscribed', false);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent0').publish('testEvent1').publish('testEvent2');

        expect(subscriptionExecutionCount).to.equal(12);

        expect(pubsub._bulkUnsubscribe([
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

    it('should handle protected bulk unsubscription of undefined events', () => {
        const pubsub = Pubsub();

        expect(pubsub._bulkUnsubscribe('unknownEvent')).to.equal(false);
        expect(pubsub._bulkUnsubscribe('on', 'unknownEvent')).to.equal(false);
    });

    it('should not allow duplicate subscriptions when allowDuplicateSubscription is false', () => {
        let subscriptionExecutionCount = 0;

        const callbackFunction = () => {
                subscriptionExecutionCount += 1;
            },
            pubsub = Pubsub();

        pubsub.defineEvent('testEvent0', {
            allowDuplicateSubscription: false
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

        expect(subscriptionExecutionCount).to.equal(2);

        subscriptionExecutionCount = 0;

        pubsub.publish('testEvent1');

        expect(subscriptionExecutionCount).to.equal(4);
    });

    it('should not allow public publish when allowPublicPublish is false', () => {
        const pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineEvent('testEvent', {
            allowPublicPublish: false
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

        expect(subscriptionsExecuted).to.deep.equal([]);

        pubsub._publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    it('should not allow public subscribe when allowPublicSubscription is false', () => {
        const pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineEvent('testEvent', {
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

        expect(subscriptionsExecuted).to.deep.equal([]);

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

        expect(subscriptionsExecuted).to.deep.equal([
            'protected before',
            'protected on',
            'protected after'
        ]);
    });

    it('should not publish a completeOnce event after it has already completed', () => {
        const pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineEvent('testEvent', {
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

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on'
        ]);

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'on',
            'after'
        ]);

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'on',
            'after'
        ]);
    });

    it('should not complete a completeOnce event after it has already completed', () => {
        const pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineEvent('testEvent', {
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

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after',
            'on'
        ]);
    });

    it('should not stop dispatch when dispatchStoppable is false', () => {
        const distributor0 = Pubsub(),
            distributor0a = Pubsub(),
            distributor0b = Pubsub(),
            distributor1 = Pubsub(),
            distributor1a = Pubsub(),
            distributor1b = Pubsub(),
            distributor2 = Pubsub(),
            distributor2a = Pubsub(),
            distributor2b = Pubsub(),
            publisher = Pubsub(),
            subscriptionsExecuted = [];

        publisher.defineEvent('testEvent', {
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
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                event.stopDispatch();
                expect(event.dispatchStopped).not.to.be.true;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
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

    it('should not distribute events to distributors when distributable is false', () => {
        const distributor0 = Pubsub(),
            distributor0a = Pubsub(),
            distributor0b = Pubsub(),
            distributor1 = Pubsub(),
            distributor1a = Pubsub(),
            distributor1b = Pubsub(),
            distributor2 = Pubsub(),
            distributor2a = Pubsub(),
            distributor2b = Pubsub(),
            publisher = Pubsub(),
            subscriptionsExecuted = [];

        publisher.defineEvent('testEvent', {
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
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
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

    it('should not stop distribution when distributionStoppable is false', () => {
        const distributor0 = Pubsub(),
            distributor0a = Pubsub(),
            distributor0b = Pubsub(),
            distributor1 = Pubsub(),
            distributor1a = Pubsub(),
            distributor1b = Pubsub(),
            distributor2 = Pubsub(),
            distributor2a = Pubsub(),
            distributor2b = Pubsub(),
            publisher = Pubsub(),
            subscriptionsExecuted = [];

        publisher.defineEvent('testEvent', {
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
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                event.stopDistribution();
                expect(event.distributionStopped).not.to.be.true;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
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

    it('should not stop the event when eventStoppable is false', () => {
        const distributor0 = Pubsub(),
            distributor0a = Pubsub(),
            distributor0b = Pubsub(),
            distributor1 = Pubsub(),
            distributor1a = Pubsub(),
            distributor1b = Pubsub(),
            distributor2 = Pubsub(),
            distributor2a = Pubsub(),
            distributor2b = Pubsub(),
            publisher = Pubsub(),
            subscriptionsExecuted = [];

        publisher.defineEvent('testEvent', {
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
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                event.stopEvent();
                expect(event.eventStopped).not.to.be.true;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
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

    it('should not prevent events when preventable is false', () => {
        const pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineEvent('testEvent', {
            preventable: false
        });

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            event.preventDefault();
            expect(event.defaultIsPrevented()).not.to.be.true;
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            expect(event.defaultIsPrevented()).not.to.be.true;
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    it('should not prevent event stages when preventable is false', () => {
        const pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineEvent('testEvent', {
            preventable: false
        });

        pubsub.after('testEvent', () => {
            subscriptionsExecuted.push('after');
        });

        pubsub.before('testEvent', event => {
            event.prevent('on');
            expect(event.isPrevented('on')).not.to.be.true;
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', () => {
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    it('should not publish a publishOnce event more than once', () => {
        const pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineEvent('testEvent', {
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

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    it('should allow custom event stages', () => {
        const customSymbol = Symbol('customSymbol'),
            pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineEvent('testEvent', {
            stages: [
                'wayBefore',
                'before',
                customSymbol,
                'on',
                'about-to-happen',
                defaultSymbol,
                'it just happened!'
            ]
        });

        pubsub.subscribe('about-to-happen', 'testEvent', event => {
            expect(event.completed).not.to.be.true;
            subscriptionsExecuted.push('about-to-happen');
        });

        pubsub.subscribe('after', 'testEvent', () => {
            subscriptionsExecuted.push('after');
        });

        pubsub.subscribe('before', 'testEvent', event => {
            expect(event.completed).not.to.be.true;
            subscriptionsExecuted.push('before');
        });

        pubsub.subscribe(customSymbol, 'testEvent', event => {
            expect(event.completed).not.to.be.true;
            subscriptionsExecuted.push('customSymbol');
        });

        pubsub.subscribe('it just happened!', 'testEvent', event => {
            expect(event.completed).to.be.true;
            subscriptionsExecuted.push('it just happened!');
        });

        pubsub.subscribe('on', 'testEvent', event => {
            expect(event.completed).not.to.be.true;
            subscriptionsExecuted.push('on');
        });

        pubsub.subscribe('wayBefore', 'testEvent', event => {
            expect(event.completed).not.to.be.true;
            subscriptionsExecuted.push('wayBefore');
        });

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'wayBefore',
            'before',
            'customSymbol',
            'on',
            'about-to-happen',
            'it just happened!'
        ]);
    });

    it('should only prevent preventable event stages', () => {
        const pubsub = Pubsub();

        let subscriptionsExecuted = [];

        pubsub.defineEvent('testEvent', {
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
                expect(event.isPrevented('b')).to.be.true;
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

        expect(subscriptionsExecuted).to.deep.equal([
            'a'
        ]);

        subscriptionsExecuted = [];

        pubsub.subscribe('a', 'testEvent', {
            callbackFunction (event) {
                event.prevent('c');
                expect(event.isPrevented('c')).not.to.be.true;
                subscriptionsExecuted.push('a');
            },
            once: true
        });

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'a',
            'b',
            'c',
            'd'
        ]);

        subscriptionsExecuted = [];

        pubsub.subscribe('a', 'testEvent', {
            callbackFunction (event) {
                event.prevent('d');
                expect(event.isPrevented('d')).to.be.true;
                subscriptionsExecuted.push('a');
            },
            once: true
        });

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'a',
            'b',
            'c'
        ]);
    });

    it('should pass configured event data to subscribers', () => {
        const data = {
                a: 'a',
                b: 'b',
                c: 'c'
            },
            pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineEvent('testEvent', {
            data
        });

        pubsub.on('testEvent', event => {
            expect(event).to.have.property('data', data);

            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'on'
        ]);
    });

    it('should merge configured event data with published event data', () => {
        const pubsub = Pubsub(),
            subscriptionsExecuted = [];

        pubsub.defineEvent('testEvent', {
            data: {
                a: 'a',
                b: 'b',
                c: 'c'
            }
        });

        pubsub.on('testEvent', event => {
            expect(event.data).to.deep.equal({
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

        expect(subscriptionsExecuted).to.deep.equal([
            'on'
        ]);
    });

    it('should accept event definitions as a config object', () => {
        const pubsub = Pubsub({
                events: {
                    testEvent: {
                        publishOnce: true
                    }
                }
            }),
            subscriptionsExecuted = [];

        pubsub.on('testEvent', () => {
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'on'
        ]);

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'on'
        ]);
    });

    it('should allow static event definitions', () => {
        const pubsub0 = Pubsub(),
            pubsub1 = Pubsub();

        let subscriptionsExecuted = [];

        pubsub0.defineEvent('testEvent0', {
            publishOnce: true
        });

        pubsub1.defineEvent('testEvent1', {
            publishOnce: true
        });

        Pubsub.defineEvent('testEvent2', {
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

        expect(subscriptionsExecuted).to.deep.equal([
            'on 00'
        ]);

        subscriptionsExecuted = [];

        pubsub1.publish('testEvent0');

        expect(subscriptionsExecuted).to.deep.equal([
            'on 10'
        ]);

        subscriptionsExecuted = [];

        pubsub0.publish('testEvent1');

        expect(subscriptionsExecuted).to.deep.equal([
            'on 01'
        ]);

        subscriptionsExecuted = [];

        pubsub1.publish('testEvent1');

        expect(subscriptionsExecuted).to.deep.equal([
            'on 11'
        ]);

        subscriptionsExecuted = [];

        pubsub0.publish('testEvent2');

        expect(subscriptionsExecuted).to.deep.equal([
            'on 02'
        ]);

        subscriptionsExecuted = [];

        pubsub1.publish('testEvent2');

        expect(subscriptionsExecuted).to.deep.equal([
            'on 12'
        ]);

        subscriptionsExecuted = [];

        pubsub0.publish('testEvent0');

        expect(subscriptionsExecuted).to.deep.equal([]);

        subscriptionsExecuted = [];

        pubsub1.publish('testEvent0');

        expect(subscriptionsExecuted).to.deep.equal([
            'on 10'
        ]);

        subscriptionsExecuted = [];

        pubsub0.publish('testEvent1');

        expect(subscriptionsExecuted).to.deep.equal([
            'on 01'
        ]);

        subscriptionsExecuted = [];

        pubsub1.publish('testEvent1');

        expect(subscriptionsExecuted).to.deep.equal([]);

        subscriptionsExecuted = [];

        pubsub0.publish('testEvent2');

        expect(subscriptionsExecuted).to.deep.equal([]);

        subscriptionsExecuted = [];

        pubsub1.publish('testEvent2');

        expect(subscriptionsExecuted).to.deep.equal([]);
    });

    it('should allow new subscriptions while the event is in progress', () => {
        const pubsub = Pubsub(),
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

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    it('should immediately execute late subscribers to once events if the event was not prevented', () => {
        const data = {
                a: 'a',
                b: 'b',
                c: 'c'
            },
            pubsub = Pubsub();

        let subscriptionsExecuted = [];

        pubsub.defineEvent([
            'testEvent0',
            'testEvent1'
        ], {
            publishOnce: true
        });

        pubsub.publish('testEvent0', data);

        expect(subscriptionsExecuted).to.deep.equal([]);

        pubsub.on('testEvent0', event => {
            expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('on');
        });

        pubsub.before('testEvent0', event => {
            expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('before');
        });

        expect(subscriptionsExecuted).to.deep.equal([
            'on',
            'before'
        ]);

        subscriptionsExecuted = [];

        pubsub.onceBefore('testEvent1', event => {
            event.prevent('on');
        });

        pubsub.publish('testEvent1', data);

        pubsub.on('testEvent1', event => {
            expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('on');
        });

        pubsub.before('testEvent1', event => {
            expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('before');
        });

        pubsub.after('testEvent1', event => {
            expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('after');
        });

        expect(subscriptionsExecuted).to.deep.equal([]);

        pubsub.defineEvent([
            'testEvent2',
            'testEvent3'
        ], {
            completeOnce: true
        });

        pubsub.publish('testEvent2', data);

        expect(subscriptionsExecuted).to.deep.equal([]);

        pubsub.on('testEvent2', event => {
            expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('on');
        });

        pubsub.before('testEvent2', event => {
            expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('before');
        });

        expect(subscriptionsExecuted).to.deep.equal([
            'on',
            'before'
        ]);

        subscriptionsExecuted = [];

        pubsub.onceBefore('testEvent3', event => {
            event.prevent('on');
        });

        pubsub.publish('testEvent3', data);

        pubsub.on('testEvent3', event => {
            expect(event).to.have.property('data', data);
            event.prevent('after');
            subscriptionsExecuted.push('on');
        });

        pubsub.before('testEvent3', event => {
            expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('before');
        });

        pubsub.after('testEvent3', event => {
            expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('after');
        });

        expect(subscriptionsExecuted).to.deep.equal([]);

        pubsub.publish('testEvent3', data);

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on'
        ]);

        subscriptionsExecuted = [];

        pubsub.on('testEvent3', event => {
            expect(event).to.have.property('data', data);
            event.prevent('after');
            subscriptionsExecuted.push('on');
        });

        pubsub.before('testEvent3', event => {
            expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('before');
        });

        pubsub.after('testEvent3', event => {
            expect(event).to.have.property('data', data);
            subscriptionsExecuted.push('after');
        });

        expect(subscriptionsExecuted).to.deep.equal([]);
    });

    // TODO: test late subscribers to once events when dispatch, distribution, and event is stopped

    it('should execute the default lifecycle function during the default stage', () => {
        const pubsub = Pubsub(),
            executedSubscribers = [];

        let calledDefaultFunction,
            eventObject;

        pubsub.defineEvent('testEvent', {
            defaultFunction (event) {
                expect(event).to.equal(eventObject);
                calledDefaultFunction = true;
            }
        });

        pubsub.after('testEvent', event => {
            expect(calledDefaultFunction).to.be.true;
            expect(event).to.equal(eventObject);
            executedSubscribers.push('after');
        });

        pubsub.before('testEvent', event => {
            expect(calledDefaultFunction).to.be.undefined;
            eventObject = event;
            executedSubscribers.push('before');
        });

        pubsub.on('testEvent', event => {
            expect(calledDefaultFunction).to.be.undefined;
            expect(event).to.equal(eventObject);
            executedSubscribers.push('on');
        });

        pubsub.publish('testEvent');

        expect(executedSubscribers).to.deep.equal([
            'before',
            'on',
            'after'
        ]);
    });

    it('should execute the dispatch stopped lifecycle function when dispatch is stopped', () => {
        const distributor0 = Pubsub(),
            distributor0a = Pubsub(),
            distributor0b = Pubsub(),
            distributor1 = Pubsub(),
            distributor1a = Pubsub(),
            distributor1b = Pubsub(),
            distributor2 = Pubsub(),
            distributor2a = Pubsub(),
            distributor2b = Pubsub(),
            publisher = Pubsub(),
            subscriptionsExecuted = [];

        let calledDispatchStoppedFunction,
            eventObject;

        publisher.defineEvent('testEvent', {
            dispatchStoppedFunction (event) {
                expect(event).to.equal(eventObject);
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
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                if (eventObject) {
                    expect(event).to.equal(eventObject);
                } else {
                    eventObject = event;
                }
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                event.stopDispatch();
                expect(event.dispatchStopped).to.be.true;
                if (pubsub === publisher) {
                    expect(calledDispatchStoppedFunction).to.be.undefined;
                } else {
                    expect(calledDispatchStoppedFunction).to.be.true;
                }
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledDispatchStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
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

    it('should execute the distribution stopped lifecycle function when distribution is stopped', () => {
        const distributor0 = Pubsub(),
            distributor0a = Pubsub(),
            distributor0b = Pubsub(),
            distributor1 = Pubsub(),
            distributor1a = Pubsub(),
            distributor1b = Pubsub(),
            distributor2 = Pubsub(),
            distributor2a = Pubsub(),
            distributor2b = Pubsub(),
            publisher = Pubsub(),
            subscriptionsExecuted = [];

        let calledDistributionStoppedFunction,
            eventObject;

        publisher.defineEvent('testEvent', {
            distributionStoppedFunction (event) {
                expect(event).to.equal(eventObject);
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
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                if (eventObject) {
                    expect(event).to.equal(eventObject);
                } else {
                    eventObject = event;
                }
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                event.stopDistribution();
                expect(event.distributionStopped).to.be.true;
                expect(calledDistributionStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledDistributionStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledDistributionStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledDistributionStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
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

    it('should execute the event stopped lifecycle function when the event is stopped', () => {
        const distributor0 = Pubsub(),
            distributor0a = Pubsub(),
            distributor0b = Pubsub(),
            distributor1 = Pubsub(),
            distributor1a = Pubsub(),
            distributor1b = Pubsub(),
            distributor2 = Pubsub(),
            distributor2a = Pubsub(),
            distributor2b = Pubsub(),
            publisher = Pubsub(),
            subscriptionsExecuted = [];

        let calledEventStoppedFunction,
            eventObject;

        publisher.defineEvent('testEvent', {
            eventStoppedFunction (event) {
                expect(event).to.equal(eventObject);
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
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 0`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 1`);
            });

            pubsub.after('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} after 2`);
            });

            pubsub.before('testEvent', event => {
                if (eventObject) {
                    expect(event).to.equal(eventObject);
                } else {
                    eventObject = event;
                }
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                event.stopEvent();
                expect(event.eventStopped).to.be.true;
                expect(calledEventStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 0`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledEventStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 1`);
            });

            pubsub.before('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledEventStoppedFunction).to.be.undefined;
                subscriptionsExecuted.push(`${name} before 2`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 0`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 1`);
            });

            pubsub.on('testEvent', event => {
                expect(event).to.equal(eventObject);
                expect(event).to.have.property('distributor', pubsub);
                expect(event).to.have.property('publisher', publisher);
                expect(calledEventStoppedFunction).to.be.true;
                subscriptionsExecuted.push(`${name} on 2`);
            });
        });

        publisher.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
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

        expect(calledEventStoppedFunction).to.be.true;
    });

    it('should execute the prevented lifecycle function when the event is prevented', () => {
        const pubsub = Pubsub(),
            subscriptionsExecuted = [];

        let calledPreventedFunction,
            eventObject;

        pubsub.defineEvent('testEvent', {
            preventedFunction (event) {
                expect(event).to.equal(eventObject);
                calledPreventedFunction = true;
            }
        });

        pubsub.before('testEvent', event => {
            eventObject = event;
            event.prevent('on');
            expect(event.isPrevented('on')).to.be.true;
            expect(calledPreventedFunction).to.be.undefined;
            subscriptionsExecuted.push('before');
        });

        pubsub.on('testEvent', event => {
            expect(event).to.equal(eventObject);
            expect(event.defaultIsPrevented()).to.be.true;
            expect(calledPreventedFunction).to.be.true;
            subscriptionsExecuted.push('on');
        });

        pubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'before'
        ]);

        expect(calledPreventedFunction).to.be.true;
    });

    it('should execute the subscribed lifecycle function when the event is subscribed to', () => {
        let calledSubscribedFunction,
            subscriptionExecuted;

        const pubsub = Pubsub(),
            subscriptionConfig = {
                callbackFunction () {
                    subscriptionExecuted = true;
                }
            };

        pubsub.defineEvent('testEvent', {
            subscribedFunction ({
                config,
                dispatcher
            }) {
                expect(config).to.have.property('callbackFunction', subscriptionConfig.callbackFunction);
                expect(config).to.have.property('host', pubsub);
                expect(config).to.have.property('publicSubscription', true);
                expect(config).to.have.property('stageName', 'on');
                expect(config.state).to.be.an('object');
                expect(dispatcher).to.be.an.instanceOf(Dispatcher);
                calledSubscribedFunction = true;
            }
        });

        {
            const subscription = pubsub.subscribe('on', 'testEvent', subscriptionConfig);

            expect(calledSubscribedFunction).to.be.true;

            pubsub.publish('testEvent');

            expect(subscriptionExecuted).to.be.true;

            subscription.unsubscribe();
            subscriptionExecuted = false;

            pubsub.publish('testEvent');

            expect(subscriptionExecuted).to.be.false;
        }
    });

    it('should return the subscription object returned by the subscribed lifecycle function', () => {
        const customSubscription = {},
            pubsub = Pubsub();

        pubsub.defineEvent('testEvent', {
            subscribedFunction () {
                return customSubscription;
            }
        });

        {
            const subscription = pubsub.subscribe('on', 'testEvent', () => void null);

            expect(subscription).to.equal(customSubscription);
        }
    });

    it('should execute the unsubscribed lifecycle function when the event is unsubscribed from', () => {
        let calledUnsubscribedFunction,
            subscriptionExecuted;

        const pubsub = Pubsub(),
            subscriptionConfig = {
                callbackFunction () {
                    subscriptionExecuted = true;
                }
            };

        pubsub.defineEvent('testEvent', {
            unsubscribedFunction ({
                config,
                dispatcher
            }) {
                expect(config).to.have.property('callbackFunction', subscriptionConfig.callbackFunction);
                expect(config).to.have.property('host', pubsub);
                expect(config).to.have.property('publicSubscription', true);
                expect(config).to.have.property('stageName', 'on');
                expect(config).to.have.property('state').that.is.an('object');
                expect(dispatcher).to.be.an.instanceOf(Dispatcher);
                calledUnsubscribedFunction = true;
            }
        });

        {
            const subscription = pubsub.subscribe('on', 'testEvent', subscriptionConfig);

            pubsub.publish('testEvent');

            expect(subscriptionExecuted).to.be.true;

            subscription.unsubscribe();

            expect(calledUnsubscribedFunction).to.be.true;

            calledUnsubscribedFunction = false;
            subscriptionExecuted = false;

            subscriptionConfig.callbackFunction = event => {
                event.unsubscribe();
                expect(calledUnsubscribedFunction).to.be.true;
                subscriptionExecuted = true;
            };

            pubsub.subscribe('on', 'testEvent', subscriptionConfig);
            pubsub.publish('testEvent');

            expect(subscriptionExecuted).to.be.true;
        }
    });

    it('should prevent unsubscription when the unsubscribed lifecycle function returns false', () => {
        let calledUnsubscribedFunction,
            subscriptionExecuted;

        const pubsub = Pubsub(),
            subscriptionConfig = {
                callbackFunction () {
                    subscriptionExecuted = true;
                }
            };

        pubsub.defineEvent([
            'testEvent0',
            'testEvent1'
        ], {
            unsubscribedFunction ({
                config,
                dispatcher
            }) {
                expect(config).to.have.property('callbackFunction', subscriptionConfig.callbackFunction);
                expect(config).to.have.property('host', pubsub);
                expect(config).to.have.property('publicSubscription', true);
                expect(config).to.have.property('stageName', 'on');
                expect(config).to.have.property('state').that.is.an('object');
                expect(dispatcher).to.be.an.instanceOf(Dispatcher);
                calledUnsubscribedFunction = true;
                return false;
            }
        });

        {
            const subscription = pubsub.subscribe('on', 'testEvent0', subscriptionConfig);

            pubsub.publish('testEvent0');

            expect(subscriptionExecuted).to.be.true;
            expect(subscription.unsubscribe()).to.be.false;
            expect(calledUnsubscribedFunction).to.be.true;
            expect(subscription.subscribed).to.be.true;

            subscriptionExecuted = false;
            pubsub.publish('testEvent0');
            expect(subscriptionExecuted).to.be.true;

            calledUnsubscribedFunction = false;
            subscriptionExecuted = false;

            subscriptionConfig.callbackFunction = event => {
                expect(event.unsubscribe()).to.be.false;
                event.unsubscribe();
                expect(calledUnsubscribedFunction).to.be.true;
                subscriptionExecuted = true;
            };

            pubsub.subscribe('on', 'testEvent1', subscriptionConfig);
            pubsub.publish('testEvent1');
            expect(subscriptionExecuted).to.be.true;

            calledUnsubscribedFunction = false;
            subscriptionExecuted = false;
            pubsub.publish('testEvent0');
            expect(subscriptionExecuted).to.be.true;
        }
    });

    it('should chain static event configurations', () => {
        const PubsubA = make(Pubsub, {
                _init (...args) {
                    return Reflect.apply(Pubsub.prototype._init, this, args);
                }
            }, {
                _events: {
                    testEventA: {
                        data: {
                            a: 'a'
                        }
                    }
                }
            }),
            PubsubB = make(PubsubA, {
                _init (...args) {
                    return Reflect.apply(PubsubA.prototype._init, this, args);
                }
            }, {
                _events: {
                    testEventB: {
                        data: {
                            b: 'b'
                        }
                    }
                }
            }),
            PubsubC = make(PubsubB, {
                _init (...args) {
                    return Reflect.apply(PubsubB.prototype._init, this, args);
                }
            }, {
                _events: {
                    testEventA: {
                        data: {
                            c: 'c'
                        }
                    },
                    testEventC: {
                        data: {
                            c: 'c'
                        }
                    }
                }
            }),
            pubsub = PubsubC(),
            subscriptionsExecuted = [];

        pubsub.on('testEventA', event => {
            expect(event).to.have.property('data').that.deep.equals({
                c: 'c'
            });
            subscriptionsExecuted.push('a');
        });

        pubsub.on('testEventB', event => {
            expect(event).to.have.property('data').that.deep.equals({
                b: 'b'
            });
            subscriptionsExecuted.push('b');
        });

        pubsub.on('testEventC', event => {
            expect(event).to.have.property('data').that.deep.equals({
                c: 'c'
            });
            subscriptionsExecuted.push('c');
        });

        pubsub
            .publish('testEventA')
            .publish('testEventB')
            .publish('testEventC');

        expect(subscriptionsExecuted).to.deep.equal([
            'a',
            'b',
            'c'
        ]);
    });

    it('should allow method names as late bound subscription callback functions', () => {
        const subscriptionsExecuted = [],

            customMethodSymbol = Symbol('customMethodSymbol'),
            CustomPubsub = make(Pubsub, {
                _beforeTestEvent () {
                    subscriptionsExecuted.push('before');
                },
                [customMethodSymbol] () {
                    subscriptionsExecuted.push('on');
                },
                _init (...args) {
                    return Reflect.apply(Pubsub.prototype._init, this, args);
                }
            }),
            customPubsub = CustomPubsub();

        customPubsub.before('testEvent', '_beforeTestEvent');
        customPubsub.on('testEvent', customMethodSymbol);

        customPubsub.publish('testEvent');

        customPubsub._beforeTestEvent = function () {
            expect(this).to.equal(customPubsub);
            subscriptionsExecuted.push('different before');
        };

        customPubsub[customMethodSymbol] = function () {
            expect(this).to.equal(customPubsub);
            subscriptionsExecuted.push('different on');
        };

        customPubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'different before',
            'different on'
        ]);
    });

    it('should allow method names as late bound once subscription callback functions', () => {
        const subscriptionsExecuted = [],

            customMethodSymbol = Symbol('customMethodSymbol'),
            CustomPubsub = make(Pubsub, {
                _beforeTestEvent () {
                    subscriptionsExecuted.push('before');
                },
                [customMethodSymbol] () {
                    subscriptionsExecuted.push('on');
                },
                _init (...args) {
                    return Reflect.apply(Pubsub.prototype._init, this, args);
                }
            }),
            customPubsub = CustomPubsub();

        customPubsub.onceBefore('testEvent', '_beforeTestEvent');
        customPubsub.onceOn('testEvent', customMethodSymbol);

        customPubsub.publish('testEvent');

        customPubsub.onceBefore('testEvent', '_beforeTestEvent');
        customPubsub.onceOn('testEvent', customMethodSymbol);

        customPubsub._beforeTestEvent = function () {
            expect(this).to.equal(customPubsub);
            subscriptionsExecuted.push('different before');
        };

        customPubsub[customMethodSymbol] = function () {
            expect(this).to.equal(customPubsub);
            subscriptionsExecuted.push('different on');
        };

        customPubsub.publish('testEvent');

        expect(subscriptionsExecuted).to.deep.equal([
            'before',
            'on',
            'different before',
            'different on'
        ]);
    });

    it('should not error if late bound subscription callback functions are invalid', () => {
        const pubsub = Pubsub();

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

    it('should work as a mixin', () => {
        const PubsubA = make([
                Pubsub
            ], {
                _init (...args) {
                    return Reflect.apply(Pubsub.prototype._init, this, args);
                }
            }, {
                _events: {
                    testEventA: {
                        data: {
                            a: 'a'
                        }
                    }
                },
                _init (...args) {
                    return Reflect.apply(Pubsub._init, this, args);
                }
            }),
            PubsubB = make(PubsubA, {
                _init (...args) {
                    return Reflect.apply(PubsubA.prototype._init, this, args);
                }
            }, {
                _events: {
                    testEventB: {
                        data: {
                            b: 'b'
                        }
                    }
                }
            }),
            PubsubC = make(PubsubB, {
                _init (...args) {
                    return Reflect.apply(PubsubB.prototype._init, this, args);
                }
            }, {
                _events: {
                    testEventA: {
                        data: {
                            c: 'c'
                        }
                    },
                    testEventC: {
                        data: {
                            c: 'c'
                        }
                    }
                }
            }),
            pubsub = PubsubC(),
            subscriptionsExecuted = [];

        pubsub.on('testEventA', event => {
            expect(event).to.have.property('data').that.deep.equals({
                c: 'c'
            });
            subscriptionsExecuted.push('a');
        });

        pubsub.on('testEventB', event => {
            expect(event).to.have.property('data').that.deep.equals({
                b: 'b'
            });
            subscriptionsExecuted.push('b');
        });

        pubsub.on('testEventC', event => {
            expect(event).to.have.property('data').that.deep.equals({
                c: 'c'
            });
            subscriptionsExecuted.push('c');
        });

        pubsub
            .publish('testEventA')
            .publish('testEventB')
            .publish('testEventC');

        expect(subscriptionsExecuted).to.deep.equal([
            'a',
            'b',
            'c'
        ]);
    });
});
