import { strict as assert } from 'node:assert'
import { promises as fs } from 'node:fs'
import postcss from 'postcss'
import process from 'node:process'

import plugin from '../src/postcss-8-nesting.js'

let workingUrl = new URL(`${process.cwd()}/`, `file:`)

export default async function tape() {
	let failures = 0

	failures += await test('supports basic usage', { basename: 'basic' })
	failures += await test('supports at-rule usage', { basename: 'at-rule' })
	failures += await test('supports direct usage', { basename: 'direct' })
	failures += await test('removes empty rules', { basename: 'empty' })
	failures += await test('supports nested @container', { basename: 'container' })
	failures += await test('supports nested @media', { basename: 'media' })
	failures += await test('ignores invalid entries', { basename: 'ignore' })
	failures += await test('supports complex entries', { basename: 'complex' })

	let mixinPlugin = () => {
		return {
			postcssPlugin: 'mixin',
			AtRule: {
				mixin(node) {
					node.replaceWith('& .in{ &.deep { color: blue; }}')
				},
			},
		}
	}
	mixinPlugin.postcss = true
	failures += await test('supports other visitors', { basename: 'mixin' }, mixinPlugin)

	return failures === 0
}

async function test(name, init, ...plugins) {
	const { basename } = Object(init)

	let sourceUrl = new URL(`test/${basename}.css`, workingUrl)
	let expectUrl = new URL(`test/${basename}.expect.css`, workingUrl)
	let resultUrl = new URL(`test/${basename}.result.css`, workingUrl)

	plugins.unshift(plugin)

	let sourceCss = await fs.readFile(sourceUrl, 'utf8')
	let expectCss = await fs.readFile(expectUrl, 'utf8')
	let resultCss = await postcss(plugins).process(sourceCss, { from: sourceCss, to: resultUrl }).css

	try {
		assert.equal(resultCss, expectCss)

		console.log(`\x1b[42m\x1b[30m PASS \x1b[0m`, name)

		return 0
	} catch (error) {
		console.error(`\x1b[41m\x1b[30m FAIL \x1b[0m`, name)
		console.error(error.stack)

		return 1
	}
}

if (new URL(process.argv[1], 'file:').href === import.meta.url) {
	tape().then(
		() => process.exit(0),
		() => process.exit(1),
	)
}
