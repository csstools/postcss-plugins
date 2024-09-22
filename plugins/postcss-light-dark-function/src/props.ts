export const LIGHT_PROP = '--csstools-color-scheme--light';
export const ON = 'initial';
export const OFF = ' ';
export function toggleNameGenerator(counter: number): string {
	return `--csstools-light-dark-toggle--${counter}`;
}
