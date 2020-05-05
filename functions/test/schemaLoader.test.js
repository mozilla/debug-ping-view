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
