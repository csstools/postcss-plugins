import fs from 'fs';

export function setFilePermissions(output) {
	return {
		name: 'set-file-permissions',
		closeBundle: function closeBundle() {
			fs.chmodSync(output, 100755);
		},
	};
}
