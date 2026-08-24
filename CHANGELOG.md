# isotropic-pubsub Changelog

## 0.17.0 - 2026-08-23

### Breaking changes

**A bulk `once` subscription is now a single subscription that fires once in total, not once per event.** This is the change most likely to alter the behavior of existing code.

Subscribing to several events at once with a `once` method previously created independent subscriptions that each fired once. Subscribing to three events meant up to three calls. The subscription is now treated as a group: the first event that arrives runs the callback function and unsubscribes the whole group, including the other event names.

```javascript
pubsub.onceOn([
    'a',
    'b'
], event => console.log(event.name));

pubsub.publish('a');
pubsub.publish('b');

// Before: logs 'a', then logs 'b'
// After:  logs 'a'
```

This applies to every bulk form: an array of event names, an event-name-to-config object, and the protected `_onceOn` / `_onceBefore` / `_onceAfter` counterparts.

Two things that look similar are unaffected. Separate `once` calls remain independent, because each is its own subscription:

```javascript
pubsub.onceOn('a', callbackFunctionA);
pubsub.onceOn('b', callbackFunctionB);

// Both still fire, exactly as before.
```

And several callback functions bound to the same event in one bulk call all still run for that event, because they are one group observing one occurrence:

```javascript
pubsub.onceOn('a', [
    callbackFunctionOne,
    callbackFunctionTwo
]);

// Both still run when 'a' publishes.
```

#### Migration

Audit every bulk `once` subscription that spans more than one event name. For each, decide which of the two meanings you intended:

```javascript
// Intent: "tell me when the first of these happens", now the default
pubsub.onceOn([
    'succeeded',
    'failed'
], event => finish(event));

// Intent: "tell me once about each of these"
// Split into separate subscriptions to keep the old behavior
pubsub.onceOn('succeeded', event => recordSuccess(event));
pubsub.onceOn('failed', event => recordFailure(event));
```

Non-`once` bulk subscriptions are unchanged, so a bulk `on` spanning several events still fires for every one of them.

**The protected event-state property was renamed from `_eventState` to `_eventStateByEventName`,** and the per-event state object's `subscriptions` property was renamed to `subscriptionMapByStageName`. Both are internal, but a subclass or a custom `Dispatcher` that reached into them will need updating. The shapes are otherwise the same: an event-name-keyed object of states, each holding a stage-name-keyed object of `Map`s.

### Added

**`until(config)` awaits an event and resolves with a snapshot of it.** It subscribes once, resolves when the event completes, and cleans up after itself. Given a string or symbol it awaits that event at the `after` stage:

```javascript
const {
    data
} = await pubsub.until('ready');
```

The config form accepts `eventName`, `filterFunction`, `stageName`, and the other subscription properties, plus:

- `details` (Object): merged into the details of any error the wait produces.
- `reject` (String, Symbol, Object, or iterable of any of those): events that reject the promise instead of resolving it. The rejection is an `isotropic-error` named `RejectError` carrying the offending event's snapshot in `details.eventSnapshot`.
- `signal` (AbortSignal): cancels the wait.
- `silent` (Boolean): cancel without rejecting.
- `subject` (String): names the operation in error messages. Defaults to `'Event'`.
- `timeout` (Number): rejects with a `TimeoutError` if the event has not arrived in time.

```javascript
try {
    await pubsub.until({
        eventName: 'connected',
        reject: 'connectionError',
        subject: 'Connection',
        timeout: 30000
    });
} catch (error) {
    // Error: Connection rejected, or Error: Connection timed out
}
```

The returned promise carries `cancel(config)`, `canceled`, `subscribed`, `unsubscribe()`, and `Symbol.dispose`, so a pending wait can be abandoned without leaking a subscription. A protected `_until` is available for events that do not allow public subscription.

Because a bulk `once` subscription is now a group, `until` can race several events with a single call, and awaiting a `publishOnce` event that has already published resolves immediately rather than waiting forever.

**A `filterFunction` on any subscription config decides whether the callback function runs for a given event.** It receives the event and runs before the callback function. Returning a falsy value skips the callback function *without consuming a `once` subscription*, so a one-time subscription stays in place until the event it actually wants arrives:

```javascript
pubsub.onceOn('statusChange', {
    callbackFunction: event => console.log('Shipped'),
    filterFunction: event => event.data.newValue === 'shipped',
    once: true
});
```

This is what makes "wait for the *right* event" expressible, rather than settling for the next one. It composes: a `filterFunction` given on a bulk config and one given on an individual config both run, and both must pass.

**`getOnceEventSnapshot(eventName)` reads the retained state of a `completeOnce` or `publishOnce` event.** It returns a frozen snapshot if the event has already published and `null` otherwise, which makes "has this happened yet?" answerable without subscribing. The public method returns `null` for events that do not allow public subscription. The protected `_getOnceEventSnapshot` has no such restriction.

**An `event.snapshot` getter** returns a frozen plain object with `completed`, `data`, `distributor`, `name`, `publisher`, and `stageName`. This is what `until` resolves with, and it is safe to retain after dispatch has finished, unlike the live event object.

**Two construction config properties.** `distributors` registers distributors at construction time, equivalent to calling `addDistributor`. `subscribe` takes an event-name-keyed object of subscription configs, so an instance can be built with its subscriptions already in place:

```javascript
const pubsub = _Pubsub({
    distributors: [
        parent
    ],
    subscribe: {
        change: event => console.log(event.data),
        error: {
            callbackFunction: handleError,
            once: true,
            stageName: 'before'
        }
    }
});
```

Each value may be a callback function, a config object, or an array of either. `stageName` defaults to `'on'`.

### Fixed

**Cyclic distributor graphs no longer hang or crash.** Two instances registered as distributors of each other sent `_getDistributionPath` into an unbounded loop, which surfaced as `RangeError: Invalid array length` once the distributor array outgrew its limit. The distribution path is now built with a visited check, so a cycle is traversed once and each participant is notified exactly once.

```javascript
const config = {
        pubsub: {
            change: {
                allowPublicPublish: true,
                distributable: true
            }
        }
    },
    a = _Pubsub(config),
    b = _Pubsub(config);

a.addDistributor(b);
b.addDistributor(a);

b.publish('change'); // Before: RangeError. After: both are notified.
```

**Calling `destroy()` on an already-destroyed instance is now a no-op.** It previously threw a `TypeError` while trying to publish through state that destruction had already torn down. `destroy()` now returns the instance unchanged when `destroyed` is already true, which makes destruction idempotent and makes `Symbol.dispose` safe to reach twice.

**`Subscription.subscribed` always returns a boolean.** It previously returned whatever the underlying config held, which for a refused subscription was `undefined` rather than `false`. Truthiness checks are unaffected. Strict comparisons against `false` now work.

**A bulk subscription's `unsubscribe()` returns `true`** rather than `undefined`, matching the single-subscription form so the result can be tested consistently.

### Changed

- `addDistributor` now uses a `once` subscription with a `filterFunction` to watch for a distributor's `destroyComplete`, replacing a manual identity check and self-unsubscribe inside the callback function. Behavior is unchanged.
- Subscription methods are installed only when the prototype does not already define a function of that name. Previously the check was on truthiness, so a non-function property of the same name would have been left in place and then called.
- `isotropic-error` and `isotropic-timeout-cancel` are new runtime dependencies, supporting `until`'s rejection and cancellation. `isotropic-later` is a new dev dependency.
- Recommends `node ^26.7.0` / `npm ^11.19.0`.
- `repository` now uses npm's preferred object form with explicit `type` and `url` properties rather than the `github:` shorthand. This is package metadata only.

### Internal

- The bulk subscribe, bulk unsubscribe, publish, subscribe, `until`, and once-snapshot method bodies moved from module-scoped factory functions into static methods (`_createBulkSubscribeMethod`, `_createPublishMethod`, `_createSubscribeMethod`, `_createUntilMethod`, `_createGetOnceEventSnapshotMethod`, and friends), so a subclass can override how they are built.
- `Pubsub` now mixes in `CallbackFunctionHost`, giving it the same string/symbol/function callback resolution that `Dispatcher` uses. This is what lets a `filterFunction` be given as a method name.
- The dispatcher tracks the subscription object itself during dispatch instead of binding a fresh unsubscribe closure per subscription per event, which removes an allocation from the inner dispatch loop. `event.unsubscribe()` is unchanged.
- The README was substantially expanded, with new sections on filtering, bulk subscription semantics, asynchronous subscriptions, event snapshots, and construction configuration.
- Test suite expanded from 66 to 190 tests, holding 100% statement, branch, function, and line coverage.

## 0.16.0 - 2026-07-15

### Breaking changes

**Constructors are now named.** `Pubsub`, `Dispatcher`, `Event`, `Subscription`, and the new `CallbackFunctionHost` are built with `isotropic-make`'s name parameter, so each carries a real `name` and instances carry a matching `Symbol.toStringTag`. Previously all were anonymous. Snapshot tests and diagnostic output that captured the empty name will differ.

**A new module, `lib/callback-function-host.js`, was added.** The `_callCallbackFunction` helper resolves a callback given as a function, a string, or a symbol against a host object. It was moved out of `Dispatcher` into a `CallbackFunctionHost` base that `Dispatcher` now mixes in. Behavior is unchanged, but if you subclassed `Dispatcher` and overrode `_callCallbackFunction`, it now lives one level further up the chain.

**The package now ships source directly instead of a Babel build.** Source moved from `js/` to `lib/`, and `lib/` contains six modules rather than five.

### Added

**A `hasDistributor(distributor)` method** on `Pubsub`, to test whether a given object is registered as a distributor without inspecting internals.

#### Migration

For ordinary use: `publish`, `subscribe`, `before`/`on`/`after`, and `destroy` nothing changes. Act only if you subclassed `Dispatcher` and overrode `_callCallbackFunction`, or if you assert on constructor names.

### Changed

- The dispatcher-definition helpers were restructured and the unsubscription path simplified with optional chaining. No behavior change.
- `description` and `keywords` updated for npm discoverability.
- Recommends `node ^26.5.0` / `npm ^11.17.0`.

### Internal

- Test suite migrated from Mocha to the built-in `node --test` runner.
- The Babel toolchain and build scripts were removed.
- `isotropic-dev-dependencies` updated to `~0.4.0`.
- All Isotropic dependencies bumped to their latest releases.

## 0.15.0 - 2025-04-10

### Breaking changes

**The `default` stage was renamed to `complete`, and `defaultFunction` became `completeFunction`.**

Every event declaration that names a built-in handler must be updated:

```javascript
// Before
_pubsub: {
    save: {
        defaultFunction: '_eventSave'
    }
}

// After
_pubsub: {
    save: {
        completeFunction: '_eventSave'
    }
}
```

The stage is also renamed anywhere a stage name is used as a value: `event.prevent('default')` becomes `event.prevent('complete')`, and likewise for `event.isPrevented`. Both methods now default their `stageName` argument to `'complete'`, so bare `event.prevent()` and `event.isPrevented()` behave as before.

The lifecycle is unchanged in shape: `before`, `on`, `complete`, `after`. Only the third stage's name changed.

**`allowPublicUnsubscription` now defaults to `false`.** Previously public unsubscription was permitted unless explicitly disabled. Now it must be explicitly enabled:

```javascript
_pubsub: {
    save: {
        allowPublicUnsubscription: true
    }
}
```

External code calling `unsubscribe({ publicUnsubscription: true })` against an event that has not opted in is now refused, and the subscription stays active. Subscriptions unsubscribing themselves from within a handler are unaffected.

**A `subscribeFunction` may now return `false` to reject a subscription.** The subscribe lifecycle hook is now consulted for a rejection. If your existing `subscribeFunction` happens to return a falsy value, subscriptions it previously allowed will now be refused. Ensure yours returns a non-`false` value (or nothing at all). Only an explicit `false` rejects.

**Extra module exports were removed.** The module previously exported `defaultSymbol`, `Dispatcher`, `Event`, and `Subscription` as named exports alongside the default. Those named exports are gone. Import the corresponding modules directly:

```javascript
// Before
import _Pubsub, {
    Dispatcher as _Dispatcher
} from 'isotropic-pubsub';

// After
import _Dispatcher from 'isotropic-pubsub/lib/dispatcher.js';
import _Pubsub from 'isotropic-pubsub';
```

#### Migration

1. Rename `defaultFunction` to `completeFunction` in every event declaration.
2. Replace the stage name `'default'` with `'complete'` wherever it appears as a value.
3. Add `allowPublicUnsubscription: true` to any event that external code unsubscribes from.
4. Replace named imports from `isotropic-pubsub` with deep imports.
5. Check that every `subscribeFunction` does not accidentally return `false`.

### Changed

- The lifecycle functions were reworked so that the complete-stage handler is invoked as part of stage dispatch rather than as a special-cased default action.
- A comprehensive README was added.
- `eslint` pinned at `~9.8.0` as a direct dev dependency.
- `isotropic-dev-dependencies` bumped to `~0.3.1`.

## 0.14.0 - 2024-07-30

### Breaking changes

**The event configuration property was renamed from `_events` to `_pubsub`.**

```javascript
// Before
_events: {
    save: { /* ... */ }
}

// After
_pubsub: {
    save: { /* ... */ }
}
```

**`allowPublicPublish` now defaults to `false`.** Previously any event could be published from outside the instance unless explicitly disabled. Events must now opt in:

```javascript
_pubsub: {
    save: {
        allowPublicPublish: true
    }
}
```

Note the anonymous default dispatcher does set `allowPublicPublish: true`, so ad-hoc events declared implicitly remain publicly publishable.

**`defineEvent` was renamed to `defineDispatcher`,** part of a broader terminology change from "events" to "dispatchers" for the objects that manage an event's configuration and subscriptions. The internal `_events` map became `_dispatcherByEventName`.

**The package is now an ES module.** `"type": "module"` was added to `package.json`. CommonJS consumers can no longer `require('isotropic-pubsub')`.

#### Migration

1. Rename `_events` to `_pubsub` in every class, subclass, and mixin.
2. Rename `defineEvent` calls to `defineDispatcher`.
3. Add `allowPublicPublish: true` to every event published from outside its own instance.
4. Switch `require` to `import`.

### Changed

- Own-property checks migrated to `Object.hasOwn`.
- ESLint moved to flat config.
- Coverage tooling switched from `nyc` to `c8`.
- `repository` given an explicit `github:` prefix.
- Recommends `node ^22.5.1` / `npm ^10.8.2`.

## 0.13.0 - 2021-02-22

### Changed

- The entire dev toolchain was replaced by a single `isotropic-dev-dependencies` dev dependency.
- Recommends `node ^14.15.5` / `npm ^7.5.4`.

No runtime behavior changed in this release.

## 0.12.0 - 2020-07-27

### Changed

- A `files` allowlist was added so only `lib` is published.
- `.npmignore` was removed.
- Dependency refresh: ESLint 7, Mocha 8, nyc 15, Babel 7.10.
- Recommends `node ^12.18.3` / `npm ^6.14.6`.

No runtime behavior changed in this release.

## 0.11.0 - 2019-05-10

### Added

**A configurable lifecycle host.** A `lifecycleHost` option on an event configuration selects the object against which lifecycle functions such as `completeFunction` and the publish, subscribe, and unsubscribe hooks are resolved and invoked. Previously they were always called against the pubsub instance.

### Fixed

The default host for a subscription was corrected, so a subscription's callback resolves against the intended object rather than falling back incorrectly.

### Changed

- Added the `isotropic` keyword to `package.json`.
- Lint cleanup.
- Dependency bumps.

## 0.10.2 - 2019-05-08

### Breaking changes

**The `core-js` dependency was removed.** The package no longer pulls a polyfill runtime into your dependency tree. If you were relying on `isotropic-pubsub` to transitively provide `core-js` polyfills in an older environment, you must install it yourself.

## 0.10.0 - 2019-05-08

### Changed

- Dev dependency refresh (Babel 7.4, Mocha 6, nyc 14, ESLint 5.16).
- Recommends `node ^10.15.3` / `npm ^6.4.1`.

No runtime behavior changed in this release.

## 0.9.0 - 2019-02-18

### Changed

- Lint cleanup.
- Dependency refresh.
- Recommends `node ^10.15.1` / `npm ^6.4.1`.

No runtime behavior changed in this release.

## 0.8.0 - 2018-11-25

### Changed

- Migrated from Babel 6 to Babel 7, and from `babel-istanbul` to `nyc` for coverage.
- Dropped the `nsp` security check.
- Internal simplification of the dispatcher and pubsub implementations.
- Recommends `node ^10.13.0` / `npm ^6.4.1`.

## 0.7.0 - 2017-09-12

### Breaking changes

**The `babel-runtime` runtime dependency was removed.**

### Changed

- ESLint configuration moved to the `plugin:isotropic/isotropic` shared config.
- Internal cleanup of the event and pubsub implementations.
- Recommends `node ^8.4.0` / `npm ^5.4.1`.

## 0.6.0 - 2017-02-05

### Changed

- Dependency bumps.
- Recommends `node ^6.9.5` / `npm ^4.1.2`.

No runtime behavior changed in this release.

## 0.5.0 - 2017-01-08

### Added

- **A `destroyComplete` event**, published after destruction finishes, complementing the `destroy` event added in 0.4.0.
- **Arguments may be passed to `destroy`**, and are carried through to the destroy events.
- **A dispatcher instance may be supplied directly as an event configuration**, rather than only a plain configuration object.

### Fixed

- All subscriptions are now removed when a pubsub instance is destroyed, so a destroyed object no longer retains references to its subscribers.
- Anonymous and predefined events now work correctly when the pubsub is applied as a mixin.
- Distributing an event no longer mutates the distributor's own event state.

### Changed

- Recommends `node ^6.9.4` / `npm ^4.1.1`.

## 0.4.0 - 2016-12-21

### Added

- **A `destroy` event**, so destruction becomes observable and preventable like any other event.
- **Bulk unsubscription** via `bulkUnsubscribe`, complementing the existing `bulkSubscribe`.

### Fixed

- **Subscription-method redefinition in a parent class** is now handled correctly.
- **Static event redefinition in a parent class** now works when the child class declares no static events of its own. Previously the parent's declarations were lost.
- Method ordering corrected.

## 0.3.0 - 2016-11-28

### Changed

- The deprecated `prepublish` script was replaced by `prepare` and `prepublishOnly`.
- Source reformatted to comply with updated lint rules. No semantic change.
- Lint target raised to ECMAScript 2017.
- Recommends `node ^6.9.1` / `npm ^4.0.2`.

## 0.2.0 - 2016-07-14

### Changed

- `babel-runtime` bumped to `~6.9.1`.
- Isotropic dependencies bumped to `~0.2.0`.

No runtime behavior changed in this release.

## 0.1.0 - 2016-05-02

Initial release.

- Default export is a `Pubsub` base constructor providing a staged, preventable publish/subscribe lifecycle, along with `Dispatcher`, `Event`, and `Subscription` as named exports.
- Every event flows through four stages: `before`, `on`, `default`, and `after`. `before`, `on`, and `after` are available for subscription and the `default` stage is reserved for the event's built-in action.
- Subscribers receive an `Event` object exposing the published `data` plus control methods to prevent the default stage and to stop dispatch or distribution.
- Events are declared per class through an `_events` object, inherited and merged down the prototype chain via `isotropic-property-chainer`, so a subclass can add or refine events without restating its parent's.
- Supports event distribution to other pubsub objects, one-time subscriptions, subscription filtering, bulk subscription, and callbacks given as functions, strings, or symbols resolved against a host object.
- Depends on `isotropic-make`, `isotropic-property-chainer`, `core-js`, and `babel-runtime`.
