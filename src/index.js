const path = require('path')
const nockBack = require('nock').back
const _ = require('lodash')

const Reporter = require('./reporter')

const overrideMethods = [
  'it',
  'fit',
  'xit',
  'beforeAll',
  'beforeEach',
  'afterAll',
  'afterEach'
]

const optionDefaults = {
  fixtureDir: 'test/fixtures',
  global: null,
  defaultMode: 'dryrun',
  generateMockName,
  nock: {
    before,
    after,
    afterRecord
  }
}

function JestAutoNock (options) {
  const env = jasmine.getEnv()
  const testPath = jasmine.testPath
  const opts = Object.assign({ testPath }, optionDefaults, options)
  const nockMode = process.env.NOCK_BACK_MODE || opts.defaultMode || 'dryrun'

  nockBack.fixtures = opts.fixtureDir = path.resolve(opts.fixtureDir)
  nockBack.setMode(nockMode)

  const reporter = new Reporter()
  env.addReporter(reporter)

  overrideMethods.forEach(method => {
    const m = global[method]

    m.nock = bindNock(m, reporter, opts)
  })
}

function bindNock (m, reporter, opts) {
  return function test (...args) {
    const [title, testFn, timeout] = args
    const testFnPromise = testFn && testFn.length ? wrapTestFnCallbackWithPromise(testFn) : testFn

    const nockedTestFn = async () => {
      nockBack.fixtures = path.join(path.dirname(opts.testPath), '__fixtures__')

      const fixtureName = opts.generateMockName(title, opts.testPath, reporter, opts.fixtureDir)
      const { nockDone, context } = await nockBack(fixtureName)

      const ret = testFnPromise.call({ nock: context })

      if (!isPromise(ret)) {
        nockDone()
        return ret
      }

      return ret.finally(() => nockDone())
    }

    m(title, nockedTestFn, timeout)
  }
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function wrapTestFnCallbackWithPromise (testFn) {
  return () => new Promise((resolve, reject) =>
    testFn((err) => err ? reject(err) : resolve())
  )
}

function generateMockName (testTitle, testPath, reporter, fixtureDir) {
  const { currentSpec: { fullName } } = reporter

  return _.kebabCase(`${fullName}`) + '.json'
}

function after (scope) {}

function before (def) {}

function afterRecord (defs) {
  return defs
}

module.exports = JestAutoNock
