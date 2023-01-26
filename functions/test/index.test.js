/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

const sinon = require('sinon');

// Require firebase-admin so we can stub out some of its methods.
const admin = require('firebase-admin');
// Require and initialize firebase-functions-test. Since we are not passing in any parameters, it will
// be initialized in an "offline mode", which means we have to stub out all the methods that interact
// with Firebase services.
const test = require('firebase-functions-test')();

// See https://github.com/firebase/functions-samples/blob/master/quickstarts/uppercase/functions/test/test.offline.js
// for an example test definition

describe('Cloud Functions', () => {
  let functionsUnderTest, adminInitStub;

  before(() => {
    adminInitStub = sinon.stub(admin, 'initializeApp');
    functionsUnderTest = require('../index');
  });

  after(() => {
    adminInitStub.restore();
    test.cleanup();
  });

  describe('debugPing', () => {
    let oldFirestore;
    before(() => {
      // Save the old database method so it can be restored after the test.
      oldFirestore = admin.firestore;
    });

    after(() => {
      // Restoring admin.database() to the original method.
      admin.firestore = oldFirestore;
    });

    it('should return domain verification tag on GET request', (done) => {
      const req = {
        method: 'GET'
      };
      const res = {
        send: (body) => {
          assert.match(body, /^<html><head><meta name="google-site-verification" content="[a-zA-Z0-9]{43}" \/><\/head><body><\/body><\/html>$/);
          done();
        }
      };

      functionsUnderTest.debugPing(req, res);
    });

    it('should store debug pings in Firestore', (done) => {
      const firestoreStub = sinon.stub();
      const batchStub = sinon.stub();
      const collectionStub = sinon.stub();
      const clientDocStub = sinon.stub();
      const pingDocStub = sinon.stub();
      const batchSetStub = sinon.stub();

      Object.defineProperty(admin, 'firestore', { get: () => firestoreStub });
      firestoreStub.returns({
        batch: batchStub,
        collection: collectionStub
      });
      batchStub.returns({
        set: batchSetStub,
        commit: () => Promise.resolve('ok')
      });

      collectionStub.withArgs("clients").returns({ doc: clientDocStub });
      const clientDocRef = { type: 'client' };
      clientDocStub.withArgs('test-session').returns(clientDocRef);
      collectionStub.withArgs("pings").returns({ doc: pingDocStub });
      const pingDocRef = { type: 'ping' };
      pingDocStub.withArgs('7e734244-c9a1-439f-8c0e-dbb1ef435a8a').returns(pingDocRef);

      // A fake request object, with req.body set PubSub Push subscription payload
      const req = {
        body: {
          message:
          {
            attributes:
            {
              args: '',
              content_length: '555',
              date: 'Mon, 01 Apr 2019 11:32:41 GMT+00:00',
              document_id: '7e734244-c9a1-439f-8c0e-dbb1ef435a8a',
              document_namespace: 'org-mozilla-reference-browser',
              document_type: 'baseline',
              document_version: '1',
              geo_city: 'Warsaw',
              geo_country: 'PL',
              geo_subdivision1: 'MZ',
              host: 'upstream_docker',
              method: 'POST',
              protocol: 'HTTP/1.0',
              submission_timestamp: '2019-04-01T11:32:41.375743Z',
              uri: '/submit/org-mozilla-reference-browser/baseline/1/7e734244-c9a1-439f-8c0e-dbb1ef435a8a',
              user_agent_browser: 'Glean',
              user_agent_os: 'Android',
              user_agent_version: '0.49.0',
              x_debug_id: 'test-session'
            },
            data: 'H4sIAAAAAAAAAI1TyW7bMBD9FUPXhDKpxbJ0yyk9NGiAuCjQi0CRY5mIRKpcnLpB/r1DOXactCjqi8XZ5703z8kInkvuedI8J/gPSZPcGX29oGxxM9lFRlm9YKzJs6Zgi9u7zRWlDaXJdUzcGYnh918eNvgODmzLe9C+NQ7NN1paoyR6pBFhjPY9WKeMRie7NKtYpYIqL7KiIKLmjBR5vSVrQYHIrmOwLfKSr3nsYhUGL13oRuWXxvZkNL/UMHBiYQsWtADSWfOEwyw77mBQGpZs+Z/Vue3j6Pg1WeONMAO+Pm0290uW0vc7vu1C06KevfNQLlpbr0Zwno8T+iOEhBaEss0JyDSvyqrIv2NSD6bFRKn2KmayiH+0/2wldKE/guOxGHEw10bfzjiP1jA5b4GPLSL5CPa1mDBBe3uIxHw+mZSP72/cOv50ibzmOObERWT9n1i+3/1kbJLbAXicSBjto2cA3fsdOsqyvGzkD1PscWIkecGUQc3k662J2uPT1HZBDXFdRtcrlrGI6UcpwV4JaEcjIVLzcEc2FavnuAtGsgItHgZAjdpD6+TjufSZrFMlrsOWCx/svI/jowu6T97Gi0ld1a26sl6RXNIVKaQsSU2zjNCKcRQUgBAdpmyVdb61Qbevh3RkPidZdUXZ8Wq4FTvlYW6IEdyOq4Lsj+JDBKRy08APl5eS0pTVLI+QTUr3Z8BQXtbPQvugsbzJVlc0O/YDLf8ek2fnmLnsR4ZQzvAjaVj9Mp+6VcIdu1qMjl99pD49xaeDEXyIFUCTrw9x2vkGJpTHn8EyWO7n/Z7nsDZoFRXtAIUUed7zIWAx+oK/3zYmYt6kBAAA',
            messageId: '488471644387249',
            message_id: '488471644387249',
            publishTime: '2019-04-01T11:32:47.754Z',
            publish_time: '2019-04-01T11:32:47.754Z'
          },
          subscription: 'projects/debug-ping-preview/subscriptions/decoded-to-debugview'
        },
        method: 'POST'
      };

      const res = {
        end: () => {
          const clientUpdateQuery = batchSetStub.getCall(0);
          assert.equal(clientUpdateQuery.args[0], clientDocRef);
          expect(clientUpdateQuery.args[1]).to.have.all.keys('lastActive', 'debugId', 'geo', 'os', 'appName');
          const pingUpdateQuery = batchSetStub.getCall(1);
          assert.equal(pingUpdateQuery.args[0], pingDocRef);
          expect(pingUpdateQuery.args[1]).to.have.all.keys('debugId', 'payload', 'pingType', 'addedAt');

          done();
        },
        status: function (s) {
          assert.equal(s, 204);
          return this;
        }
      };

      functionsUnderTest.debugPing(req, res);
    });
  });
})
