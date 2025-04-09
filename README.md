# isotropic-pubsub

[![npm version](https://img.shields.io/npm/v/isotropic-pubsub.svg)](https://www.npmjs.com/package/isotropic-pubsub)
[![License](https://img.shields.io/npm/l/isotropic-pubsub.svg)](https://github.com/ibi-group/isotropic-pubsub/blob/main/LICENSE)
![](https://img.shields.io/badge/tests-passing-brightgreen.svg)
![](https://img.shields.io/badge/coverage-90%25-brightgreen.svg)

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
3. **Default Stage**: Special internal stage that executes after the "on" stage
4. **After Stage**: Final stage - for cleanup or logging

### Subscription Stages

You can subscribe to any stage of an event's lifecycle:

```javascript
// Before stage - can prevent or modify the event
pubsub.before('save', event => {
    if (!event.data.isValid) {
        event.preventDefault(); // Prevents the default action
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

- `event.preventDefault()`: Prevent the default action
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
    // Automatically provide data to all subscribers
    data: {
        formVersion: '1.2.0'
    },
    // Run this method when the event completes
    defaultFunction: 'processFormSubmit',
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

                event.preventDefault();
                return;
            }

            // Validate email format
            if (!/^.+@.+\..+$/.test(formData.email)) {
                console.error('Invalid email format');

                event.preventDefault();
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

                event.preventDefault();
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
                defaultFunction: '_handleCreate',
                lifecycleHost: this
            },
            // Delete operation
            'delete': {
                defaultFunction: '_handleDelete',
                lifecycleHost: this
            },
            // Read operation
            'read': {
                defaultFunction: '_handleRead',
                lifecycleHost: this
            },
            // Update operation
            'update': {
                defaultFunction: '_handleUpdate',
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

    // Default handlers
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

            event.preventDefault();
        }

        if (!data || typeof data !== 'object') {
            console.error(`Invalid data provided`);

            event.preventDefault();
        }
    }

    _validateDelete (event) {
        const {
            id
        } = event.data;

        if (!this.data[id]) {
            console.error(`Id ${id} does not exist`);

            event.preventDefault();
        }
    }

    _validateUpdate (event) {
        const {
            data,
            id
        } = event.data;

        if (!this.data[id]) {
            console.error(`Id ${id} does not exist`);

            event.preventDefault();
        }

        if (!data || typeof data !== 'object') {
            console.error(`Invalid data provided`);

            event.preventDefault();
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

- **completed**: Whether the event has completed its default stage
- **data**: Data associated with the event
- **dispatchStopped**: Whether dispatch is stopped
- **distributionStopped**: Whether distribution is stopped
- **distributor**: Object distributing the event
- **eventStopped**: Whether event is stopped
- **name**: Name of the event
- **publisher**: Object that published the event
- **stageName**: Current stage name

#### Event Control Methods

- **defaultIsPrevented()**: Returns whether the default stage is prevented
- **isPrevented(stageName)**: Returns whether the given stage is prevented
- **prevent(stageName)**: Prevents the given stage
- **preventDefault()**: Prevent the default action
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
    // Complete the event only once
    completeOnce: false,
    // Default data to merge with event data
    data: { /* ... */ },
    // Function to run on event completion
    defaultFunction: 'methodName',
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
    // Publish the event only once
    publishOnce: false,
    // Custom event stages
    stages: ['before', 'on', 'default', 'after']
});
```

## Integration with Other isotropic Modules

isotropic-pubsub works seamlessly with other modules in the isotropic ecosystem:

- **isotropic-make**: Create constructor functions with inheritance and mixins
- **isotropic-property-chainer**: Chain property objects through inheritance
- **isotropic-mixin-prototype-chain**: Walk prototype chains including mixins

## Contributing

Please refer to [CONTRIBUTING.md](https://github.com/ibi-group/isotropic-pubsub/blob/main/CONTRIBUTING.md) for contribution guidelines.

## Issues

If you encounter any issues, please file them at https://github.com/ibi-group/isotropic-pubsub/issues
