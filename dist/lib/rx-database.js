'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RxSchema = exports.checkAdapter = exports.removeDatabase = exports.create = exports.RxDatabase = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var create = exports.create = function () {
    var _ref8 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee7(_ref7) {
        var name = _ref7.name,
            adapter = _ref7.adapter,
            password = _ref7.password,
            _ref7$multiInstance = _ref7.multiInstance,
            multiInstance = _ref7$multiInstance === undefined ? true : _ref7$multiInstance;
        var db;
        return _regenerator2['default'].wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        util.validateCouchDBString(name);

                        // check if pouchdb-adapter

                        if (!(typeof adapter == 'string')) {
                            _context7.next = 6;
                            break;
                        }

                        if (!(!_pouchDb2['default'].adapters || !_pouchDb2['default'].adapters[adapter])) {
                            _context7.next = 4;
                            break;
                        }

                        throw new Error('Adapter ' + adapter + ' not added.\n                 Use RxDB.plugin(require(\'pouchdb-adapter-' + adapter + '\');');

                    case 4:
                        _context7.next = 9;
                        break;

                    case 6:
                        util.isLevelDown(adapter);

                        if (!(!_pouchDb2['default'].adapters || !_pouchDb2['default'].adapters.leveldb)) {
                            _context7.next = 9;
                            break;
                        }

                        throw new Error('To use leveldown-adapters, you have to add the leveldb-plugin.\n                 Use RxDB.plugin(require(\'pouchdb-adapter-leveldb\'));');

                    case 9:

                        if (password) _overwritable2['default'].validatePassword(password);

                        db = new RxDatabase(name, adapter, password, multiInstance);
                        _context7.next = 13;
                        return db.prepare();

                    case 13:

                        (0, _hooks.runPluginHooks)('createRxDatabase', db);
                        return _context7.abrupt('return', db);

                    case 15:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    return function create(_x5) {
        return _ref8.apply(this, arguments);
    };
}();

var removeDatabase = exports.removeDatabase = function () {
    var _ref9 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee8(databaseName, adapter) {
        var adminPouch, socketPouch, collectionsPouch, collectionsData;
        return _regenerator2['default'].wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        adminPouch = _internalAdminPouch(databaseName, adapter);
                        socketPouch = _spawnPouchDB2(databaseName, adapter, '_socket', 0);
                        collectionsPouch = _internalCollectionsPouch(databaseName, adapter);
                        _context8.next = 5;
                        return collectionsPouch.allDocs({
                            include_docs: true
                        });

                    case 5:
                        collectionsData = _context8.sent;


                        // remove collections
                        Promise.all(collectionsData.rows.map(function (colDoc) {
                            return colDoc.id;
                        }).map(function (id) {
                            var split = id.split('-');
                            var name = split[0];
                            var version = parseInt(split[1], 10);
                            var pouch = _spawnPouchDB2(databaseName, adapter, name, version);
                            return pouch.destroy();
                        }));

                        // remove internals
                        _context8.next = 9;
                        return Promise.all([collectionsPouch.destroy(), adminPouch.destroy(), socketPouch.destroy()]);

                    case 9:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, this);
    }));

    return function removeDatabase(_x7, _x8) {
        return _ref9.apply(this, arguments);
    };
}();

/**
 * check is the given adapter can be used
 */


var checkAdapter = exports.checkAdapter = function () {
    var _ref10 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee9(adapter) {
        return _regenerator2['default'].wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        _context9.next = 2;
                        return _overwritable2['default'].checkAdapter(adapter);

                    case 2:
                        return _context9.abrupt('return', _context9.sent);

                    case 3:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    }));

    return function checkAdapter(_x9) {
        return _ref10.apply(this, arguments);
    };
}();

exports.properties = properties;
exports.isInstanceOf = isInstanceOf;

var _randomToken = require('random-token');

var _randomToken2 = _interopRequireDefault(_randomToken);

var _pouchDb = require('./pouch-db');

var _pouchDb2 = _interopRequireDefault(_pouchDb);

var _util = require('./util');

var util = _interopRequireWildcard(_util);

var _rxCollection = require('./rx-collection');

var _rxCollection2 = _interopRequireDefault(_rxCollection);

var _rxSchema = require('./rx-schema');

var _rxSchema2 = _interopRequireDefault(_rxSchema);

var _rxChangeEvent = require('./rx-change-event');

var _rxChangeEvent2 = _interopRequireDefault(_rxChangeEvent);

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

var _overwritable = require('./overwritable');

var _overwritable2 = _interopRequireDefault(_overwritable);

var _hooks = require('./hooks');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var RxDatabase = exports.RxDatabase = function () {
    function RxDatabase(name, adapter, password, multiInstance) {
        (0, _classCallCheck3['default'])(this, RxDatabase);

        this.name = name;
        this.adapter = adapter;
        this.password = password;
        this.multiInstance = multiInstance;

        this.token = (0, _randomToken2['default'])(10);

        this.subs = [];
        this.destroyed = false;

        // cache for collection-objects
        this.collections = {};

        // rx
        this.subject = new util.Rx.Subject();
        this.observable$ = this.subject.asObservable().filter(function (cEvent) {
            return _rxChangeEvent2['default'].isInstanceOf(cEvent);
        });
    }

    (0, _createClass3['default'])(RxDatabase, [{
        key: 'prepare',


        /**
         * do the async things for this database
         */
        value: function () {
            var _ref = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee() {
                var _this = this;

                var pwHashDoc;
                return _regenerator2['default'].wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!this.password) {
                                    _context.next = 22;
                                    break;
                                }

                                _context.next = 3;
                                return this._adminPouch.info();

                            case 3:
                                // ensure admin-pouch is useable
                                pwHashDoc = null;
                                _context.prev = 4;
                                _context.next = 7;
                                return this._adminPouch.get('_local/pwHash');

                            case 7:
                                pwHashDoc = _context.sent;
                                _context.next = 12;
                                break;

                            case 10:
                                _context.prev = 10;
                                _context.t0 = _context['catch'](4);

                            case 12:
                                if (pwHashDoc) {
                                    _context.next = 20;
                                    break;
                                }

                                _context.prev = 13;
                                _context.next = 16;
                                return this._adminPouch.put({
                                    _id: '_local/pwHash',
                                    value: util.hash(this.password)
                                });

                            case 16:
                                _context.next = 20;
                                break;

                            case 18:
                                _context.prev = 18;
                                _context.t1 = _context['catch'](13);

                            case 20:
                                if (!(pwHashDoc && this.password && util.hash(this.password) != pwHashDoc.value)) {
                                    _context.next = 22;
                                    break;
                                }

                                throw new Error('another instance on this adapter has a different password');

                            case 22:
                                if (!this.multiInstance) {
                                    _context.next = 27;
                                    break;
                                }

                                _context.next = 25;
                                return _socket2['default'].create(this);

                            case 25:
                                this.socket = _context.sent;


                                // TODO only subscribe when sth is listening to the event-chain
                                this.subs.push(this.socket.messages$.subscribe(function (cE) {
                                    return _this.$emit(cE);
                                }));

                            case 27:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[4, 10], [13, 18]]);
            }));

            function prepare() {
                return _ref.apply(this, arguments);
            }

            return prepare;
        }()
    }, {
        key: '_spawnPouchDB',


        /**
         * spawns a new pouch-instance
         * @param {string} collectionName
         * @param {string} schemaVersion
         * @param {Object} [pouchSettings={}] pouchSettings
         * @type {Object}
         */
        value: function _spawnPouchDB(collectionName, schemaVersion) {
            var pouchSettings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            return _spawnPouchDB2(this.name, this.adapter, collectionName, schemaVersion, pouchSettings);
        }
    }, {
        key: 'waitForLeadership',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee2() {
                return _regenerator2['default'].wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (this.multiInstance) {
                                    _context2.next = 2;
                                    break;
                                }

                                return _context2.abrupt('return', true);

                            case 2:
                                return _context2.abrupt('return', this.leaderElector.waitForLeadership());

                            case 3:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function waitForLeadership() {
                return _ref2.apply(this, arguments);
            }

            return waitForLeadership;
        }()

        /**
         * writes the changeEvent to the socket
         * @param  {RxChangeEvent} changeEvent
         * @return {Promise<boolean>}
         */

    }, {
        key: 'writeToSocket',
        value: function writeToSocket(changeEvent) {
            if (this.multiInstance && !changeEvent.isIntern() && this.socket) {
                return this.socket.write(changeEvent).then(function () {
                    return true;
                });
            } else return Promise.resolve(false);
        }

        /**
         * throw a new event into the event-cicle
         */

    }, {
        key: '$emit',
        value: function $emit(changeEvent) {
            if (!changeEvent) return;

            // throw in own cycle
            this.subject.next(changeEvent);

            // write to socket if event was created by self
            if (changeEvent.data.it == this.token) this.writeToSocket(changeEvent);
        }

        /**
         * @return {Observable} observable
         */

    }, {
        key: '_collectionNamePrimary',


        /**
         * returns the primary for a given collection-data
         * used in the internal pouchdb-instances
         * @param {string} name
         * @param {RxSchema} schema
         */
        value: function _collectionNamePrimary(name, schema) {
            return name + '-' + schema.version;
        }

        /**
         * removes the collection-doc from this._collectionsPouch
         * @return {Promise}
         */

    }, {
        key: 'removeCollectionDoc',
        value: function removeCollectionDoc(name, schema) {
            var _this2 = this;

            var docId = this._collectionNamePrimary(name, schema);
            return this._collectionsPouch.get(docId).then(function (doc) {
                return _this2._collectionsPouch.remove(doc);
            });
        }

        /**
         * removes all internal docs of a given collection
         * @param  {string}  collectionName
         * @return {Promise<string[]>} resolves all known collection-versions
         */

    }, {
        key: '_removeAllOfCollection',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee3(collectionName) {
                var _this3 = this;

                var data, relevantDocs;
                return _regenerator2['default'].wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this._collectionsPouch.allDocs({
                                    include_docs: true
                                });

                            case 2:
                                data = _context3.sent;
                                relevantDocs = data.rows.map(function (row) {
                                    return row.doc;
                                }).filter(function (doc) {
                                    var name = doc._id.split('-')[0];
                                    return name == collectionName;
                                });
                                _context3.next = 6;
                                return Promise.all(relevantDocs.map(function (doc) {
                                    return _this3._collectionsPouch.remove(doc);
                                }));

                            case 6:
                                return _context3.abrupt('return', relevantDocs.map(function (doc) {
                                    return doc.version;
                                }));

                            case 7:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function _removeAllOfCollection(_x2) {
                return _ref3.apply(this, arguments);
            }

            return _removeAllOfCollection;
        }()

        /**
         * create or fetch a collection
         * @param {{name: string, schema: Object, pouchSettings = {}, migrationStrategies = {}}} args
         * @return {Collection}
         */

    }, {
        key: 'collection',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee4(args) {
                var _this4 = this;

                var internalPrimary, schemaHash, collectionDoc, collection, cEvent;
                return _regenerator2['default'].wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                args.database = this;

                                if (!(args.name.charAt(0) == '_')) {
                                    _context4.next = 3;
                                    break;
                                }

                                throw new Error('collection(' + args.name + '): collection-names cannot start with underscore _');

                            case 3:
                                if (!this.collections[args.name]) {
                                    _context4.next = 5;
                                    break;
                                }

                                throw new Error('collection(' + args.name + ') already exists. use myDatabase.' + args.name + ' to get it');

                            case 5:
                                if (args.schema) {
                                    _context4.next = 7;
                                    break;
                                }

                                throw new Error('collection(' + args.name + '): schema is missing');

                            case 7:

                                if (!_rxSchema2['default'].isInstanceOf(args.schema)) args.schema = _rxSchema2['default'].create(args.schema);

                                internalPrimary = this._collectionNamePrimary(args.name, args.schema);

                                // check unallowed collection-names

                                if (!properties().includes(args.name)) {
                                    _context4.next = 11;
                                    break;
                                }

                                throw new Error('Collection-name ' + args.name + ' not allowed');

                            case 11:

                                // check schemaHash
                                schemaHash = args.schema.hash;
                                collectionDoc = null;
                                _context4.prev = 13;
                                _context4.next = 16;
                                return this._collectionsPouch.get(internalPrimary);

                            case 16:
                                collectionDoc = _context4.sent;
                                _context4.next = 21;
                                break;

                            case 19:
                                _context4.prev = 19;
                                _context4.t0 = _context4['catch'](13);

                            case 21:
                                if (!(collectionDoc && collectionDoc.schemaHash != schemaHash)) {
                                    _context4.next = 23;
                                    break;
                                }

                                throw new Error('collection(' + args.name + '): another instance created this collection with a different schema');

                            case 23:
                                _context4.next = 25;
                                return _rxCollection2['default'].create(args);

                            case 25:
                                collection = _context4.sent;

                                if (!(Object.keys(collection.schema.encryptedPaths).length > 0 && !this.password)) {
                                    _context4.next = 28;
                                    break;
                                }

                                throw new Error('collection(' + args.name + '): schema encrypted but no password given');

                            case 28:
                                if (collectionDoc) {
                                    _context4.next = 36;
                                    break;
                                }

                                _context4.prev = 29;
                                _context4.next = 32;
                                return this._collectionsPouch.put({
                                    _id: internalPrimary,
                                    schemaHash: schemaHash,
                                    schema: collection.schema.normalized,
                                    version: collection.schema.version
                                });

                            case 32:
                                _context4.next = 36;
                                break;

                            case 34:
                                _context4.prev = 34;
                                _context4.t1 = _context4['catch'](29);

                            case 36:
                                cEvent = _rxChangeEvent2['default'].create('RxDatabase.collection', this);

                                cEvent.data.v = collection.name;
                                cEvent.data.col = '_collections';
                                this.$emit(cEvent);

                                this.collections[args.name] = collection;
                                this.__defineGetter__(args.name, function () {
                                    return _this4.collections[args.name];
                                });

                                return _context4.abrupt('return', collection);

                            case 43:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[13, 19], [29, 34]]);
            }));

            function collection(_x3) {
                return _ref4.apply(this, arguments);
            }

            return collection;
        }()

        /**
         * delete all data of the collection and its previous versions
         * @param  {string}  collectionName
         * @return {Promise}
         */

    }, {
        key: 'removeCollection',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee5(collectionName) {
                var _this5 = this;

                var knownVersions, pouches;
                return _regenerator2['default'].wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (!this.collections[collectionName]) {
                                    _context5.next = 3;
                                    break;
                                }

                                _context5.next = 3;
                                return this.collections[collectionName].destroy();

                            case 3:
                                _context5.next = 5;
                                return this._removeAllOfCollection(collectionName);

                            case 5:
                                knownVersions = _context5.sent;

                                // get all relevant pouchdb-instances
                                pouches = knownVersions.map(function (v) {
                                    return _this5._spawnPouchDB(collectionName, v);
                                });

                                // remove documents

                                return _context5.abrupt('return', Promise.all(pouches.map(function (pouch) {
                                    return pouch.destroy();
                                })));

                            case 8:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function removeCollection(_x4) {
                return _ref5.apply(this, arguments);
            }

            return removeCollection;
        }()

        /**
         * export to json
         * @param {boolean} decrypted
         * @param {?string[]} collections array with collectionNames or null if all
         */

    }, {
        key: 'dump',
        value: function dump() {
            throw RxError.pluginMissing('json-dump');
        }

        /**
         * import json
         * @param {Object} dump
         */

    }, {
        key: 'importDump',
        value: function importDump() {
            throw RxError.pluginMissing('json-dump');
        }
    }, {
        key: 'destroy',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee6() {
                var _this6 = this;

                return _regenerator2['default'].wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                if (!this.destroyed) {
                                    _context6.next = 2;
                                    break;
                                }

                                return _context6.abrupt('return');

                            case 2:
                                this.destroyed = true;
                                this.socket && this.socket.destroy();

                                if (!this._leaderElector) {
                                    _context6.next = 7;
                                    break;
                                }

                                _context6.next = 7;
                                return this._leaderElector.destroy();

                            case 7:
                                this.subs.map(function (sub) {
                                    return sub.unsubscribe();
                                });
                                Object.keys(this.collections).map(function (key) {
                                    return _this6.collections[key];
                                }).map(function (col) {
                                    return col.destroy();
                                });

                            case 9:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function destroy() {
                return _ref6.apply(this, arguments);
            }

            return destroy;
        }()

        /**
         * deletes the database and its stored data
         * @return {Promise}
         */

    }, {
        key: 'remove',
        value: function remove() {
            var _this7 = this;

            return this.destroy().then(function () {
                return removeDatabase(_this7.name, _this7.adapter);
            });
        }
    }, {
        key: '_adminPouch',
        get: function get() {
            if (!this.__adminPouch) this.__adminPouch = _internalAdminPouch(this.name, this.adapter);
            return this.__adminPouch;
        }
    }, {
        key: '_collectionsPouch',
        get: function get() {
            if (!this.__collectionsPouch) this.__collectionsPouch = _internalCollectionsPouch(this.name, this.adapter);
            return this.__collectionsPouch;
        }
    }, {
        key: 'leaderElector',
        get: function get() {
            if (!this._leaderElector) this._leaderElector = _overwritable2['default'].createLeaderElector(this);
            return this._leaderElector;
        }
    }, {
        key: 'isLeader',
        get: function get() {
            if (!this.multiInstance) return true;
            return this.leaderElector.isLeader;
        }
    }, {
        key: '$',
        get: function get() {
            return this.observable$;
        }
    }]);
    return RxDatabase;
}();

/**
 * returns all possible properties of a RxDatabase-instance
 * @return {string[]} property-names
 */


var _properties = null;
function properties() {
    if (!_properties) {
        var pseudoInstance = new RxDatabase();
        var ownProperties = Object.getOwnPropertyNames(pseudoInstance);
        var prototypeProperties = Object.getOwnPropertyNames(Object.getPrototypeOf(pseudoInstance));
        _properties = [].concat((0, _toConsumableArray3['default'])(ownProperties), (0, _toConsumableArray3['default'])(prototypeProperties));
    }
    return _properties;
}

function _spawnPouchDB2(dbName, adapter, collectionName, schemaVersion) {
    var pouchSettings = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    var pouchLocation = dbName + '-rxdb-' + schemaVersion + '-' + collectionName;
    return new _pouchDb2['default'](pouchLocation, util.adapterObject(adapter), pouchSettings);
}

function _internalAdminPouch(name, adapter) {
    return _spawnPouchDB2(name, adapter, '_admin', 0, {
        auto_compaction: false, // no compaction because this only stores local documents
        revs_limit: 1
    });
}

function _internalCollectionsPouch(name, adapter) {
    return _spawnPouchDB2(name, adapter, '_collections', 0, {
        auto_compaction: false, // no compaction because this only stores local documents
        revs_limit: 1
    });
}

;

function isInstanceOf(obj) {
    return obj instanceof RxDatabase;
}

// TODO is this needed?
exports.RxSchema = _rxSchema2['default'];
exports['default'] = {
    create: create,
    removeDatabase: removeDatabase,
    checkAdapter: checkAdapter,
    isInstanceOf: isInstanceOf,
    RxDatabase: RxDatabase,
    RxSchema: _rxSchema2['default']
};
