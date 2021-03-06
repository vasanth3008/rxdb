import assert from 'assert';

import * as schemas from '../helper/schemas';
import * as schemaObjects from '../helper/schema-objects';
import * as humansCollection from '../helper/humans-collection';

import * as RxDatabase from '../../dist/lib/rx-database';
import * as util from '../../dist/lib/util';
import AsyncTestUtil from 'async-test-util';


describe('hooks.test.js', () => {
    describe('get/set', () => {
        it('should set a hook', async() => {
            const c = await humansCollection.create(0);
            c.preSave(function() {}, false);
        });
        it('should get a hook', async() => {
            const c = await humansCollection.create(0);
            c.preSave(function() {}, false);
            const hooks = c.getHooks('pre', 'save');
            assert.ok(Array.isArray(hooks.series));
            assert.equal(hooks.series.length, 1);
        });
        it('should get a parallel hook', async() => {
            const c = await humansCollection.create(0);
            c.preSave(function() {}, true);
            const hooks = c.getHooks('pre', 'save');
            assert.ok(Array.isArray(hooks.parallel));
            assert.equal(hooks.parallel.length, 1);
        });
    });
    describe('insert', () => {
        describe('pre', () => {
            describe('positive', () => {
                it('series', async() => {
                    const c = await humansCollection.create(0);
                    const human = schemaObjects.human();
                    let count = 0;
                    c.preInsert(function(doc) {
                        assert.equal(doc.constructor.name, 'Object');
                        count++;
                    }, false);
                    await c.insert(human);
                    assert.equal(count, 1);
                });
                it('parallel', async() => {
                    const c = await humansCollection.create(0);
                    const human = schemaObjects.human();
                    let count = 0;
                    c.preInsert(function(doc) {
                        assert.equal(doc.constructor.name, 'Object');
                        count++;
                    }, false);
                    let countp = 0;
                    c.preInsert(function(doc) {
                        assert.equal(doc.constructor.name, 'Object');
                        countp++;
                    }, true);
                    await c.insert(human);
                    assert.equal(count, 1);
                    assert.equal(countp, 1);
                });
                it('should save a modified document', async() => {
                    const c = await humansCollection.createPrimary(0);
                    const human = schemaObjects.simpleHuman();

                    c.preInsert(function(doc) {
                        doc.lastName = 'foobar';
                    }, false);

                    await c.insert(human);
                    const doc = await c.findOne(human.passportId).exec();
                    assert.equal(doc.get('lastName'), 'foobar');
                });
                it('async: should save a modified document', async() => {
                    const c = await humansCollection.createPrimary(0);
                    const human = schemaObjects.simpleHuman();

                    c.preInsert(async function(doc) {
                        await util.promiseWait(10);
                        doc.lastName = 'foobar';
                    }, false);

                    await c.insert(human);
                    const doc = await c.findOne(human.passportId).exec();
                    assert.equal(doc.get('lastName'), 'foobar');
                });
                it('should not insert if hook throws', async() => {
                    const c = await humansCollection.createPrimary(0);
                    const human = schemaObjects.simpleHuman();
                    c.preInsert(() => {
                        throw new Error('foobar');
                    }, false);

                    let failC = 0;
                    try {
                        await c.insert(human);
                    } catch (e) {
                        failC++;
                    }
                    assert.equal(failC, 1);
                    const doc = await c.findOne(human.passportId).exec();
                    assert.equal(doc, null);
                });
            });
            describe('negative', () => {
                it('should throw if hook invalidates schema', async() => {
                    const c = await humansCollection.create(0);
                    const human = schemaObjects.human();

                    c.preInsert(function(doc) {
                        doc.lastName = 1337;
                    }, false);

                    await AsyncTestUtil.assertThrows(
                        () => c.insert(human),
                        Error
                    );
                });
            });
        });
        describe('post', () => {
            describe('positive', () => {
                it('series', async() => {
                    const c = await humansCollection.create(0);
                    const human = schemaObjects.human();
                    let count = 0;
                    c.postInsert(function(doc) {
                        assert.equal(doc.constructor.name, 'RxDocument');
                        count++;
                    }, false);
                    await c.insert(human);
                    assert.equal(count, 1);
                });
                it('parallel', async() => {
                    const c = await humansCollection.create(0);
                    const human = schemaObjects.human();
                    let count = 0;
                    c.postInsert(function(doc) {
                        assert.equal(doc.constructor.name, 'RxDocument');
                        count++;
                    }, true);
                    await c.insert(human);
                    assert.equal(count, 1);
                });
            });
        });
    });
    describe('save', () => {
        describe('pre', () => {
            describe('positive', () => {
                it('series', async() => {
                    const c = await humansCollection.createPrimary(0);
                    const human = schemaObjects.simpleHuman();
                    await c.insert(human);
                    const doc = await c.findOne(human.passportId).exec();
                    let count = 0;
                    c.preSave(function(doc) {
                        assert.equal(doc.constructor.name, 'RxDocument');
                        count++;
                    }, false);
                    doc.set('firstName', 'foobar');
                    await doc.save();
                    assert.equal(count, 1);
                });
                it('parallel', async() => {
                    const c = await humansCollection.createPrimary(0);
                    const human = schemaObjects.simpleHuman();
                    await c.insert(human);
                    const doc = await c.findOne(human.passportId).exec();
                    let count = 0;
                    c.preSave(function(doc) {
                        assert.equal(doc.constructor.name, 'RxDocument');
                        count++;
                    }, true);
                    doc.set('firstName', 'foobar');
                    await doc.save();
                    assert.equal(count, 1);
                });
                it('should save a modified document', async() => {
                    const c = await humansCollection.createPrimary(0);
                    const human = schemaObjects.simpleHuman();
                    await c.insert(human);
                    const doc = await c.findOne(human.passportId).exec();

                    c.preSave(function(doc) {
                        doc.set('lastName', 'foobar');
                    }, false);
                    doc.set('firstName', 'foobar');
                    await doc.save();
                    const doc2 = await c.findOne(human.passportId).exec();
                    assert.equal(doc2.get('lastName'), 'foobar');

                });
                it('async: should save a modified document', async() => {
                    const c = await humansCollection.createPrimary(0);
                    const human = schemaObjects.simpleHuman();
                    await c.insert(human);
                    const doc = await c.findOne(human.passportId).exec();

                    c.preSave(async function(doc) {
                        await util.promiseWait(10);
                        doc.set('lastName', 'foobar');
                    }, false);
                    doc.set('firstName', 'foobar');
                    await doc.save();
                    const doc2 = await c.findOne(human.passportId).exec();
                    assert.equal(doc2.get('lastName'), 'foobar');
                });
                it('should not save if hook throws', async() => {
                    const c = await humansCollection.createPrimary(0);
                    const human = schemaObjects.simpleHuman();
                    human.firstName = 'test';
                    await c.insert(human);
                    const doc = await c.findOne(human.passportId).exec();

                    c.preSave(function() {
                        throw new Error('fail');
                    }, false);

                    doc.set('firstName', 'foobar');
                    let failC = 0;
                    try {
                        await doc.save();
                    } catch (e) {
                        failC++;
                    }
                    assert.equal(failC, 1);
                    const syncValue = await doc.firstName$.first().toPromise();
                    assert.equal(syncValue, 'test');
                });
            });
            describe('negative', () => {
                it('should throw if hook invalidates schema', async() => {
                    const c = await humansCollection.createPrimary(0);
                    const human = schemaObjects.simpleHuman();
                    await c.insert(human);
                    const doc = await c.findOne(human.passportId).exec();

                    c.preSave(function(doc) {
                        doc.set('firstName', 1337);
                    }, false);

                    doc.set('firstName', 'foobar');

                    await AsyncTestUtil.assertThrows(
                        () => doc.save(),
                        Error
                    );
                });
            });
        });
        describe('post', () => {
            describe('positive', () => {
                it('series', async() => {
                    const c = await humansCollection.createPrimary(0);
                    const human = schemaObjects.simpleHuman();
                    await c.insert(human);
                    const doc = await c.findOne(human.passportId).exec();
                    let count = 0;
                    c.postSave(function(doc) {
                        assert.equal(doc.constructor.name, 'RxDocument');
                        count++;
                    }, false);
                    doc.set('firstName', 'foobar');
                    await doc.save();
                    assert.equal(count, 1);
                });
                it('parallel', async() => {
                    const c = await humansCollection.createPrimary(0);
                    const human = schemaObjects.simpleHuman();
                    await c.insert(human);
                    const doc = await c.findOne(human.passportId).exec();
                    let count = 0;
                    c.postSave(function(doc) {
                        assert.equal(doc.constructor.name, 'RxDocument');
                        count++;
                    }, true);
                    doc.set('firstName', 'foobar');
                    await doc.save();
                    assert.equal(count, 1);
                });
            });
            describe('negative', () => {});
        });
    });
    describe('remove', () => {
        describe('pre', () => {
            describe('positive', () => {
                it('series', async() => {
                    const c = await humansCollection.createPrimary(0);
                    const human = schemaObjects.simpleHuman();
                    await c.insert(human);
                    const doc = await c.findOne(human.passportId).exec();
                    let count = 0;
                    c.preRemove(function(doc) {
                        assert.equal(doc.constructor.name, 'RxDocument');
                        count++;
                    }, false);
                    await doc.remove();
                    assert.equal(count, 1);
                });
                it('parallel', async() => {
                    const c = await humansCollection.createPrimary(0);
                    const human = schemaObjects.simpleHuman();
                    await c.insert(human);
                    const doc = await c.findOne(human.passportId).exec();
                    let count = 0;
                    c.preRemove(function(doc) {
                        assert.equal(doc.constructor.name, 'RxDocument');
                        count++;
                    }, true);
                    await doc.remove();
                    assert.equal(count, 1);
                });
                it('should not remove if hook throws', async() => {
                    const c = await humansCollection.createPrimary(0);
                    const human = schemaObjects.simpleHuman();
                    await c.insert(human);
                    const doc = await c.findOne(human.passportId).exec();

                    c.preRemove(function() {
                        throw new Error('fail');
                    }, false);

                    let failC = 0;
                    try {
                        await doc.remove();
                    } catch (e) {
                        failC++;
                    }
                    assert.equal(failC, 1);
                    const doc2 = await c.findOne(human.passportId).exec();
                    assert.notEqual(doc2, null);
                    assert.equal(doc2.get('passportId'), human.passportId);
                });
            });
            describe('negative', () => {});
        });
        describe('post', () => {
            describe('positive', () => {
                it('series', async() => {
                    const c = await humansCollection.createPrimary(0);
                    const human = schemaObjects.simpleHuman();
                    await c.insert(human);
                    const doc = await c.findOne(human.passportId).exec();
                    let count = 0;
                    c.postRemove(function(doc) {
                        assert.equal(doc.constructor.name, 'RxDocument');
                        count++;
                    }, false);
                    await doc.remove();
                    assert.equal(count, 1);
                });
                it('parallel', async() => {
                    const c = await humansCollection.createPrimary(0);
                    const human = schemaObjects.simpleHuman();
                    await c.insert(human);
                    const doc = await c.findOne(human.passportId).exec();
                    let count = 0;
                    c.postRemove(function(doc) {
                        assert.equal(doc.constructor.name, 'RxDocument');
                        count++;
                    }, true);
                    await doc.remove();
                    assert.equal(count, 1);
                });
            });
            describe('negative', () => {});
        });
    });
    describe('postCreate', () => {
        describe('positive', () => {
            it('should define a getter', async() => {
                const db = await RxDatabase.create({
                    name: util.randomCouchString(10),
                    adapter: 'memory',
                    multiInstance: true
                });
                const collection = await db.collection({
                    name: 'myhumans',
                    schema: schemas.primaryHuman
                });
                collection.postCreate(function(doc) {
                    Object.defineProperty(doc, 'myField', {
                        get: () => 'foobar',
                    });
                }, false);

                const human = schemaObjects.simpleHuman();
                await collection.insert(human);
                const doc = await collection.findOne().exec();
                assert.equal('foobar', doc.myField);

                db.destroy();
            });
        });
        describe('negative', () => {
            it('should throw when adding an async-hook', async() => {
                const db = await RxDatabase.create({
                    name: util.randomCouchString(10),
                    adapter: 'memory',
                    multiInstance: true
                });
                const collection = await db.collection({
                    name: 'myhumans',
                    schema: schemas.primaryHuman
                });

                const hookFun = function(doc) {
                    Object.defineProperty(doc, 'myField', {
                        get: () => 'foobar',
                    });
                };

                assert.throws(() => collection.postCreate(hookFun, true));
                db.destroy();
            });
        });
    });
    describe('issues', () => {
        it('BUG #158 : Throwing error in async preInsert does not prevent insert', async() => {
            const c = await humansCollection.create(0);
            c.preInsert(async function() {
                await util.promiseWait(1);
                throw new Error('This throw should prevent the insert');
            }, false);
            let hasThrown = false;
            try {
                await c.insert(schemaObjects.human());
            } catch (e) {
                hasThrown = true;
            }
            assert.ok(hasThrown);
            await util.promiseWait(10);
            const allDocs = await c.find().exec();
            assert.equal(allDocs.length, 0);
        });
    });
});
