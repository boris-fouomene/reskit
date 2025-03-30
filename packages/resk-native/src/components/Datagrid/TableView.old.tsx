import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    LayoutChangeEvent,
    ScrollView,
    Dimensions,
    PanResponder,
    GestureResponderEvent,
    PanResponderGestureState,
} from 'react-native';

interface Column<T> {
    key: keyof T;
    title: string;
    width?: number; // Optional fixed width
    flex?: number; // Optional flex value
    render?: (item: T) => React.ReactNode; // Custom cell renderer
    minWidth?: number; // Minimum width for resizable columns
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowPress?: (item: T) => void;
    headerTextStyle?: object;
    cellTextStyle?: object;
    sortable?: boolean;
    resizable?: boolean;
    containerWidth?: number; // Container width for constrained layouts
    containerStyle?: object; // Additional styles for container
}

export function DataTable<T extends object>({
    data,
    columns,
    onRowPress,
    headerTextStyle = {},
    cellTextStyle = {},
    sortable = true,
    resizable = true,
    containerWidth,
    containerStyle = {},
}: DataTableProps<T>) {
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T | null;
        direction: 'ascending' | 'descending' | null;
    }>({
        key: null,
        direction: null,
    });
    const [sortedData, setSortedData] = useState<T[]>(data);
    const [resizingColumn, setResizingColumn] = useState<string | null>(null);
    const [initialX, setInitialX] = useState(0);
    const [initialWidth, setInitialWidth] = useState(0);
    const [measuredWidth, setMeasuredWidth] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const containerRef = useRef<View>(null);

    // Handle sorting when sortConfig changes
    useEffect(() => {
        if (sortConfig.key && sortConfig.direction) {
            const sorted = [...data].sort((a, b) => {
                const aValue = a[sortConfig.key as keyof T];
                const bValue = b[sortConfig.key as keyof T];

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
            setSortedData(sorted);
        } else {
            setSortedData(data);
        }
    }, [data, sortConfig]);

    // Handle column header click for sorting
    const handleSort = (key: keyof T) => {
        if (!sortable) return;

        let direction: 'ascending' | 'descending' | null = 'ascending';

        if (sortConfig.key === key) {
            if (sortConfig.direction === 'ascending') {
                direction = 'descending';
            } else if (sortConfig.direction === 'descending') {
                direction = null;
            }
        }

        setSortConfig({ key, direction });
    };

    // Measure container width on layout
    const onContainerLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setMeasuredWidth(width);
    };

    // Calculate column widths
    useEffect(() => {
        // Use provided width, measured width, or fall back to screen width
        const availableWidth = containerWidth || measuredWidth || Dimensions.get('window').width;

        if (availableWidth <= 0) return;

        // Initialize with default values based on column config
        const initialWidths: Record<string, number> = {};
        let remainingWidth = availableWidth;
        let totalFlex = 0;

        // First pass: calculate fixed widths
        columns.forEach((column) => {
            if (column.width) {
                initialWidths[column.key as string] = column.width;
                remainingWidth -= column.width;
            } else if (column.flex) {
                totalFlex += column.flex;
            }
        });

        // Second pass: calculate flex-based widths
        if (totalFlex > 0 && remainingWidth > 0) {
            columns.forEach((column) => {
                if (column.flex && !column.width) {
                    initialWidths[column.key as string] = (column.flex / totalFlex) * remainingWidth;
                }
            });
        }

        setColumnWidths(initialWidths);
    }, [columns, containerWidth, measuredWidth]);

    // Set up the pan responder for column resizing
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e: GestureResponderEvent) => {
                if (resizingColumn) {
                    setInitialX(e.nativeEvent.pageX);
                    setInitialWidth(columnWidths[resizingColumn] || 100);
                }
            },
            onPanResponderMove: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
                if (resizingColumn) {
                    const column = columns.find((col) => col.key as string === resizingColumn);
                    const minWidth = column?.minWidth || 50;
                    const newWidth = Math.max(minWidth, initialWidth + gestureState.dx);

                    setColumnWidths((prev) => ({
                        ...prev,
                        [resizingColumn]: newWidth,
                    }));

                    // Auto-scroll if dragging near the edge
                    if (scrollViewRef.current) {
                        const scrollX = e.nativeEvent.pageX;
                        const edgeThreshold = 50;
                        const currentWidth = containerWidth || measuredWidth || Dimensions.get('window').width;

                        if (scrollX > currentWidth - edgeThreshold) {
                            scrollViewRef.current.scrollTo({
                                x: gestureState.dx > 0 ? gestureState.dx * 2 : 0,
                                animated: false,
                            });
                        }
                    }
                }
            },
            onPanResponderRelease: () => {
                setResizingColumn(null);
            },
            onPanResponderTerminate: () => {
                setResizingColumn(null);
            },
        })
    ).current;

    // Render header
    const renderHeader = () => (
        <View style={styles.headerRow}>
            {columns.map((column, index) => (
                <View
                    key={column.key as string}
                    style={[
                        styles.headerCell,
                        {
                            width: columnWidths[column.key as string] || 'auto',
                            flex: !columnWidths[column.key as string] ? 1 : undefined,
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={styles.headerCellContent}
                        onPress={() => handleSort(column.key)}
                        disabled={!sortable}
                    >
                        <Text style={[styles.headerText, headerTextStyle]} numberOfLines={1}>
                            {column.title}
                            {sortConfig.key === column.key && (
                                <Text>
                                    {sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}
                                </Text>
                            )}
                        </Text>
                    </TouchableOpacity>

                    {resizable && index < columns.length - 1 && (
                        <TouchableOpacity
                            style={styles.resizeHandle}
                            onPressIn={() => setResizingColumn(column.key as string)}
                            {...panResponder.panHandlers}
                        >
                            <View style={styles.resizeHandleBar} />
                        </TouchableOpacity>
                    )}
                </View>
            ))}
        </View>
    );

    // Render a single row
    const renderRow = ({ item }: { item: T }) => (
        <TouchableOpacity
            style={styles.row}
            onPress={() => onRowPress && onRowPress(item)}
            disabled={!onRowPress}
        >
            {columns.map((column) => (
                <View
                    key={column.key as string}
                    style={[
                        styles.cell,
                        {
                            width: columnWidths[column.key as string] || 'auto',
                            flex: !columnWidths[column.key as string] ? 1 : undefined,
                        },
                    ]}
                >
                    {column.render ? (
                        column.render(item)
                    ) : (
                        <Text style={[styles.cellText, cellTextStyle]} numberOfLines={1}>
                            {String(item[column.key] || '')}
                        </Text>
                    )}
                </View>
            ))}
        </TouchableOpacity>
    );

    return (
        <View
            ref={containerRef}
            style={[styles.outerContainer, containerStyle]}
            onLayout={onContainerLayout}
        >
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={true}
            >
                <View style={styles.container}>
                    {renderHeader()}
                    <FlatList
                        data={sortedData}
                        renderItem={renderRow}
                        keyExtractor={(_, index) => `row-${index}`}
                        windowSize={21}
                        initialNumToRender={20}
                        getItemLayout={(_, index) => ({
                            length: 50,
                            offset: 50 * index,
                            index,
                        })}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
        backgroundColor: '#f5f5f5',
        height: 50,
        alignItems: 'center',
    },
    headerCell: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerCellContent: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        height: 50,
        alignItems: 'center',
    },
    cell: {
        padding: 10,
        justifyContent: 'center',
    },
    cellText: {
        fontSize: 14,
    },
    resizeHandle: {
        width: 20,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    resizeHandleBar: {
        width: 4,
        height: 24,
        backgroundColor: '#ddd',
        borderRadius: 2,
    },
});

// Example usage with side-by-side layout
export function DataTableWithSidebar() {
    interface User {
        id: number;
        name: string;
        email: string;
        age: number;
        status: string;
    }

    const userData: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 45, status: 'Active' },
        // Add more data as needed
    ];

    const columns: Column<User>[] = [
        { key: 'id', title: 'ID', width: 50, minWidth: 40 },
        { key: 'name', title: 'Name', width: 150, minWidth: 100 },
        { key: 'email', title: 'Email', width: 200, minWidth: 150 },
        { key: 'age', title: 'Age', width: 80, minWidth: 60 },
        {
            key: 'status',
            title: 'Status',
            width: 100,
            minWidth: 80,
            render: (item) => (
                <View style={{
                    backgroundColor: item.status === 'Active' ? '#d4edda' : '#f8d7da',
                    padding: 5,
                    borderRadius: 4,
                    alignItems: 'center'
                }}>
                    <Text style={{
                        color: item.status === 'Active' ? '#155724' : '#721c24',
                        fontWeight: 'bold'
                    }}>
                        {item.status}
                    </Text>
                </View>
            )
        },
    ];

    return (
        <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', margin: 16 }}>
                Side-by-Side Layout Example
            </Text>

            <View style={{ flex: 1, flexDirection: 'row' }}>
                {/* Sidebar */}
                <View style={{ width: 200, backgroundColor: '#f0f0f0', padding: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
                        Sidebar
                    </Text>
                    <View style={{ padding: 12, backgroundColor: '#e0e0e0', borderRadius: 8 }}>
                        <Text>Filter Options</Text>
                    </View>
                    <View style={{ padding: 12, marginTop: 12, backgroundColor: '#e0e0e0', borderRadius: 8 }}>
                        <Text>Settings</Text>
                    </View>
                </View>

                {/* Main content with DataTable */}
                <View style={{ flex: 1, padding: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
                        User Data
                    </Text>
                    <DataTable
                        data={userData}
                        columns={columns}
                        onRowPress={(item) => console.log('Pressed row:', item)}
                        sortable={true}
                        resizable={true}
                    // No need to specify containerWidth - it will use the measured width
                    />
                </View>
            </View>
        </View>
    );
}