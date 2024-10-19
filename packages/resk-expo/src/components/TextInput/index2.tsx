/* eslint-disable no-shadow */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  StyleProp,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './styles';
import type { InputProps } from './types';


const defaultProps = {
  style: {},
  value: '',
  currency: false,
  numeric: false,
};

const TextInputComponent: InputProps = (props) => {
  const {
    fontFamily,
    style,
    inputStyle,
    iconStyle,
    labelStyle,
    placeholderStyle = {},
    textErrorStyle,
    value,
    label,
    placeholderTextColor = 'red',
    placeholder = '',
    mode = 'default',
    textError,
    focusColor,
    onFocus,
    onBlur,
    renderLeftIcon,
  } = props;

  const [text, setText] = useState<string>('');
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [textEntry, setTextEntry] = useState<boolean>(
    mode === 'password' ? true : false
  );

  useEffect(() => {
    if (value) {
      if (mode === 'numeric') {
        setText(formatNumeric(value));
      } else {
        setText(value);
      }
    } else {
      setText('');
    }
  }, [mode, value]);

  const formatNumeric = (num: string) => {
    const values = num.toString().replace(/\D/g, '');
    return values.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };


  const onChange = (text: string) => {

  };

  const onChangeTextEntry = () => {
    setTextEntry(!textEntry);
  };

  const _renderRightIcon = () => {
    return null;
  };


  const onFocusCustom = (e: any) => {
    setIsFocus(true);
    if (onFocus) {
      onFocus(e);
    }
  };

  const onBlurCustom = (e: any) => {
    setIsFocus(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  const colorFocus = useMemo(() => {
    if (isFocus && focusColor) {
      return {
        borderBottomColor: focusColor,
        borderTopColor: focusColor,
        borderLeftColor: focusColor,
        borderRightColor: focusColor,
      };
    } else {
      return {};
    }
  }, [focusColor, isFocus]);

  const styleLable: StyleProp<TextStyle> = useMemo(() => {
    if (isFocus || (text.length > 0 && label)) {
      const style: any = labelStyle;
      return {
        top: 5,
        color: isFocus ? focusColor : null,
        ...style,
      };
    } else {
      const style: any = placeholderStyle;
      return {
        position: 'absolute',
        ...style,
      };
    }
  }, [isFocus, text.length, label, focusColor, labelStyle, placeholderStyle]);

  return (
    <>
      <View style={[styles.container, style, colorFocus]}>
        <View style={[styles.textInput]}>
          {renderLeftIcon?.()}
          <View style={styles.wrapInput}>
            {label ? (
              <Text style={[styles.label, styleLable]}>{label}</Text>
            ) : null}
            <TextInput
              secureTextEntry={textEntry}
              {...props}
              style={[styles.input, inputStyle]}
              value={text}
              placeholder={isFocus || !label ? placeholder : ''}
              placeholderTextColor={placeholderTextColor}
              onChangeText={onChange}
              onFocus={onFocusCustom}
              onBlur={onBlurCustom}
            />
          </View>
          {_renderRightIcon()}
        </View>
      </View>
      {textError ? (
        <Text style={[styles.textError, textErrorStyle]}>{textError}</Text>
      ) : null}
    </>
  );
};

TextInputComponent.defaultProps = defaultProps;

export default TextInputComponent;
