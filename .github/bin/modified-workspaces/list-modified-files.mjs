import https from 'https';

export async function listModifiedFilesInPullRequest(repository, pullRequestNumber) {
	return await (new Promise((resolve, reject) => {
		https.get({
			host: 'api.github.com',
			port: 443,
			path: `/repos/${repository}/pulls/${pullRequestNumber}/files`,
			method: 'GET',
			headers: { 'User-Agent': 'GitHub Workflow' }
		}, (res) => {
			if (!res.statusCode || (Math.floor(res.statusCode / 100) !== 2)) {
				throw new Error(`Unepected response code "${res.statusCode}" with message "${res.statusMessage}"`)
			}

			let data = [];
			res.on('data', (chunk) => {
				data.push(chunk);
			});

			res.on('end', () => {
				resolve(
					JSON.parse(Buffer.concat(data).toString()).map((x) => x.filename)
				);
			});

		}).on('error', (err) => {
			reject(err);
		});
	}));
}
