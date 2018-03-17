/**
 * Created by clx on 2017/10/9.
 */
var proxyquire = require('proxyquire'),
    path = require('path'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    finelets = require('@finelets/hyper-rest');

describe('Textrade', function () {
    var stubs, err;
    beforeEach(function () {
        stubs = {};
        err = new Error('any error message');
    });

    describe('数据库', function () {
        var dbConnection, Schema;
        beforeEach(function(done) {
            mongoose.Promise = global.Promise;
            if (mongoose.connection.db) return done();
            mongoose.connect(dbURI, done);
            //initDB(insertDocsInSequential, done);
            //initDB(insertDocsInParallel, done);
        });

        it('Db object saver', function () {
            var dbSchema = new mongoose.Schema({
                "foo": String,
                "fee": String
            });
            Schema = mongoose.model('coll', dbSchema);
            var save = finelets.db.mongoDb.save;

            dataToAdd = {foo: "foo", fee: "fee"};
            return save(Schema, dataToAdd)
                .then(function (data) {
                    expect(data).not.null;
                })
        });
    });

    it('test', function () {
        //test for remote repo 5
    })
});
