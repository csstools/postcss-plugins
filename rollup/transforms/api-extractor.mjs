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

			if (extractorConfig.docModelEnabled) {
				// The tool version changes with the version of the package, so we need to remove it to keep the changes minimal.
				const api = JSON.parse(await fs.readFile(extractorConfig.apiJsonFilePath, 'utf8'));
				delete api.metadata.toolVersion;
				await fs.writeFile(extractorConfig.apiJsonFilePath, JSON.stringify(api, null, 2));
			}

			await fs.rm(path.join('dist', '_types'), { recursive: true, force: true });
		},
	};
}
