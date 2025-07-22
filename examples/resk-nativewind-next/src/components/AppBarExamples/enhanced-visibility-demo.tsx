/**
 * Enhanced Visibility Priority and Smart Overflow Demo
 * 
 * This example demonstrates the improved logic including:
 * - Smart overflow that prevents single-item menus
 * - Priority-based action selection when meaningful overflow occurs
 * - Original order preservation when appropriate
 */

import React from 'react';
import { AppBar } from '@resk/nativewind/components';

export function EnhancedVisibilityPriorityDemo() {
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
            label: 'Medium Priority Action',
            visibilityPriority: 60, // Medium priority
            onPress: () => console.log('Action 4')
        },
        {
            id: 'action5',
            label: 'Another Low Priority',
            visibilityPriority: 30, // Low priority
            onPress: () => console.log('Action 5')
        }
    ];

    // Just 3 actions to test the "single menu item prevention" scenario
    const threeActions = [
        {
            id: 'action1',
            label: 'First Action',
            visibilityPriority: 50,
            onPress: () => console.log('Action 1')
        },
        {
            id: 'action2', 
            label: 'High Priority',
            visibilityPriority: 90,
            onPress: () => console.log('Action 2')
        },
        {
            id: 'action3',
            label: 'Low Priority', 
            visibilityPriority: 20,
            onPress: () => console.log('Action 3')
        }
    ];

    return (
        <div className="space-y-8 p-6 max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Enhanced AppBar Overflow Logic</h1>
                <p className="text-gray-600">
                    This demo showcases the improved logic that prevents inefficient single-item overflow menus 
                    and intelligently applies priority-based sorting only when it makes sense.
                </p>
            </div>

            <div className="grid gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-3">✅ All Actions Fit (No Overflow)</h2>
                    <p className="text-gray-600 mb-4">
                        Wide container: Original order preserved, no priority sorting needed.
                    </p>
                    <div className="w-full border border-gray-300 rounded">
                        <AppBar 
                            title="Wide Container"
                            actions={actionsWithPriority}
                            actionsProps={{
                                viewportWidth: 1200,
                                maxVisibleActions: 10
                            }}
                        />
                    </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-3">⚡ Smart Single-Item Prevention</h2>
                    <p className="text-gray-600 mb-4">
                        <strong>The Key Fix:</strong> 3 actions, space for 2. Instead of showing 1 action + menu with 1 item 
                        (inefficient), it shows all 3 actions directly!
                    </p>
                    <div className="w-80 border border-gray-300 rounded">
                        <AppBar 
                            title="Smart Logic Demo"
                            actions={threeActions}
                            actionsProps={{
                                viewportWidth: 350,
                                maxVisibleActions: 2 // Would normally create menu with 1 item - prevented!
                            }}
                        />
                    </div>
                    <p className="text-sm text-green-600 mt-2">
                        💡 Result: All 3 actions shown directly instead of 2 actions + menu with 1 item
                    </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-3">🎯 Meaningful Overflow with Priority</h2>
                    <p className="text-gray-600 mb-4">
                        5 actions, space for 3. Multiple items will go to menu, so priority sorting is applied.
                        High (90) and Medium (60) priority actions stay visible.
                    </p>
                    <div className="w-96 border border-gray-300 rounded">
                        <AppBar 
                            title="Priority-Based Overflow"
                            actions={actionsWithPriority}
                            actionsProps={{
                                viewportWidth: 400,
                                maxVisibleActions: 3
                            }}
                        />
                    </div>
                    <p className="text-sm text-blue-600 mt-2">
                        📋 Menu contains: First (50), Another Low (30), Low Priority (20)
                    </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-3">🔒 Very Constrained Space</h2>
                    <p className="text-gray-600 mb-4">
                        3 actions, space for only 1. Shows highest priority (90) directly, others go to menu.
                    </p>
                    <div className="w-48 border border-gray-300 rounded">
                        <AppBar 
                            title="Tiny Space"
                            actions={threeActions}
                            actionsProps={{
                                viewportWidth: 280,
                                maxVisibleActions: 1
                            }}
                        />
                    </div>
                    <p className="text-sm text-orange-600 mt-2">
                        📋 Menu contains: First (50), Low Priority (20)
                    </p>
                </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3">🧠 Smart Logic Summary</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-medium text-green-700 mb-2">Prevention Logic:</h4>
                        <ul className="space-y-1 text-green-600">
                            <li>• Detects when overflow would create single-item menu</li>
                            <li>• Shows that item directly instead (more efficient)</li>
                            <li>• Saves user a click and visual clutter</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium text-green-700 mb-2">Priority Logic:</h4>
                        <ul className="space-y-1 text-green-600">
                            <li>• Only applies when meaningful overflow occurs</li>
                            <li>• Preserves original order when all fit</li>
                            <li>• High priority actions stay visible longer</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EnhancedVisibilityPriorityDemo;
