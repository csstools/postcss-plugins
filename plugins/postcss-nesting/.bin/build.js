import esbuild from 'esbuild'
import fs from 'node:fs/promises'
import zlib from 'node:zlib'

const variants = {
	esm: {
		extension: 'mjs',
		transform(code, exports) {
			const esmExports = []
			for (const name in exports) esmExports.push(`${exports[name]} as ${name}`)
			return `${code}export{${esmExports.join(',')}}`
		},
	},
	cjs: {
		extension: 'cjs',
		transform(code, exports) {
			const cjsExports = ['__esModule:!0']
			for (const name in exports) cjsExports.push(`${name}:${exports[name]}`)
			return `${code}module.exports={${cjsExports.join(',')}}`
		},
	},
}

async function buildPackage(src) {
	const packageUrl = src
	const initPackageUrl = new URL('src/', packageUrl)
	const distPackageUrl = new URL('dist/', packageUrl)

	const packageJsonUrl = new URL(`package.json`, packageUrl)
	const packageName = JSON.parse(await fs.readFile(packageJsonUrl, 'utf8')).name

	console.log(packageName)
	console.log()

	const targetPathname = new URL('index.js', initPackageUrl).pathname
	const outputPathname = new URL('index.js', distPackageUrl).pathname

	// Build ESM version
	const {
		outputFiles: [cmapResult, codeResult],
	} = await esbuild.build({
		entryPoints: [targetPathname],
		outfile: outputPathname,
		bundle: true,
		format: 'esm',
		sourcemap: 'external',
		external: ['postcss'],
		write: false,
	})

	const code = codeResult.text
	const map = cmapResult.text

	// ensure empty dist directory
	await fs.mkdir(distPackageUrl, { recursive: true })

	// write map
	fs.writeFile(new URL(`index.map`, distPackageUrl), map)

	// prepare variations
	const splitByExport = (code, index = code.indexOf('export')) => [code.slice(0, index), code.slice(index)]
	const [lead, tail] = splitByExport(code)

	const exports = Array.from(tail.matchAll(/([$\w]+) as (\w+)/g)).reduce((exports, each) => Object.assign(exports, { [each[2]]: each[1] }), Object.create(null))

	// write variation builds
	for (const variant in variants) {
		const variantInfo = variants[variant]
		const variantPath = new URL(`dist/index.${variantInfo.extension}`, packageUrl).pathname
		const variantCode = variantInfo.transform(lead, exports)
		const variantSize = (Buffer.byteLength(variantCode, 'utf8') / 1000).toFixed()
		const variantGzip = Number((zlib.gzipSync(variantCode, { level: 9 }).length / 1000).toFixed(2))

		console.log(' ', `\x1b[33m${variantSize} kB\x1b[0m \x1b[2m/\x1b[0m \x1b[33m${variantGzip} kB\x1b[0m`, `\x1b[2m(${variant})\x1b[0m`)

		await fs.writeFile(variantPath, variantCode + `\n//# sourceMappingUrl=index.map`)
	}
}

export default buildPackage

const metaUrl = new URL(import.meta.url)
const argvUrl = new URL(process.argv[1], 'file:')

if (metaUrl.href === argvUrl.href) {
	/** Root directory. */
	const rootUrl = new URL('../', metaUrl)

	console.log()

	await buildPackage(rootUrl)
}
