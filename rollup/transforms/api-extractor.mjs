import fs from 'fs/promises';
import path from 'path';
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';

export function apiExtractor() {
	return {
		name: 'typescript-declarations',
		closeBundle: async function closeBundle() {
			const extractorConfig = ExtractorConfig.loadFileAndPrepare('api-extractor.json');
			const extractorResult = Extractor.invoke(extractorConfig, {});

			if (!extractorResult.succeeded) {
				throw new Error(
					`API Extractor completed with ${extractorResult.errorCount} errors` +
					` and ${extractorResult.warningCount} warnings`,
				);
			}

			await fs.rm(path.join('dist', '_types'), { recursive: true, force: true });
		},
	};
}
