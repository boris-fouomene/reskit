/**
 * Test and demonstration file for the sanitizeReactId functionality
 */

import { sanitizeReactId, isValidDomId } from './useSafeId';

/**
 * Test cases demonstrating the sanitization of React useId values
 */
export function testSanitizeReactId() {
    console.log('=== Testing sanitizeReactId function ===\n');

    // Common React useId outputs
    const testCases = [
        ':r1:',           // Typical React 18 output
        ':R2d6:',         // React with uppercase
        ':r123abc:',      // Longer ID
        'test:selector@domain.com',  // Complex case
        'my.class[attr="value"]',    // CSS-like string
        'button#id.class',           // Multiple special chars
        'form input[type="text"]',   // Form selector
        'div > span + p',            // CSS combinators
        'element~sibling',           // Tilde combinator
        'attr^="start"',             // Attribute selectors
        'attr$="end"',               // Attribute selectors
        'attr*="contains"',          // Attribute selectors
        'namespace|element',         // Namespace
        'pseudo:hover',              // Pseudo-class
        'pseudo::before',            // Pseudo-element
        'function()',                // Function-like
        'path/to/resource',          // Path-like
        'query?param=value',         // Query-like
        'fragment#section',          // Fragment-like
        'percentage%value',          // Percentage
        'exclamation!point',         // Exclamation
        'quotes"and\'apostrophes',   // Quotes
        'semicolon;comma,space test', // Multiple separators
    ];

    testCases.forEach((testCase, index) => {
        const sanitized = sanitizeReactId(testCase);
        const isValid = isValidDomId(sanitized);

        console.log(`Test ${index + 1}:`);
        console.log(`  Input:     "${testCase}"`);
        console.log(`  Sanitized: "${sanitized}"`);
        console.log(`  Valid:     ${isValid}`);
        console.log(`  Safe for querySelector: ${isValid ? '✅' : '❌'}`);
        console.log('');
    });

    // Test with different prefixes
    console.log('=== Testing with different prefixes ===\n');

    const prefixTests = [
        { id: ':r1:', prefix: 'btn' },
        { id: ':r1:', prefix: 'input' },
        { id: ':r1:', prefix: 'modal' },
        { id: ':r1:', prefix: '' },  // Empty prefix
        { id: ':r1:', prefix: 'form-element' },
    ];

    prefixTests.forEach((test, index) => {
        const sanitized = sanitizeReactId(test.id, test.prefix);
        const isValid = isValidDomId(sanitized);

        console.log(`Prefix Test ${index + 1}:`);
        console.log(`  Input:     "${test.id}" with prefix "${test.prefix}"`);
        console.log(`  Result:    "${sanitized}"`);
        console.log(`  Valid:     ${isValid ? '✅' : '❌'}`);
        console.log('');
    });
}

/**
 * Demonstrate practical usage examples
 */
export function demonstrateUsage() {
    console.log('=== Practical Usage Examples ===\n');

    // Simulate React useId outputs
    const reactIds = [':r1:', ':R2d6:', ':r123abc:'];

    reactIds.forEach((reactId, index) => {
        console.log(`Example ${index + 1}: Component with multiple elements`);

        const formId = sanitizeReactId(reactId, 'form');
        const inputId = sanitizeReactId(reactId, 'input');
        const labelId = sanitizeReactId(reactId, 'label');
        const errorId = sanitizeReactId(reactId, 'error');

        console.log(`  Form ID:   "${formId}"`);
        console.log(`  Input ID:  "${inputId}"`);
        console.log(`  Label ID:  "${labelId}"`);
        console.log(`  Error ID:  "${errorId}"`);

        // Show how these would be used in querySelector
        console.log('\n  Safe for querySelector:');
        console.log(`    document.querySelector('#${formId}')`);
        console.log(`    document.querySelector('#${inputId}')`);
        console.log(`    document.querySelector('#${labelId}')`);
        console.log(`    document.querySelector('#${errorId}')`);
        console.log('');
    });
}

/**
 * Performance test for the sanitization function
 */
export function performanceTest() {
    console.log('=== Performance Test ===\n');

    const testId = ':r123abc:';
    const iterations = 10000;

    console.log(`Sanitizing "${testId}" ${iterations} times...`);

    const startTime = performance.now();

    for (let i = 0; i < iterations; i++) {
        sanitizeReactId(testId, 'test');
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / iterations;

    console.log(`Total time: ${totalTime.toFixed(2)}ms`);
    console.log(`Average time per call: ${avgTime.toFixed(4)}ms`);
    console.log(`Calls per second: ${Math.round(1000 / avgTime)}`);
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined' && (window as any).runTests) {
    testSanitizeReactId();
    demonstrateUsage();
    performanceTest();
}
