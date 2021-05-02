import esbuild from 'esbuild'
import fs from 'node:fs/promises'
import zlib from 'node:zlib'

/** @typedef {{ [name: string]: string }} Exports */
/** @typedef {{ extension: string, transform(code: string, exports: Exports): string }} Variant */
/** @type {{ [name: string]: Variant }} */
const variants = {
	esm: {
		extension: 'mjs',
		transform(code, exports) {
			/** @type {string[]} */
			const esmExports = []
			for (const name in exports) esmExports.push(`${exports[name]} as ${name}`)
			return (
				esmExports.length
					? `${code}export{${esmExports.join(',')}}`
				: code
			)
		},
	},
	cjs: {
		extension: 'cjs',
		transform(code, exports) {
			/** @type {string[]} */
			const cjsExports = []
			for (const name in exports) cjsExports.push(`${name}:${exports[name]}`)
			return (
				cjsExports.length
					? 'default' in exports
						? `${code}module.exports=Object.assign(${exports.default},{${cjsExports.join(',')}})`
					: `${code}module.exports={${cjsExports.join(',')}}`
				: code
			)
		},
	},
}

/** @type {(pkgUrl: URL, name: string) => Promise<void>} */
async function buildPackage(pkgUrl, base) {
	const srcDirUrl = new URL(`src/`, pkgUrl)
	const outDirUrl = new URL(`${base}/`, pkgUrl)

	/** @type {{ name: string }} */
	const { name } = JSON.parse(
		await fs.readFile(
			new URL('package.json', pkgUrl),
			'utf8'
		)
	)

	console.log(base)
	console.log()

	const srcPath = new URL(`${base}.js`, srcDirUrl).pathname
	const outPath = new URL(`${base}.js`, outDirUrl).pathname

	// Build ESM version
	const {
		outputFiles: [cmapResult, codeResult],
	} = await esbuild.build({
		entryPoints: [srcPath],
		outfile: outPath,
		bundle: true,
		format: 'esm',
		sourcemap: 'external',
		external: ['postcss'],
		write: false,
	})

	const code = codeResult.text
	const map = cmapResult.text

	// ensure empty dist directory
	await fs.mkdir(outDirUrl, { recursive: true })

	// write map
	await fs.writeFile(new URL(`${name}.map`, outDirUrl), map)

	// prepare variations
	/** @type {(code: string, index?: number) => [string, string]} */
	const splitByExport = (code, index = code.indexOf('export')) => [code.slice(0, index), code.slice(index)]
	const [lead, tail] = splitByExport(code)

	/** @type {{ [name: string]: string }} */
	const exports = Array.from(tail.matchAll(/([$\w]+) as (\w+)/g)).reduce((exports, each) => Object.assign(exports, { [each[2]]: each[1] }), Object.create(null))

	// write variation builds
	for (const variant in variants) {
		/** @type {Variant} */
		const variantInfo = variants[variant]
		const variantPath = new URL(`${base}/${name}.${variantInfo.extension}`, pkgUrl).pathname
		const variantCode = variantInfo.transform(lead, exports)
		const variantSize = (Buffer.byteLength(variantCode, 'utf8') / 1000).toFixed()
		const variantGzip = Number((zlib.gzipSync(variantCode, { level: 9 }).length / 1000).toFixed(2))

		console.log(' ', `\x1b[33m${variantSize} kB\x1b[0m \x1b[2m/\x1b[0m \x1b[33m${variantGzip} kB\x1b[0m`, `\x1b[2m(${variant})\x1b[0m`)

		await fs.writeFile(variantPath, variantCode + `\n//# sourceMappingUrl=index.map`)

		const packageJSON = JSON.stringify({
			private: true,
			type: 'module',
			main: `${name}.cjs`,
			module: `${name}.mjs`,
			jsdelivr: `${name}.mjs`,
			unpkg: `${name}.mjs`,
			files: [
				`${name}.cjs`,
				`${name}.mjs`
			],
			exports: {
				'.': {
					import: `./${name}.mjs`,
					require: `./${name}.cjs`,
					default: `./${name}.mjs`
				}
			}
		}, null, '  ')

		await fs.writeFile(new URL('package.json', outDirUrl), packageJSON)
	}
}

export default buildPackage

const metaUrl = new URL(import.meta.url)
const argvUrl = new URL(process.argv[1], 'file:')

if (metaUrl.href === argvUrl.href) {
	/** Root directory. */
	const pkgUrl = new URL('../', metaUrl)

	console.log()
	await buildPackage(pkgUrl, 'postcss-8-nesting')

	console.log()
	await buildPackage(pkgUrl, 'postcss-7-nesting')
}
