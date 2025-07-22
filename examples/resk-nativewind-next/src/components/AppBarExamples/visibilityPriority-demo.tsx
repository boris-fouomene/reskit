/**
 * Visibility Priority Demo
 * 
 * This example demonstrates how visibilityPriority now works correctly:
 * - When all actions fit: Original order is preserved
 * - When overflow occurs: Priority determines which actions stay visible
 */

import { AppBar } from '@resk/nativewind/components';

export function VisibilityPriorityDemo() {
    // Example actions with different priorities
    const actionsWithPriority = [
        {
            id: 'action1',
            label: 'First Action',
            visibilityPriority: 50, // Normal priority
            onPress: () => console.log('Action 1')
        },
        {
            id: 'action2',
            label: 'High Priority Action',
            visibilityPriority: 90, // High priority - should stay visible longer
            onPress: () => console.log('Action 2')
        },
        {
            id: 'action3',
            label: 'Low Priority Action',
            visibilityPriority: 20, // Low priority - first to go to overflow menu
            onPress: () => console.log('Action 3')
        },
        {
            id: 'action4',
            label: 'No Priority Action',
            // No visibilityPriority - will use default behavior
            onPress: () => console.log('Action 4')
        }
    ];

    const actionsNoPriority = [
        {
            id: 'action1',
            label: 'First Action',
            onPress: () => console.log('Action 1')
        },
        {
            id: 'action2',
            label: 'Second Action',
            onPress: () => console.log('Action 2')
        },
        {
            id: 'action3',
            label: 'Third Action',
            onPress: () => console.log('Action 3')
        }
    ];

    return (
        <div className="space-y-8 p-6">
            <div>
                <h2 className="text-xl font-bold mb-4">With Wide Container (All Actions Fit)</h2>
                <p className="text-gray-600 mb-4">
                    When all actions fit, original order is preserved regardless of priority.
                </p>
                <div className="w-full max-w-4xl border border-gray-200 rounded">
                    <AppBar
                        title="Wide Container"
                        actions={actionsWithPriority}
                        actionsProps={{
                            // Force wide viewport to show all actions
                            viewportWidth: 1200,
                            maxVisibleActions: 10
                        }}
                    />
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">With Narrow Container (Overflow Occurs)</h2>
                <p className="text-gray-600 mb-4">
                    When overflow occurs, priority determines which actions stay visible.
                    High Priority Action (90) should be visible, Low Priority Action (20) should go to menu.
                </p>
                <div className="w-80 border border-gray-200 rounded">
                    <AppBar
                        title="Narrow Container"
                        actions={actionsWithPriority}
                        actionsProps={{
                            // Force narrow viewport to trigger overflow
                            viewportWidth: 320,
                            maxVisibleActions: 2
                        }}
                    />
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">No Priority Actions (Control)</h2>
                <p className="text-gray-600 mb-4">
                    Actions without priority follow the original order-based logic.
                </p>
                <div className="w-80 border border-gray-200 rounded">
                    <AppBar
                        title="No Priority"
                        actions={actionsNoPriority}
                        actionsProps={{
                            viewportWidth: 320,
                            maxVisibleActions: 2
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

/**
 * Expected behavior:
 * 
 * 1. Wide Container: All actions visible in original order
 *    [First Action] [High Priority Action] [Low Priority Action] [No Priority Action]
 * 
 * 2. Narrow Container with Priority: Priority-based selection when overflow
 *    [High Priority Action] [First Action] [...Menu with Low Priority + No Priority]
 * 
 * 3. No Priority: Original order-based selection
 *    [First Action] [Second Action] [...Menu with Third Action]
 */
