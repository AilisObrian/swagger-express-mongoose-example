var should = require('should');
var validateEmail = require('../../../../api/helpers/validation/email');

/* eslint max-nested-callbacks: [2, 10], no-undef: 0, max-len: 0 */
describe('helpers', function() {
  describe('validation', function() {
    describe('email', function() {
      describe('isWellFormedPromise()', function() {
        it('"string" = false', function(done) {
          const result = validateEmail.isWellFormedPromise('string');
          result.catch(() => {
            done();
          });
        });
        it('"string@gmail.com" = true', function(done) {
          const result = validateEmail.isWellFormedPromise('string@gmail.com');
          result.then(() => {
            done();
          });
        });
      });
      //
      describe('isNotDuplicatedPromise()', function() {
        const dbURI = "mongodb://localhost/test";
        const mongoose = require('mongoose');
        const userModel = mongoose.model('User', new mongoose.Schema({email: String}));
        const existedEmail = 'existed@gmail.com';

        beforeEach(function(done) {
          if (mongoose.connection.db) {
            return done();
          }

          mongoose.connect(dbURI, done);
        });

        beforeEach(function(done) {
          userModel({email: existedEmail}).save(done);
        });

        afterEach(function(done) {
          userModel.remove({}, err => {
            should.not.exist(err);
            done();
          });
        });

        it('[PREP] tester can connect to mongoose', function(done) {
          done();
        });

        it('[PREP] tester can find "existed@gmail.com"', function(done) {
          userModel.findOne({email: {$eq: existedEmail}}).exec().then(
            ret => {
              if (ret !== null) {
                done();
              }
            }
          );
        });

        it('"string" = true', function(done) {
          const result = validateEmail.isNotDuplicatedPromise(userModel, 'string');
          result.then(() => {
            done();
          });
        });

        it('"string@gmail.com" = true', function(done) {
          const result = validateEmail.isNotDuplicatedPromise(userModel, 'string@gmail.com');
          result.then(() => {
            done();
          });
        });

        it('"non_existed@gmail.com" = true', function(done) {
          const result = validateEmail.isNotDuplicatedPromise(userModel, 'non_existed@gmail.com');
          result.then(() => {
            done();
          });
        });

        it('"existed@gmail.com" = false', function(done) {
          const result = validateEmail.isNotDuplicatedPromise(userModel, existedEmail);
          result.catch(() => {
            done();
          });
        });
      });
    });
  });
});
