/* eslint-env jest */

const axios = require('axios')

describe('jest test fns', () => {
  it('should run', async () => {
    expect(true).toBe(true)
  })

  it.nock('should wrap an async fn', (done) => {
    expect(false).toBe(false)
    done()
  })

  it.nock('should record fixtures for http calls', async () => {
    const response = await axios.get('http://echo.jsontest.com/one/1/two/2')

    expect(response.status).toBe(200)
    expect(response.data).toEqual({
      one: '1',
      two: '2'
    })
  })

  describe('should do nested stuff', () => {
    describe('nested', () => {
      describe('nested once more', () => {
        it.nock('make it so', async () => {
          const response = await axios.get('http://echo.jsontest.com/key1/val1/key2/val2')

          expect(response.status).toBe(200)
          expect(response.data).toEqual({
            key1: 'val1',
            key2: 'val2'
          })
        })
      })
    })
  })
})
