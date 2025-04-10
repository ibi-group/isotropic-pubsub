# isotropic-pubsub

[![npm version](https://img.shields.io/npm/v/isotropic-pubsub.svg)](https://www.npmjs.com/package/isotropic-pubsub)
[![License](https://img.shields.io/npm/l/isotropic-pubsub.svg)](https://github.com/ibi-group/isotropic-pubsub/blob/main/LICENSE)
![](https://img.shields.io/badge/tests-passing-brightgreen.svg)
![](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)

A powerful and flexible event system for JavaScript applications that implements the publish-subscribe pattern with advanced lifecycle features.

## Why Use This?

- **Flexible Event Architecture**: Comprehensive event lifecycle with before, on, and after stages
- **Event Distribution**: Distribute events through object hierarchies
- **Fine-Grained Control**: Prevent, stop, or modify events during their lifecycle
- **Customizable Behavior**: Configure dispatchers with custom behavior for each event type
- **Multiple Integration Options**: Use as standalone, base class, or mixin
- **Chainable API**: Fluent interface for elegant code

## Installation

```bash
npm install isotropic-pubsub
```

## Basic Usage

```javascript
import _Pubsub from 'isotropic-pubsub';

{
    // Create a pubsub instance
    const pubsub = _Pubsub();

    // Subscribe to an event
    pubsub.on('userLoggedIn', event => {
        console.log(`User logged in: ${event.data.username}`);
    });

    // Publish an event with data
    pubsub.publish('userLoggedIn', {
        username: 'john.doe'
    });
}
```

## Key Concepts

### Event Lifecycle

Events in isotropic-pubsub flow through distinct stages:

1. **Before Stage**: Runs first - subscribers can prevent the event from continuing
2. **On Stage**: Main event processing - the default stage for most subscribers
3. **Complete Stage**: Special internal stage that executes after the "on" stage
4. **After Stage**: Final stage - for cleanup or logging

### Subscription Stages

You can subscribe to any stage of an event's lifecycle:

```javascript
// Before stage - can prevent or modify the event
pubsub.before('save', event => {
    if (!event.data.isValid) {
        event.prevent(); // Prevents the complete stage
    }
});

// On stage - main event handling
pubsub.on('save', event => {
    console.log('Saving data:', event.data);
});

// After stage - logging, cleanup
pubsub.after('save', event => {
    console.log('Save completed at:', Date.now());
});
```

### Event Control Methods

During event handling, subscribers can control the event flow:

- `event.prevent(stageName = 'complete')`: Prevent the complete stage, or pass in a stage name
- `event.stopEvent()`: Stop all stages of the event
- `event.stopDispatch()`: Stop dispatch to further handlers in current stage
- `event.stopDistribution()`: Stop distribution to other objects

### One-time Subscriptions

Subscribe to an event once, then automatically unsubscribe:

```javascript
// Subscribe once
pubsub.onceOn('notification', event => {
    console.log('This handler will run only once:', event.data);
});

// These are equivalent
pubsub.on('notification', {
    callbackFunction: event => console.log('Also runs once'),
    once: true
});
```

## Advanced Features

### Event Distribution

Events can be distributed through object hierarchies:

```javascript
import _Pubsub from 'isotropic-pubsub';

{
    // Create a hierarchy of pubsub objects
    const child1 = _Pubsub();
        child2 = _Pubsub();
        grandchild = _Pubsub();
        root = _Pubsub();

    // Set up distribution
    root.addDistributor([
        child1,
        child2
    ]);
    child1.addDistributor(grandchild);

    // Subscribe only at the root
    root.on('dataChanged', event => {
        console.log(`Data changed by: ${event.distributor.id}, published by: ${event.publisher.id}`);
    });

    // Events published anywhere in the hierarchy will bubble up to root
    grandchild.publish('dataChanged', {
        value: 'new value'
    });
}
```

### Custom Event Dispatchers

Configure custom behavior for specific event types:

```javascript
// Configure a custom event type
pubsub.defineDispatcher('formSubmit', {
    // Allow publish from public methods
    allowPublicPublish: true,
    // Run this method when the event completes
    completeFunction: 'processFormSubmit',
    // Automatically provide data to all subscribers
    data: {
        formVersion: '1.2.0'
    },
    // Allow preventing this event
    preventable: true
});

// Public method to publish the event
pubsub.publish('formSubmit', {
    formData: {
        email: 'john@example.com',
        name: 'John'
    }
});
```

When you publish or subscribe to an event that hasn't been explicitly defined using `defineDispatcher`, a default configuration is used automatically. However, best practice is to explicitly define events.

### Bulk Subscriptions

Subscribe to multiple events at once:

```javascript
// Subscribe to multiple events
pubsub.bulkSubscribe([{
    config: {
        callbackFunction: event => console.log(`User ${event.name} event:`, event.data)
    },
    eventName: [
        'userLogin',
        'userLogout'
    ],
    stageName: 'on'
}, {
    config: {
        callbackFunction: 'validateForm',
        once: true
    }
    eventName: 'formSubmit',
    stageName: 'before'
}]);
```

### Using as a Base Class

Extend the Pubsub class to create event-aware components:

```javascript
import _make from 'isotropic-make';
import _Pubsub from 'isotropic-pubsub';

const _UserManager = _make(_Pubsub, {
    addUser (user) {
        // Store user
        // ...

        // Publish event
        this._publish('userAdded', {
            user
        });

        return this;
    },
    removeUser (userId) {
        // Remove user
        // ...

        // Publish event
        this._publish('userRemoved', {
            userId
        });

        return this;
    },
    _init (...args) {
        Reflect.apply(_Pubsub.prototype._init, this, args);

        return this;
    }
});

{
    const userManager = _UserManager();

    // Subscribe to user events
    userManager.on('userAdded', event => {
        console.log('New user added:', event.data.user);
    });
}
```

### Using as a Mixin

Use Pubsub as a mixin to add event capabilities to existing classes:

```javascript
import _make from 'isotropic-make';
import _Pubsub from 'isotropic-pubsub';

// Define a class with Pubsub as a mixin
const _DataStore = _make([
    _Pubsub
], {
    get (key) {
        return this._data[key];
    },
    set (key, value) {
        const oldValue = this._data[key];

        this._data[key] = value;

        // Publish change event
        this.publish('dataChanged', {
            key,
            newValue: value,
            oldValue
        });

        return this;
    },
    _init (...args) {
        // Initialize Pubsub functionality
        Reflect.apply(_Pubsub.prototype._init, this, ...args);

        this._data = {};

        return this;
    }
});

{
    const store = _DataStore();

    // Subscribe to data changes
    store.on('dataChanged', event => {
        console.log(`Data changed: ${event.data.key} = ${event.data.newValue}`);
    });

    // Set data triggers the event
    store.set('username', 'john.doe');
}
```

## Advanced Event Subscription

When subscribing to events in `isotropic-pubsub`, you have several options for specifying callbacks and controlling their execution context.

### Callback Functions and Host Context

You can specify a callback function in three ways:

1. **Direct function reference**:
```javascript
pubsub.on('dataChanged', event => {
    console.log(`Data changed: ${event.data.key}`);
});
```

2. **Configuration object with function reference**:
```javascript
pubsub.on('dataChanged', {
    callbackFunction: event => {
        console.log(`Data changed: ${event.data.key}`);
    }
});
```

3. **Method name as string or symbol**:
```javascript
// Using a string method name
pubsub.on('dataChanged', {
    callbackFunction: 'handleDataChange',
    host: this
});

// Or using a Symbol
const dataChangeHandlerSymbol = Symbol('dataChangeHandler');

this[dataChangeHandlerSymbol] = event => {
    console.log(`Data changed: ${event.data.key}`);
};

pubsub.on('dataChanged', {
    callbackFunction: dataChangeHandlerSymbol,
    host: this
});
```

The `host` parameter is particularly useful when you want to execute the callback in a specific context. If not specified, the host defaults to the dispatcher itself. The host becomes the value of `this` within the callback function.

```javascript
import _make from 'isotropic-make';
import _Pubsub from 'isotropic-pubsub';

// The DataStore class
const _DataStore = _make([
    _Pubsub
], {
    handleDataChange (event) {
        // 'this' refers to the DataStore instance
        console.log(`Data changed in ${this.name}: ${event.data.key}`);
    },
    _init (config) {
        this.name = config.name || 'DefaultStore';

        // Subscribe using method name and this as host
        this.on('dataChanged', 'handleDataChange');

        return this;
    }
});
```

### The Binding Pattern

In some cases, you might need to bind a function to a specific context, especially when using callbacks in event handlers:

```javascript
const logger = _Logger(),
    store = _DataStore();

// Bind the logger's log method to the logger instance
store.on('dataChanged', logger.log.bind(logger));
```

This pattern is useful when working with libraries or objects that expect their methods to be called with a specific `this` context. The `host` does not need to be provided when the function is already bound.

## Return Values from Event Handlers

When you subscribe to an event in `isotropic-pubsub`, the subscription methods return a subscription object that allows you to manage that subscription.

### Subscription Objects

Subscription objects have the following structure:

```javascript
{
    subscribed: true, // Boolean indicating if the subscription is active
    unsubscribe: Function // Method to cancel the subscription
}
```

Here's how to use subscription objects:

```javascript
// Create a subscription
const subscription = pubsub.on('dataChanged', event => {
    console.log('Data changed:', event.data);
});

// Check if the subscription is active
console.log(subscription.subscribed); // true

// Unsubscribe when done
subscription.unsubscribe();

// The subscription is no longer active
console.log(subscription.subscribed); // false
```

### Bulk Subscription Returns

When using `bulkSubscribe`, the return value depends on how many subscriptions were created:

```javascript
// Single subscription in bulk form
const singleSub = pubsub.bulkSubscribe({
    eventName: 'event1',
    stageName: 'on',
    config: callback
});
// Returns a single subscription object

// Multiple subscriptions
const multiSub = pubsub.bulkSubscribe([
    {
        eventName: 'event1',
        stageName: 'on',
        config: callback1
    },
    {
        eventName: 'event2',
        stageName: 'before',
        config: callback2
    }
]);
// Returns a composite subscription object
```

The composite subscription object from multiple subscriptions has:

```javascript
{
    subscribed: true, // True if ANY of the subscriptions are active
    subscriptions: [/* array of individual subscription objects */],
    unsubscribe: Function // Unsubscribes ALL contained subscriptions
}
```

### Unsubscribing Within Handlers

You can unsubscribe a handler from within itself using the event object:

```javascript
// One-time handler that unsubscribes itself
pubsub.on('notification', event => {
    console.log('Got notification:', event.data);

    // Unsubscribe this handler
    event.unsubscribe();
});

// Equivalent to using the built-in once methods
pubsub.onceOn('notification', callback);
```

### Managing Subscription Lifecycles

It's a good practice to store subscription objects for later cleanup, especially in components with a lifecycle:

```javascript
import _make from 'isotropic-make';
import _Pubsub from 'isotropic-pubsub';

const _Component = _make([
    _Pubsub
], {
    _destroy (...args) {
        // Clean up all subscriptions
        this._subscriptions.forEach(subscription => subscription.unsubscribe());
        this._subscriptions = [];

        // Call parent destroy
        Reflect.apply(_Pubsub.prototype._destroy, this, args);
    },
    _init (...args) {
        // Call parent _init
        Reflect.apply(_Pubsub.prototype._init, this, args);

        // Store subscriptions
        this._subscriptions = [];

        // Add subscriptions
        this._subscriptions.push(
            this.on('event1', '_handleEvent1'),
            this.on('event2', '_handleEvent2')
        );

        return this;
    }
});
```

## Example Patterns

### Form Validation

```javascript
import _Pubsub from 'isotropic-pubsub';

class FormController {
    constructor () {
        this.pubsub = _Pubsub();

        // Set up validation before submission
        this.pubsub.before('submit', event => {
            const {
                formData
            } = event.data;

            // Validate required fields
            if (!formData.name || !formData.email) {
                console.error('Required fields missing');

                event.prevent();
                return;
            }

            // Validate email format
            if (!/^.+@.+\..+$/.test(formData.email)) {
                console.error('Invalid email format');

                event.prevent();
                return;
            }
        });

        // Process form on submission
        this.pubsub.on('submit', event => {
            console.log('Processing form submission:', event.data.formData);
            // Process form...
        });

        // Log after submission
        this.pubsub.after('submit', () => {
            console.log('Form submission completed at:', Date.now());
        });
    }

    submitForm (formData) {
        this.pubsub.publish('submit', {
            formData
        });
    }
}

const controller = new FormController();

controller.submitForm({
    email: 'john.doe@example.com',
    message: 'Hello world!',
    name: 'John Doe'
});
```

### Communication Between Components

```javascript
import _make from 'isotropic-make';
import _Pubsub from 'isotropic-pubsub';

// Shared event bus
const eventBus = _Pubsub();

// Cart component
const _Cart = _make({
        addItem (item) {
            this.items.push(item);

            eventBus.publish('itemAdded', {
                item,
                totalItemCount: this.items.length
            });

            return this;
        },
        removeItem (itemId) {
            const index = this.items.findIndex(item => item.id === itemId);

            if (index !== -1) {
                const item = this.items.splice(index, 1)[0];

                eventBus.publish('itemRemoved', {
                    item,
                    totalItemCount: this.items.length
                });
            }
            return this;
        }
        _init () {
            this.items = [];

            return this;
        }
    });
    // Header component with cart indicator
    _CartIndicator = make({
        updateDisplay () {
            console.log(`Cart indicator updated: ${this.count} items`);
            // Update UI...
        },
        _init () {
            this.count = 0;

            // Subscribe to cart events
            eventBus.on([
                'itemAdded'
                'itemRemoved'
            ], event => {
                this.count = event.data.totalItemCount;
                this.updateDisplay();
            });

            return this;
        }
    });

{
    // Instantiate components
    const cart = _Cart(),
        indicator = _CartIndicator();

    // Use components
    cart.addItem({
        id: 1,
        name: 'Product 1',
        price: 9.99
    });
    // Cart indicator updated: 1 items

    cart.addItem({
        id: 2,
        name: 'Product 2',
        price: 19.99
    });
    // Cart indicator updated: 2 items

    cart.removeItem(1);
    // Cart indicator updated: 1 items
}
```

### Cancellable Operations

```javascript
import _later from 'isotropic-later';
import _Pubsub from 'isotropic-pubsub';

class FileUploader {
    constructor () {
        this.pubsub = _Pubsub();

        // Configure the upload event
        this.pubsub.defineDispatcher('upload', {
            eventStoppable: true,
            preventable: true
        });

        // Before upload - validate file
        this.pubsub.before('upload', event => {
            const {
                file
            } = event.data;

            if (file.size > 10 * 1024 * 1024) { // 10MB
                console.error('File too large');

                event.prevent();
            }
        });

        // On upload - start operation
        this.pubsub.on('upload', event => {
            const {
                file
            } = event.data;

            console.log(`Starting upload of ${file.name}`);

            // Start upload process
            this.currentUpload = {
                cancel: () => {
                    console.log('Upload cancelled');

                    clearInterval(this.progressInterval);
                    event.stopEvent();
                },
                file,
                progress: 0
            };

            // Simulate upload progress
            this.progressInterval = setInterval(() => {
                this.currentUpload.progress += 10;

                this.pubsub.publish('uploadProgress', {
                    file: this.currentUpload.file,
                    progress: this.currentUpload.progress
                });

                if (this.currentUpload.progress >= 100) {
                    clearInterval(this.progressInterval);

                    this.pubsub.publish('uploadComplete', {
                        file: this.currentUpload.file
                    });
                }
            }, 500);
        });
    }

    uploadFile (file) {
        this.pubsub.publish('upload', {
            file
        });

        return {
            cancel: () => {
                if (this.currentUpload) {
                    this.currentUpload.cancel();
                }
            }
        };
    }
}

{
    // Usage
    const uploader = new FileUploader(),

        upload = uploader.uploadFile({
            name: 'document.pdf',
            size: 5 * 1024 * 1024
        });

    // Cancel after 1.5 seconds
    _later(1500, () => {
        upload.cancel();
    });
}
```

### Event Distribution Hierarchy

```javascript
import _make from 'isotropic-make';
import _Pubsub from 'isotropic-pubsub';

// Component base class
const _Component = _make(_Pubsub, {
    addChild (id) {
        const child = _Component({
            id,
            parent: this
        });

        this.children.push(child);

        return child;
    }
    _init(...args) {
        Reflect.apply(_Pubsub.prototype._init, this, ...args);

        const {
            id,
            parent = null
        } = typeof args[0] === 'string' ?
            {
                id: args[0]
            } :
            args[0];

        this.children = [];
        this.id = id;
        this.parent = parent;

        // Set up distribution to parent
        if (parent) {
            this.addDistributor(parent);
        }

        return this;
    }
});

{
    // Create a component tree
    const app = _Component('app'),
        footer = app.addChild('footer'),
        header = app.addChild('header'),
        main = app.addChild('main'),
        mainContentArea = main.addChild('content'),
        sidebar = main.addChild('sidebar'),
        topNav = header.addChild('main-nav'),
        userMenu = header.addChild('user-menu');

    // Subscribe at the root
    app.on('userAction', event => {
        console.log(`User action in ${event.distributor.id}: ${event.data.action}`);
    });

    // Trigger events from leaf nodes
    userMenu.publish('userAction', {
        action: 'logout'
    });
    // User action in user-menu: logout

    contentArea.publish('userAction', {
        action: 'save'
    });
    // User action in content: save
}
```

### Custom Event Dispatchers with Before/After Hooks

```javascript
import _Pubsub from 'isotropic-pubsub';

class DataService {
    constructor () {
        this.data = {};
        this.pubsub = _Pubsub();

        // Configure CRUD event dispatchers
        this.pubsub.defineDispatcher({
            // Create operation
            'create': {
                completeFunction: '_handleCreate',
                lifecycleHost: this
            },
            // Delete operation
            'delete': {
                completeFunction: '_handleDelete',
                lifecycleHost: this
            },
            // Read operation
            'read': {
                completeFunction: '_handleRead',
                lifecycleHost: this
            },
            // Update operation
            'update': {
                completeFunction: '_handleUpdate',
                lifecycleHost: this
            }
        });

        // Add validation for all operations
        this.pubsub.before({
            create: {
                callbackFunction: '_validateCreate',
                host: this
            },
            delete: {
                callbackFunction: '_validateDelete',
                host: this
            },
            update: {
                callbackFunction: '_validateUpdate',
                host: this
            }
        });


        // Add logging for all operations
        this.pubsub.after([
            'create',
            'delete',
            'read',
            'update'
        ], {
            callbackFunction: '_logOperation',
            host: this
        });
    }

    create ({
        data,
        id
    }) {
        return this.pubsub.publish('create', {
            data,
            id
        });
    }

    delete ({
        id
    }) {
        return this.pubsub.publish('delete', {
            id
        });
    }

    read ({
        id
    }) {
        return this.pubsub.publish('read', {
            id
        });
    }

    update ({
        data,
        id
    }) {
        return this.pubsub.publish('update', {
            data,
            id
        });
    }

    // Complete handlers
    _handleCreate (event) {
        const {
            data,
            id
        } = event.data;

        this.data[id] = data;

        console.log(`Created: ${id}`);
    }

    _handleDelete (event) {
        const {
            id
        } = event.data;

        delete this.data[id];

        console.log(`Deleted: ${id}`);
    }

    _handleRead (event) {
        const {
            id
        } = event.data;

        return this.data[id];
    }

    _handleUpdate (event) {
        const {
            data,
            id
        } = event.data;

        this.data[id] = {
            ...this.data[id],
            ...data
        };

        console.log(`Updated: ${id}`);
    }

    // Logging hook
    _logOperation (event) {
        console.log(`[LOG] ${event.name} - ${JSON.stringify(event.data)}`);
    }

    // Validation hooks
    _validateCreate (event) {
        const {
            data,
            id
        } = event.data;

        if (this.data[id]) {
            console.error(`Id ${id} already exists`);

            event.prevent();
        }

        if (!data || typeof data !== 'object') {
            console.error(`Invalid data provided`);

            event.prevent();
        }
    }

    _validateDelete (event) {
        const {
            id
        } = event.data;

        if (!this.data[id]) {
            console.error(`Id ${id} does not exist`);

            event.prevent();
        }
    }

    _validateUpdate (event) {
        const {
            data,
            id
        } = event.data;

        if (!this.data[id]) {
            console.error(`Id ${id} does not exist`);

            event.prevent();
        }

        if (!data || typeof data !== 'object') {
            console.error(`Invalid data provided`);

            event.prevent();
        }
    }
}

{
    // Usage
    const service = new DataService();

    service.create('user1', {
        email: 'john@example.com',
        name: 'John'
    });
    // Created: user1
    // [LOG] create - {"id":"user1","data":{"name":"John","email":"john@example.com"}}

    service.update('user1', {
        name: 'John Doe'
    });
    // Updated: user1
    // [LOG] update - {"id":"user1","data":{"name":"John Doe"}}

    // Try to update non-existent record
    service.update('user2', {
        name: 'Jane'
    });
    // Id user2 does not exist
}
```

## Inheritance and Event Configuration

While the examples in the previous sections show how to use `defineDispatcher` directly, the recommended approach for complex applications is to use class inheritance with `isotropic-make`. This allows for better organization and reusability of event configurations.

### Using the Static `_pubsub` Property

The `isotropic-pubsub` module integrates with `isotropic-property-chainer` to provide a clean inheritance pattern for event configurations:

```javascript
import _make from 'isotropic-make';
import _Pubsub from 'isotropic-pubsub';

// Base service with common event configurations
const _BaseService = _make(_Pubsub, {
        // Instance methods
        _handleCreate (event) {
            console.log('Creating resource:', event.data);

            // Implementation...
        },
        _init (...args) {
            Reflect.apply(_Pubsub.prototype._init, this, args);

            this._before('create', '_validateCreate');

            return this;
        },
        _validateCreate (event) {
            if (!event.data.id) {
                console.error('Missing ID');

                event.prevent();
            }
        }
    }, {
        // Static properties including event configurations
        _pubsub: {
            // Define the 'create' event with base configuration
            create: {
                allowPublicPublish: true,
                completeFunction: '_handleCreate',
                preventable: true
            }
        }
    }),
    // Derived service with additional event configurations
    _UserService = _make(_BaseService, {
        // Instance methods
        _handleLogin (event) {
            console.log('New login:', event.data);

            // Implementation...
        },
        _init (...args) {
            Reflect.apply(_BaseService.prototype._init, this, args);

            this._before('create', '_validateEmail');

            return this;
        },
        _validateEmail (event) {
            if (!event.data.email || !event.data.email.includes('@')) {
                console.error('Invalid email format');

                event.prevent();
            }
        }
    }, {
        // Static properties with extended event configurations
        _pubsub: {
            // The create event doesn't need to be specified again.
            // it gets inherited from _BaseService

            // Add a user-specific event
            login: {
                allowPublicPublish: true,
                completeFunction: '_handleLogin'
            }
        }
    });
```

In this example:

1. `_BaseService` defines a base `create` event with base configuration.
2. `_UserService` inherits this configuration and adds another event.

This inheritance pattern allows you to build complex event systems while maintaining a clean separation of concerns.

### Benefits of Using the Static `_pubsub` Property

1. **Automatic Inheritance**: Event configurations are automatically inherited and can be extended or overridden in derived classes.
2. **Better Organization**: Event definitions are centralized in the class definition rather than scattered throughout instance methods.
3. **Reusability**: Common event patterns can be defined once and reused across multiple derived classes.
4. **Encapsulation**: Event handling logic is kept within the class that owns it.

## API Reference

### Pubsub Class

#### Constructor

```javascript
const pubsub = _Pubsub(options);
```

#### Instance Methods

- **addDistributor(distributor)**: Add an object to distribute events to
- **after(eventName, config)**: Subscribe to the after stage of an event
- **before(eventName, config)**: Subscribe to the before stage of an event
- **bulkSubscribe(config)**: Subscribe to multiple events at once
- **bulkUnsubscribe([stageName], [eventName])**: Unsubscribe from multiple events
- **defineDispatcher(eventName, config)**: Define a custom event dispatcher
- **destroy(...args)**: Destroy the pubsub instance
- **on(eventName, config)**: Subscribe to the on stage of an event
- **publish(eventName, data)**: Publish an event with optional data
- **onceAfter(eventName, config)**: Subscribe once to the after stage
- **onceBefore(eventName, config)**: Subscribe once to the before stage
- **onceOn(eventName, config)**: Subscribe once to the on stage
- **removeDistributor(distributor)**: Remove a distributor
- **subscribe(stageName, eventName, config)**: Subscribe to an event at a specific stage

### Event Object

Event objects are passed to subscribers and contain:

- **completed**: Whether the event has completed its complete stage
- **data**: Data associated with the event
- **dispatchStopped**: Whether dispatch is stopped
- **distributionStopped**: Whether distribution is stopped
- **distributor**: Object distributing the event
- **eventStopped**: Whether event is stopped
- **name**: Name of the event
- **publisher**: Object that published the event
- **stageName**: Current stage name

#### Event Control Methods

- **isPrevented(stageName='complete')**: Returns whether the given stage is prevented
- **prevent(stageName='complete')**: Prevents the given stage
- **stopDispatch()**: Stop dispatch to further handlers in current stage
- **stopDistribution()**: Stop distribution to other objects
- **stopEvent()**: Stop all stages of the event
- **unsubscribe()**: Unsubscribe the current handler

### Subscription Object

Returned when subscribing to events:

- **subscribed**: Whether the subscription is active
- **unsubscribe()**: Method to unsubscribe

## Advanced Configuration

### Event Dispatcher Options

```javascript
pubsub.defineDispatcher('eventName', {
    // Allow duplicate subscriptions
    allowDuplicateSubscription: true,
    // Control whether public publish is allowed
    allowPublicPublish: true,
    // Control whether public subscribe is allowed
    allowPublicSubscription: true,
    // Control whether public unsubscribe is allowed
    allowPublicUnsubscription: true,
    // Function to run on event completion
    completeFunction: 'functionOrMethodName',
    // Complete the event only once
    completeOnce: false,
    // Default data to merge with event data
    data: { /* ... */ },
    // Control if dispatch can be stopped
    dispatchStoppable: true,
    // Control if event should be distributed
    distributable: true,
    // Control if distribution can be stopped
    distributionStoppable: true,
    // Control if event can be stopped
    eventStoppable: true,
    // Custom host for lifecycle functions
    lifecycleHost: null,
    // Control whether events can be prevented
    preventable: true,
    // Function to run when event stage is prevented
    preventFunction: 'functionOrMethodName',
    // Publish the event only once
    publishOnce: false,
    // Custom event stages
    stages: ['before', 'on', 'complete', 'after'],
    // Function to run when dispatch is stopped
    stopDispatchFunction: 'functionOrMethodName',
    // Function to run when distribution is stopped
    stopDistributionFunction: 'functionOrMethodName',
    // Function to run when event is stopped
    stopEventFunction: 'functionOrMethodName',
    // Function to run when a listener subscribes
    subscribeFunction: 'functionOrMethodName',
    // Function to run when a listener unsubscribes
    unsubscribeFunction: 'functionOrMethodName'
});
```

### `completeOnce` vs `publishOnce`

- **`publishOnce`**: When set to `true`, the event can only be published once during the lifetime of the object. Any subsequent attempts to publish the event will be ignored.

```javascript
// This event can only be published once
pubsub.defineDispatcher('initialize', {
    publishOnce: true
});

pubsub.publish('initialize', { data: 123 }); // Works
pubsub.publish('initialize', { data: 456 }); // Ignored
```

- **`completeOnce`**: When set to `true`, the event can be published multiple times, but the complete function will only run the first time.

```javascript
// This event can be published multiple times, but the complete function only runs once
pubsub.defineDispatcher('load', {
    completeOnce: true,
    completeFunction: () => console.log('Loading resources')
});

pubsub.publish('load'); // Prints "Loading resources"
pubsub.publish('load'); // Complete function doesn't run
```

For both `completeOnce` and `publishOnce`, after the event has already been completed or published, any new subscriber is executed immediately.

## Event Lifecycle Functions

`isotropic-pubsub` provides a set of special functions that are called at specific points in an event's lifecycle. These lifecycle functions offer powerful hooks to customize event behavior, respond to state changes, and implement cross-cutting concerns like logging or monitoring. By utilizing these functions effectively, you can implement sophisticated event patterns while maintaining clean separation of concerns.

### Available Lifecycle Functions

| Lifecycle Function | Called When | Purpose |
|-------------------|-------------|---------|
| `completeFunction` | The event reaches its completion stage | Execute the primary action for the event |
| `preventFunction` | Any stage of the event is prevented | React to prevention of an event stage |
| `stopDispatchFunction` | `event.stopDispatch()` is called | React to dispatch being halted |
| `stopDistributionFunction` | `event.stopDistribution()` is called | React to distribution being halted |
| `stopEventFunction` | `event.stopEvent()` is called | React to the entire event being stopped |
| `subscribeFunction` | A new subscription is created | Validate or modify subscriptions |
| `unsubscribeFunction` | A subscription is removed | Clean up or react to unsubscriptions |

### Configuring Lifecycle Functions

You can specify lifecycle functions when defining an event dispatcher:

```javascript
pubsub.defineDispatcher('saveData', {
    // The primary action function
    completeFunction: event => {
        // Save the data
        saveToDatabase(event.data);
    },
    // Called when the event is prevented
    preventFunction: event => {
        console.warn('Save operation prevented:', event);
    },
    // Called when a new subscription is added
    subscribeFunction: ({
        config,
        dispatcher
    }) => {
        console.log('New subscription to saveData:', config);
    }
});
```

### Using Method Names Instead of Functions

As with event handlers, you can use method names instead of functions:

```javascript
import _make from 'isotropic-make';
import _Pubsub from 'isotropic-pubsub';

const _DataService = _make(_Pubsub, {
    // Lifecycle handler methods
    _handleSaveComplete (event) {
        this.lastSavedData = event.data;
        this.saveCount += 1;
    },
    _init (...args) {
        Reflect.apply(_Pubsub.prototype._init, this, args);

        this.lastSavedData = null;
        this.saveCount = 0;
        this._authorizedSubscriberSet = new Set();

        return this;
    },
    _validateSaveSubscription ({
        config
    }) {
        // Only allow certain components to subscribe
        if (!this._authorizedSubscriberSet.has(config.host)) {
            console.warn('Unauthorized subscription attempt');

            return false; // Prevents the subscription
        }
    }
}, {
    _pubsub: {
        saveData: {
            completeFunction: '_handleSaveComplete',
            subscribeFunction: '_validateSaveSubscription'
        }
    }
});
```

### Using the `lifecycleHost` Property

By default, lifecycle functions are executed in the context of the dispatcher itself. You can specify a different context using the `lifecycleHost` property:

```javascript
const logger = {
    logPrevention (event) {
        console.log(`Event ${event.name} was prevented at stage ${event.stageName}`);
    }
};

pubsub.defineDispatcher('criticalOperation', {
    preventFunction: 'logPrevention',
    lifecycleHost: logger
});
```

This allows you to centralize event lifecycle logic in specialized objects that handle cross-cutting concerns.

### Use Cases for Lifecycle Functions

#### 1. The `completeFunction` - Primary Event Handler

The most commonly used lifecycle function is `completeFunction`, which executes the primary action associated with an event:

```javascript
pubsub.defineDispatcher('userLogin', {
    completeFunction: event => {
        const {
            username,
            password
        } = event.data;

        // Primary login logic
        authenticateUser(username, password).then(user => {
            pubsub.publish('loginSuccess', {
                user
            });
        }).catch(error => {
            pubsub.publish('loginFailure', {
                error
            });
        });
    }
});
```

The `completeFunction` runs after the "on" stage and before the "after" stage, allowing you to implement a clear separation between preparation (before), processing (on), main action (complete), and cleanup (after).

#### 2. The `preventFunction` - Handling Validation Failures

The `preventFunction` is useful for centralizing the handling of validation failures:

```javascript
pubsub.defineDispatcher('formSubmit', {
    completeFunction: 'submitForm',
    preventFunction: event => {
        // Find which stage prevented the event
        if (event.isPrevented('before')) {
            // Validation failure
            showValidationErrors();
        } else if (event.isPrevented('complete')) {
            // Submission failure
            showSubmissionError();
        }
    },
    preventable: true
});
```

#### 3. The `subscribeFunction` and `unsubscribeFunction` - Subscription Management

These functions let you monitor and control subscriptions:

```javascript
pubsub.defineDispatcher('securedEvent', {
    subscribeFunction: ({
        config
    }) => {
        // Log all subscriptions
        console.log(`New subscription from ${config.host.name || 'anonymous'}`);

        // Verify permissions
        if (!hasPermission(config.host, 'securedEvent')) {
            console.error('Permission denied');

            return false; // Prevents the subscription
        }
    },
    unsubscribeFunction: ({
        config
    }) => {
        // Clean up any resources associated with this subscription
        releaseResources(config.subscriptionId);
    }
});
```

The `subscribeFunction` can return `false` to prevent the subscription from being created. It can also return a subscription object and bypass the regular subscription logic.

The `unsubscribeFunction` can return `false` to prevent the subscription from being unsubscribed.

#### 4. Flow Control Functions

The `stopDispatchFunction`, `stopDistributionFunction`, and `stopEventFunction` help you respond to changes in event flow:

```javascript
pubsub.defineDispatcher('dataProcess', {
    stopDispatchFunction: event => {
        console.log('Dispatch stopped by:', event.distributor.id);
    },
    stopDistributionFunction: event => {
        console.log('Distribution stopped at:', event.distributor.id);

        // Notify about partial distribution
        pubsub.publish('partialDistribution', {
            lastDistributor: event.distributor.id,
            originalEvent: event.name
        });
    },
    stopEventFunction: event => {
        console.log('Event completely stopped at stage:', event.stageName);

        // Record the aborted event
        logAbortedEvent(event);
    }
});
```

### Return Values from Lifecycle Functions

Most lifecycle functions are called for their side effects, and their return values are ignored. However, there are two important exceptions:

1. **`subscribeFunction`**: If it returns `false`, the subscription is prevented.
2. **`unsubscribeFunction`**: If it returns `false`, the unsubscription is prevented.

This allows you to implement subscription policies that control which components can subscribe to or unsubscribe from specific events. Additionally `subscribeFunction` can return a subscription object and bypass the regular subscription logic.

### Lifecycle Functions in Inheritance

When extending a class that uses `isotropic-pubsub`, you can override or extend lifecycle functions:

```javascript
import _make from 'isotropic-make';
import _Pubsub from 'isotropic-pubsub';

// Base class with generic handling
const _BaseService = _make(_Pubsub, {
        _logEvent (event) {
            console.log(`Event ${event.name} processed`);
        },
        _processOperation (event) {
            // base implementation
        }
    }, {
        _pubsub: {
            operation: {
                completeFunction: '_processOperation',
                preventFunction: '_logEvent'
            }
        }
    }),
    // Derived class with specialized handling
    _UserService = _make(_BaseService, {
        _processOperation (event) {
            // Add specialized processing
            if (event.data.type === 'user') {
                this._processUserOperation(event);
            } else {
                // Call parent implementation for non-user operations
                Reflect.apply(_BaseService.prototype._processOperation, this, [
                    event
                ]);
            }
        },
        _processUserOperation (event) {
            // implementation
        }
    });
```

A derived class can override an event configuration and/or specific lifecycle methods while inheriting others from the parent class.

## Public vs. Protected Methods

`isotropic-pubsub` follows a pattern that distinguishes between public methods (intended for external use) and protected methods (primarily for internal use). Understanding this distinction is crucial for using the interface effectively, especially when extending it or creating custom implementations.

### Public vs. Protected Method Pairs

The library provides paired public and protected versions of its core methods:

| Public Method | Protected Method | Purpose |
|---------------|-----------------|---------|
| `after()` | `_after()` | Subscribe to the "after" stage |
| `before()` | `_before()` | Subscribe to the "before" stage |
| `bulkSubscribe()` | `_bulkSubscribe()` | Subscribe to multiple events |
| `bulkUnsubscribe()` | `_bulkUnsubscribe()` | Unsubscribe from multiple events |
| `on()` | `_on()` | Subscribe to the "on" stage of an event |
| `onceAfter()` | `_onceAfter()` | Subscribe once to the "after" stage |
| `onceBefore()` | `_onceBefore()` | Subscribe once to the "before" stage |
| `onceOn()` | `_onceOn()` | Subscribe once to the "on" stage |
| `publish()` | `_publish()` | Publish an event |

### When to Use Each Version

- **Public methods** (`publish()`, `on()`, etc.):
  - Use these in most application code
  - Subject to permission checks configured on the event dispatcher
  - Can be controlled by configuration options like `allowPublicPublish`

- **Protected methods** (`_publish()`, `_on()`, etc.):
  - Use these inside class methods when extending `Pubsub`
  - Bypass permission checks, always execute regardless of configuration
  - Useful for internal communication within a component

```javascript
import _make from 'isotropic-make';
import _Pubsub from 'isotropic-pubsub';

// Example of the pattern in a component extending Pubsub
const _Component = _make(_Pubsub, {
    doSomething (anotherObject) {
        // Internal communication between methods - use protected version
        this._publish('internalEvent', {
            data: 'value'
        });

        // External notification - use public version
        anotherObject.publish('componentAction', {
            action: 'something'
        });
    },
    _init (...args) {
        Reflect.apply(_Pubsub.prototype._init, this, args);

        // Internal subscription - use protected version
        this._on('internalEvent', '_handleInternalEvent');

        return this;
    }
});
```

### Configuration Options for Access Control

`isotropic-pubsub` provides several configuration options to control access to events:

- **`allowPublicPublish`**: When `true`, allows events to be published via the public `publish()` method. Default: `false`
- **`allowPublicSubscription`**: When `true`, allows subscribing to events via public methods like `on()`, `before()`, etc. Default: `true`
- **`allowPublicUnsubscription`**: When `true`, allows unsubscribing from events via public methods. Default: `false`

The defaults allow for anyone to subscribe to an event but publishing an event or unsubscribing someone else's subscription are internal features. These options can be set when defining event dispatchers:

```javascript
// Define an event with restricted access
pubsub.defineDispatcher('secureEvent', {
    allowPublicPublish: false,       // Only internal methods can publish
    allowPublicSubscription: true,   // Anyone can subscribe
    allowPublicUnsubscription: false // Can't unsubscribe without subscription object
});

// Define a fully public event
pubsub.defineDispatcher('publicEvent', {
    allowPublicPublish: true,
    allowPublicSubscription: true,
    allowPublicUnsubscription: true
});

// Define an internal-only event
pubsub.defineDispatcher('internalEvent', {
    allowPublicPublish: false,
    allowPublicSubscription: false,
    allowPublicUnsubscription: false
});
```

### Use Cases for Access Control

1. **Encapsulation**: Restrict which parts of your application can trigger critical events

```javascript
// Only internal methods can trigger the logout process
authService.defineDispatcher('logout', {
    allowPublicPublish: false
});

// But components can still subscribe to know when logout happens
navBar.on('logout', () => {
    navBar.showLoginButton();
});

// Inside the auth service
authService._on('sessionExpired', () => {
    // Internal method can publish the restricted event
    authService._publish('logout');
});
```

2. **Stability**: Prevent external code from unsubscribing critical handlers

```javascript
// Core system events that shouldn't be disrupted
system.defineDispatcher('systemShutdown', {
    allowPublicUnsubscription: false
});

// Core handler that must run
system.on('systemShutdown', () => {
    system.saveState();
});
```

3. **Interface Clarity**: Create purely internal events for implementation details

```javascript
// Internal component communication
component.defineDispatcher('_updateState', {
    allowPublicPublish: false,
    allowPublicSubscription: false
});

// Only used within the component's methods
component._on('_updateState', () => {
    component._refreshView();
});
```

### Best Practices

1. **Use protected methods for internal communication**
   When components need to communicate between their own methods, use the protected methods.

2. **Use public methods for application-level events**
   For events that represent application-level actions or state changes, use public methods with appropriate access controls.

3. **Be conservative with access controls**
   Start with more restrictive permissions and loosen them only when necessary. It's easier to open up access later than to restrict it after components rely on direct access.

4. **Document access patterns**
   When creating a component with events, clearly document which events are intended for public consumption and which are internal implementation details.

5. **Use consistent naming conventions**
   Consider prefixing internal events with an underscore (like `_internalEvent`) to make it clear they're not part of the public API.

This public/protected pattern allows `isotropic-pubsub` to support both encapsulated, implementation-detail events and public, API-level events in the same system, providing flexibility while maintaining control over access. Note that this is only advisory access control. There is nothing to prevent any code from accesing the protected methods when they aren't supposed to.

### Event Stages Control

Various options control which stages of the event lifecycle can be controlled by handlers:

- **`dispatchStoppable`**: If `true`, event handlers can call `event.stopDispatch()` to prevent further handlers in the current stage from executing.

- **`distributionStoppable`**: If `true`, event handlers can call `event.stopDistribution()` to prevent the event from being distributed to other objects.

- **`eventStoppable`**: If `true`, event handlers can call `event.stopEvent()` to prevent all further event processing.

- **`preventable`**: Controls which stages can be prevented. Can be `true` (all stages), `false` (no stages), or a `Set` of specific stage names.

```javascript
// Fine-grained control example
pubsub.defineDispatcher('criticalOperation', {
    allowPublicPublish: true,
    completeFunction: 'performOperation',
    dispatchStoppable: true, // Handlers can stop further handlers
    distributionStoppable: false, // Must distribute to all objects
    eventStoppable: false, // Cannot stop the event completely
    preventable: new Set([
        'before' // Only the 'before' stage can be prevented
    ])
});
```

These configuration options give you precise control over how events flow through your application and how they can be interrupted or modified.

## Synchronous Event Processing and Asynchronous Tasks

All event processing in `isotropic-pubsub` is synchronous by default. Events are processed in the following order:

1. Before stage handlers
2. On stage handlers
3. Complete function (internal event handling)
4. After stage handlers

However, this doesn't prevent the complete function or event handlers from performing asynchronous tasks. When an asynchronous task is started during event processing, the event flow continues synchronously:

```javascript
// Define a custom event with an asynchronous complete function
pubsub.defineDispatcher('saveData', {
    allowPublicPublish: true,
    completeFunction: async event => {
        // Start an asynchronous operation
        try {
            await saveToDatabase(event.data);
        } catch (error) {
            pubsub.publish('saveError', {
                error
            });

            return;
        }

        // This will run after the event processing has completed
        pubsub.publish('saveComplete', {
            success: true
        });
    }
});

// After stage handlers will execute before the async task completes
pubsub.after('saveData', () => {
    console.log('Save operation started'); // This runs immediately
});

// To handle the completion of the async task, subscribe to a separate event
pubsub.on('saveComplete', () => {
    console.log('Save operation completed successfully');
});

pubsub.on('saveError', (event) => {
    console.error('Save operation failed:', event.data.error);
});
```

### Best Practices for Asynchronous Operations

When working with asynchronous operations, follow these best practices:

1. **Create separate completion events**: For asynchronous operations, publish separate events to indicate completion or failure.

2. **Use event chains**: Chain events to create complex workflows with asynchronous steps.

```javascript
const _AsyncService = _make(_Pubsub, {
    // First event in the chain
    processData (data) {
        return this.publish('processStart', { data });
    },
    _init () {
        // Set up event chain
        this.on('processStart', '_processStartHandler');
        return this;
    },
    async _processAsync (data) {
        // Async implementation
    },
    // Handle the start of processing
    _processStartHandler (event) {
        const {
            data
        } = event.data;

        // Perform async processing
        this._processAsync(data).then(result => {
            // Publish completion event when done
            this.publish('processComplete', {
                result
            });
        }).catch(error => {
            this.publish('processError', {
                error
            });
        });
    }
});
```

## Event Distribution Mechanism

`isotropic-pubsub` provides a powerful event distribution system that allows events to flow through object hierarchies. This enables you to build complex event-based architectures with clear separation of concerns.

### How Event Distribution Works

When an event is published, it is distributed through a network of related objects that have been registered as distributors:

1. The event starts at the publisher object
2. It flows to all registered distributors of the publisher
3. Each distributor then distributes the event to its own distributors
4. This continues recursively until all objects in the distribution network have processed the event

```javascript
// Create a hierarchy of objects
const child1 = _Pubsub(),
    child2 = _Pubsub(),
    grandchild1a = _Pubsub(),
    grandchild1b = _Pubsub(),
    grandchild2a = _Pubsub(),
    parent = _Pubsub();

// Set up distribution relationships
parent.addDistributor([
    child1,
    child2
]);
child1.addDistributor([
    grandchild1a,
    grandchild1b
]);
child2.addDistributor(grandchild2a);

// When an event is published on parent:
parent.publish('someEvent', {
    data: 'value'
});

// The distribution order is:
// 1. parent (publisher)
// 2. child1, child2 (parent's distributors)
// 3. grandchild1a, grandchild1b (child1's distributors)
// 4. grandchild2a (child2's distributor)
```

Within each object, the event flows through its handlers in the standard stage order (before → on → complete → after).

### Distribution Order Details

The exact order of event processing across distributors follows these rules:

1. For each stage (before, on, complete, after):
   - First, all handlers for that stage on the publisher execute
   - Then, all handlers for that stage on the first distributor execute
   - Then, all handlers for that stage on all of that distributor's distributors execute (recursively)
   - This repeats for each subsequent distributor in the order they were added

This breadth-first traversal ensures predictable event flow and allows for complex event propagation patterns.

### Controlling Event Distribution

Event handlers can control distribution using several methods:

```javascript
// Stop distribution to further objects
pubsub.on('someEvent', event => {
    // Do something
    event.stopDistribution();
    // Event won't be distributed to other objects
});

// Remove a distributor dynamically
pubsub.removeDistributor(child);
// Future events won't be distributed to this object

// Remove multiple distributors
pubsub.removeDistributor([
    child1,
    child2
]);
// Or
pubsub.removeDistributor(new Set([
    child1,
    child2
]));
```

You can also configure distribution behavior at the event level:

```javascript
pubsub.defineDispatcher('localEvent', {
    // This event won't be distributed to other objects
    distributable: false
});

pubsub.defineDispatcher('restrictedEvent', {
    // This event can't be stopped from distributing
    distributionStoppable: false
});
```

### Event Distribution Use Cases

Event distribution is particularly useful for:

1. **Component Hierarchies**: UI components can distribute events to their child components
2. **Service Composition**: Services can distribute events to dependent services
3. **Cross-Cutting Concerns**: Logging, analytics, or monitoring can be implemented by distributing events to specialized handlers

## Advanced Custom Dispatchers

While `isotropic-pubsub` provides a robust default dispatcher implementation, you can create completely custom dispatchers for specialized event handling needs.

### Creating a Custom Dispatcher

A custom dispatcher needs to implement three key methods:

```javascript
const customDispatcher = {
    // Create a new state object for this event type
    newState () {
        return {
            // Custom state properties
            subscriptions: {}, // Required for storing subscriptions
            customData: {} // Any additional data you need
        };
    },
    // Handle event publishing
    publish (config) {
        // Custom publish logic
        console.log('Publishing event with config:', config);

        // You have access to:
        // config.data - Event data
        // config.eventName - Event name
        // config.getDistributionPath - Function to get distribution objects
        // config.lifecycleHost - Execution context for lifecycle methods
        // config.publisher - Publishing object
        // config.state - Event state from newState()

        // Implement your custom event flow
        return this;
    },
    // Handle event subscription
    subscribe (config) {
        // Custom subscription logic
        console.log('Subscribing with config:', config);

        // Return a subscription object
        return {
            subscribed: true,
            unsubscribe: () => true
        };
    }
};
```

### Using a Custom Dispatcher

You can use your custom dispatcher for specific events:

```javascript
pubsub.defineDispatcher('customEvent', customDispatcher);

// Now when customEvent is published or subscribed to,
// your custom dispatcher implementation will be used
pubsub.publish('customEvent', {
    data: 'value'
});
```

### Custom Dispatcher Use Cases

Custom dispatchers are useful for specialized event patterns such as:

1. **Queued Events**: Implementing a queue for events that should be processed in order
2. **Throttled/Debounced Events**: Limiting the frequency of event processing
3. **Conditional Events**: Advanced filtering of events based on complex conditions
4. **Persistent Events**: Events that need to be stored and replayed
5. **Remote Events**: Dispatchers that transmit events over network boundaries
6. **Completely Custom Logic**: Implement alternate event stages or distribution approaches

### Example: Throttled Event Dispatcher

```javascript
// A dispatcher that limits event frequency
const throttledDispatcher = {
    newState () {
        return {
            lastFired: 0,
            pendingSubscriptions: [],
            subscriptions: {},
            throttleDuration: 100 // Minimum milliseconds between events
        };
    },
    publish (config) {
        const now = Date.now(),
            state = config.state;

        // Check if enough time has passed
        if (now - state.lastFired >= state.throttleDuration) {
            state.lastFired = now;

            // Use the standard dispatcher's publish method for actual dispatching
            _Dispatcher.prototype.publish.call(this, config);
        } else {
            console.log('Event throttled');
        }

        return this;
    },

    subscribe(config) {
        // Use the standard dispatcher's subscribe method
        return _Dispatcher.prototype.subscribe.call(this, config);
    }
};

// Use the throttled dispatcher for high-frequency events
pubsub.defineDispatcher('scroll', throttledDispatcher);
pubsub.defineDispatcher('resize', throttledDispatcher);
```

Custom dispatchers provide a powerful extension point for the event system, allowing you to tailor event behavior to your specific application needs while maintaining compatibility with the rest of the pubsub infrastructure.

## Integration with Other isotropic Modules

isotropic-pubsub works seamlessly with other modules in the isotropic ecosystem:

- **isotropic-make**: Create constructor functions with inheritance and mixins
- **isotropic-property-chainer**: Chain property objects through inheritance
- **isotropic-mixin-prototype-chain**: Walk prototype chains including mixins

## Contributing

Please refer to [CONTRIBUTING.md](https://github.com/ibi-group/isotropic-pubsub/blob/main/CONTRIBUTING.md) for contribution guidelines.

## Issues

If you encounter any issues, please file them at https://github.com/ibi-group/isotropic-pubsub/issues
