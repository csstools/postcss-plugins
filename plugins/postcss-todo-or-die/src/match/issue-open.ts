import https from 'https';
import path from 'path';

export async function matchIssueOpenCondition(repository: string, issue: number, cache: Map<string, string>): Promise<string | true | undefined> {
	const cacheKey = `github-issue-open:${repository}:${issue}`;
	let state;

	if (!cache.has(cacheKey)) {
		try {
			state = await fetch(repository, issue);
		} catch (_) {
			// Any network errors are ignored.
			// We do not want builds to fail when GitHub is offline.
			return;
		}
	}

	if (state === 'closed') {
		cache.set(cacheKey, state);
		return `Died because issue ${issue} in ${repository} was closed`;
	}

	if (state === 'open') {
		cache.set(cacheKey, state);
		return true;
	}

	return;
}

function fetch(repository: string, issue: number) {
	return new Promise<string>((resolve, reject) => {
		let rejected = false;
		if (path.normalize(repository) !== repository) {
			reject(new Error('Invalid repository'));
			return;
		}

		const url = new URL(
			path.join('repos', repository, 'issues', issue.toString()),
			'https://api.github.com/',
		);

		// set the desired timeout in options
		const options = {
			headers: {
				'User-Agent': 'PostCSS TODO or Die',
			},
			timeout: 1000,
		};

		// create a request
		const request = https.request(url, options, (response) => {
			if (rejected) {
				return;
			}

			if (response.statusCode !== 200) {
				rejected = true;
				reject(new Error('Failed to fetch issue status'));
				return;
			}

			let buffer = '';
			response.on('data', (chunk) => {
				if (rejected) {
					return;
				}

				buffer += chunk.toString();
			});

			response.on('end', () => {
				if (rejected) {
					return;
				}

				try {
					const data = JSON.parse(buffer);
					resolve(data['state']);
					return;
				} catch (err) {
					rejected = true;
					reject(err);
					return;
				}
			});
		});

		request.on('timeout', () => {
			request.destroy();
		});

		request.on('error', (err) => {
			if (rejected) {
				return;
			}

			rejected = true;
			reject(err);
		});

		request.end();
	});
}
