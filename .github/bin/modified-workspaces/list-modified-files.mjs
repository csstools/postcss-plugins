import https from 'https';

export async function listModifiedFilesInPullRequest(repository, pullRequestNumber) {
	const allFiles = [];

	let page = 1;

	while (true) {
		const newFiles = await getPullRequestFiles(repository, pullRequestNumber, page);
		allFiles.push(...newFiles);
		page++

		if (newFiles.length < 100) {
			break;
		}
	}

	return allFiles;
}

async function getPullRequestFiles(repository, pullRequestNumber, page) {
	return await (new Promise((resolve, reject) => {
		const headers = {
			'User-Agent': 'GitHub Workflow'
		}

		if (process.env.GITHUB_TOKEN) {
			headers['authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
		}

		https.get({
			host: 'api.github.com',
			port: 443,
			path: `/repos/${repository}/pulls/${pullRequestNumber}/files?per_page=100&page=${page}`,
			method: 'GET',
			headers: headers
		}, (res) => {
			if (!res.statusCode || (Math.floor(res.statusCode / 100) !== 2)) {
				throw new Error(`Unexpected response code "${res.statusCode}" with message "${res.statusMessage}"`)
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
