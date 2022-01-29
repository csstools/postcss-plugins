import idsByExecutionOrder from './ids-by-execution-order.mjs';
import { clamp } from '../util/clamp.mjs';
import { insertAfterKey, insertBeforeKey, insertOrderKey } from '../own-keys/keys.mjs';

// features sorted by execution order and then insertion order
export function featureIsLess(a, b) {
	if (a.id === b.id) {
		if ((a[insertBeforeKey] && b[insertBeforeKey]) || (a[insertAfterKey] && b[insertAfterKey])) {
			return clamp(-1, a[insertOrderKey] - b[insertOrderKey], 1);
		}

		if (a[insertBeforeKey] || b[insertAfterKey]) {
			return -1;
		}

		if (a[insertAfterKey] || b[insertBeforeKey]) {
			return 1;
		}

		return 0;
	}

	return clamp(-1, idsByExecutionOrder.indexOf(a.id) - idsByExecutionOrder.indexOf(b.id), 1);
}
