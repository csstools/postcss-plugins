declare module 'cssdb' {
	export type cssdbEntry = {
		id: string
		title: string
		description: string
		specification: string
		stage: number
		browser_support: Record<string, string>
		docs: Record<string, string>
		example: string
		polyfills: Array<Record<string, string>>,
		vendors_implementations: number
	};

	const cssdb: Array<cssdbEntry>;
	export default cssdb;
}
