import transformBubblingAtrule, { test as transformBubblingAtruleTest } from './transform-bubbling-atrule';
import transformNestingAtRule,  { test as transformNestingAtRuleTest }  from './transform-nesting-atrule';
import transformNestingRule,    { test as transformNestingRuleTest }    from './transform-nesting-rule';

// conditionally transform a nesting rule
export default node => {
	if (transformBubblingAtruleTest(node)) {
		// conditionally transform a bubbling atrule
		transformBubblingAtrule(node);
	} else if (transformNestingAtRuleTest(node)) {
		// conditionally transform a nesting atrule
		transformNestingAtRule(node);
	} else if (transformNestingRuleTest(node)) {
		// conditionally transform a nesting rule
		transformNestingRule(node);
	}
};
