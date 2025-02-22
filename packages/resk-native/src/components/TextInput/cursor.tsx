import React, { useRef, useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

interface CursorAwareInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    style?: any;
}

const CursorAwareInput: React.FC<CursorAwareInputProps> = ({
    value,
    onChangeText,
    placeholder,
    style
}) => {
    // Store the current cursor position
    const [selection, setSelection] = useState<{
        start: number;
        end: number;
    }>({ start: 0, end: 0 });

    // Reference to the TextInput
    const inputRef = useRef<TextInput>(null);

    // Handle text changes while preserving cursor
    const handleChangeText = (newText: string) => {
        // Calculate new cursor position based on the change
        const textDiff = newText.length - value.length;
        const newCursorPosition = selection.start + textDiff;

        // Update the text
        onChangeText(newText);

        // Update the selection state
        setSelection({
            start: newCursorPosition,
            end: newCursorPosition
        });
    };

    // Handle cursor position changes
    const handleSelectionChange = (event: any) => {
        setSelection(event.nativeEvent.selection);
    };

    // Focus the input and restore cursor position
    const focusWithCursor = () => {
        if (inputRef.current) {
            inputRef.current.focus();
            // Set the cursor position after a short delay to ensure it works
            setTimeout(() => {
                inputRef.current?.setNativeProps({
                    selection: selection
                });
            }, 50);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                ref={inputRef}
                value={value}
                onChangeText={handleChangeText}
                onSelectionChange={handleSelectionChange}
                selection={selection}
                placeholder={placeholder}
                style={[styles.input, style]}
                onFocus={() => {
                    // Restore cursor position when input is focused
                    if (inputRef.current) {
                        inputRef.current.setNativeProps({
                            selection: selection
                        });
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
});

export default CursorAwareInput;