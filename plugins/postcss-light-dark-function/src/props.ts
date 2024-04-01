export const DARK_PROP = '--csstools-color-scheme--dark';
export const ON = 'initial';
export const OFF = ' ';
export function toggleNameGenerator(counter: number): string {
	return `--csstools-light-dark-toggle--${counter}`;
}
