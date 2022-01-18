const test = require('ava')
const path = require('path')
const rimraf = require('rimraf')
const Spike = require('spike-core')

const p = path.join(__dirname, '..')

test.cb.before((t) => {
  rimraf(path.join(p, 'public'), () => { t.end() })
})

// this test simply ensures your project compiles properly
// for more reliability, you'll want to edit or add your own tests
test('compiles project with spike', (t) => {
  const project = new Spike({ root: p })
  return new Promise((resolve, reject) => {
    project.on('error', reject)
    project.on('warning', reject)
    project.on('compile', resolve)
    project.compile()
  }).then(() => { t.pass() }, (err) => { t.fail(err.message) })
})
