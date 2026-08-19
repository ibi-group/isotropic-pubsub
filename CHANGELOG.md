# Changelog

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
