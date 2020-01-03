class Reporter {
  constructor () {
    this.currentSpec = undefined
    this.currentSuite = undefined
    this.totalSpecsDefined = undefined
    this.suites = undefined
    this.specs = undefined
  }

  findSpec (id) {
    return this.specs.find(s => s.id === id)
  }

  findSuite (id) {
    return this.suites.find(s => s.id === id)
  }

  jasmineStarted (suiteInfo) {
    this.totalSpecsDefined = suiteInfo.totalSpecsDefined
    this.suites = []
    this.specs = []
  }

  suiteStarted (result) {
    const suite = this.findSuite(result.id)
    if (!suite) {
      this.suites.push(result)
    }
    this.currentSuite = { ...result }
  }

  specStarted (result) {
    const spec = this.findSpec(result.id)
    if (!spec) {
      this.specs.push(result)
    }
    this.currentSpec = { ...result }
  }

  specDone (result) {
    delete this.currentSpec
  }

  suiteDone (result) {
    delete this.currentSuite
  }

  jasmineDone () {
    delete this.totalSpecsDefined
    delete this.suites
    delete this.specs
  }
}

module.exports = Reporter
