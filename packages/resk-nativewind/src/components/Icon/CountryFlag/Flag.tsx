"use client";
import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { CountriesManager } from '@resk/core/countries';
import { defaultStr } from "@resk/core/utils";
import { isImageSource } from '../utils';
import Icon from '../Icon';
import { isValidElement } from 'react';
import { hasTouchHandler } from '@utils/touchHandler';
import { cn } from '@utils/cn';
import { Text } from '@html/Text';
import { useHydrationStatus } from '@utils/useHydrationStatus';
import { canRenderEmoji, createEmoji } from './utils';
import { ICountryFlagProps } from './types';


function CountryFlag({
    countryCode,
    textClassName,
    style,
    testID,
    fallback,
    className,
    iconClassName,
    iconVariant,
    textVariant,
    ...props
}: ICountryFlagProps) {
    const hasTouchable = hasTouchHandler(props);
    const Component = hasTouchable ? TouchableOpacity : View;
    const isHydrated = useHydrationStatus();
    const { flagEmoji, canRender, country, imageSource } = useMemo(() => {
        const flagEmoji = isHydrated && canRenderEmoji('US') ? createEmoji(countryCode) : null;
        const country = CountriesManager.getCountry(countryCode);
        const imageSource = isImageSource(country?.flag) ? country?.flag : undefined;
        return { flagEmoji, canRender: !!flagEmoji, country, imageSource };
    }, [countryCode, isHydrated]);
    testID = defaultStr(testID, "resk-country-flag-emoji");
    const isValidFallback = isValidElement(fallback);
    const accessibleLabel = country?.name || countryCode;
    return (<Component testID={testID} {...props} className={cn("flex flex-row items-center justify-start", className)}>
        {imageSource ?
            <Icon accessibilityLabelledBy={accessibleLabel} variant={iconVariant} className={iconClassName} accessibilityLabel={accessibleLabel} testID={testID + "-image"} source={{ uri: imageSource }} /> :
            canRender || !isValidFallback ? <Text className={cn("flag-emoji-text", textClassName)} variant={textVariant} accessibilityRole={canRender ? 'image' : "text"} role={canRender ? "img" : undefined} testID={testID + "-text"} accessibilityLabel={accessibleLabel}>
                {canRender ? flagEmoji : `[${countryCode}]`}
            </Text> : fallback
        }
    </Component>
    );
};

export default CountryFlag;

CountryFlag.displayName = "Country.ClientSideFlag";