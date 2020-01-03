const _ = require('lodash')
const path = require('path')
const JestAutoNock = require('../src')

JestAutoNock({
  generateMockName (testTitle, testPath, reporter) {
    const { currentSpec, currentSuite } = reporter
    const dirName = path.basename(testPath, '.test.js')
    const fullName = currentSpec
      ? currentSpec.fullName
      : `${currentSuite.fullName} ${testTitle}`

    return `${dirName}/${_.kebabCase(fullName)}.json`
  }
})
