/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const chai = require('chai');
const assert = chai.assert;


describe('Schema loader', () => {
  schemaLoader = require('../schemaLoader');

  describe('extractSchemaInfo', () => {
    it('should extract schema hash and deploy time from the label', () => {
      const schemasBuildIdLabel = "202005050149_a381200";
      let extractedHash = schemaLoader.testables.extractSchemaHash(schemasBuildIdLabel);
      assert.deepEqual(extractedHash, {hash: "a381200", timestamp: "202005050149"})
    });
  });
})
