// Copyright 2022 @fto-consult/Boris Fouomene. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { Dimensions, ScaledSize } from 'react-native';
import breakpoints, { getCurrentMedia, initBreakPoints, update } from './breakpoints';
import { useEffect, useState } from "react";
import { addClassName, removeClassName, isDOMElement } from "@resk/core";
import Platform from '@src/platform';
import { IDimensionsProps } from './types';
import _ from "lodash";

export * from "./types";
export * from "./breakpoints";


const msp = (dim: ScaledSize, limit: number) => {
	return (dim.scale * dim.width) >= limit || (dim.scale * dim.height) >= limit;
};

export const updateDeviceClassName = () => {
	if (typeof document !== 'undefined' && document && isDOMElement(document.body)) {
		let b = document.body;
		let deviceKey = "data-device-name";
		let c = b.getAttribute(deviceKey);
		if (c) {
			removeClassName(b, c);
		}
		let className = isMobileMedia() ? "mobile" : isTabletMedia() ? "tablet" : "desktop";
		addClassName(b, className);
		b.setAttribute(deviceKey, className);
		removeClassName(b, "not-touch-device");
		removeClassName(b, "is-touch-device");
		addClassName(b, Platform.isTouchDevice() ? "is-touch-device" : "not-touch-device");
		return className;
	}
	return false;
}

export const smallPhoneBreakpoints = ["sp"];
export const mobileBreakpoints = ["mobile", ...smallPhoneBreakpoints, "xs", "mp"];
export const phoneBreakpoints = mobileBreakpoints;
export const tabletBreakpoints = ["tablet", "md", "sm"];;
export const desktopBreakpoints = ["desktop", "xl", "lg"];

/***
 * 
 */
export const isMediaDevice = (alias: string | string[]): boolean => {
	if (!(breakpoints.current) || !alias) return false;
	const aliasSplit = typeof alias == "string" ? alias.trim().toLowerCase().split(",") : alias;
	if (breakpoints.current?.name) {
		return aliasSplit.includes(breakpoints.current.name.toLowerCase());
	}
	return false;
}
/**
 * Détermine s'il s'agit du phone media
 * @returns
 */
export const isPhoneMedia = (): boolean => {
	return isMediaDevice(phoneBreakpoints);
}

/**
 * Détermine s'il s'agit du small phone media
 * @returns
 */
export const isSmallPhoneMedia = (): boolean => {
	return isMediaDevice(smallPhoneBreakpoints);
}

/**
 * Détermine s'il s'agit du mobile media : phone, small phone ou tablet
 * @returns 
 */
export const isMobileMedia = (): boolean => {
	return isMediaDevice(mobileBreakpoints) || isMediaDevice(smallPhoneBreakpoints);
}
/***
 * Détermine s'il s'agit du tablet media
 */
export const isTabletMedia = (): boolean => {
	return isMediaDevice(tabletBreakpoints);
}

/***
 * Détermine si on est en environnement desktop
 */
export const isDesktopMedia = (): boolean => {
	return isMediaDevice(desktopBreakpoints);
}

/***
 * Détermine si l'écran est de type portrait
 */
export const isPortrait = (): boolean => {
	const dim = Dimensions.get('screen');
	return dim.height >= dim.width;
}

/**
 * Détermine si l'écran est de type landscape : paysage
 * @returns 
 */
export const isLandscape = (): boolean => {
	const dim = Dimensions.get('screen');
	return dim.width >= dim.height;
}

/***
 * Détermine s'il s'agit d'une tablette
 */
export const isTablet = (): boolean => {
	const dim = Dimensions.get('screen');
	return ((dim.scale < 2 && msp(dim, 1000)) || (dim.scale >= 2 && msp(dim, 1900)));
}

export const isMobileOrTabletMedia = () => {
	return isMobileMedia() || isTabletMedia();
}

export const isTabletOrDeskTopMedia = () => {
	return isTabletMedia() || isDesktopMedia();
}


if (!breakpoints.current) {
	initBreakPoints();
	updateDeviceClassName();
	let mediaTimer: any = null;
	const updateMedia = () => {
		clearTimeout(mediaTimer);
		main.trigger(main.EVENTS.RESIZE_PAGE, Dimensions.get("window"))
		updateDeviceClassName();
	}
	Dimensions.addEventListener('change', (e) => {
		update()
		clearTimeout(mediaTimer);
		mediaTimer = setTimeout(updateMedia, 150);
	});
}

/**** retourne les dimensions props à exploiter pour le calcul des nouvelles dimensions lorsque la taille de l'écran change
 * 
 */
export const getDimensionsProps = (): IDimensionsProps => {
	const screen = Dimensions.get("window");
	return {
		currentMedia: getCurrentMedia(),
		isMobile: isMobileMedia(),
		isTablet: isTabletMedia(),
		isDesktop: isDesktopMedia(),
		isMobileOrTablet: isMobileOrTabletMedia(),
		isTabletOrDeskTop: isTabletOrDeskTopMedia(),
		isPhone: isPhoneMedia(),
		isSmallPhone: isSmallPhoneMedia(),
		breakpoint: breakpoints.current,
		...screen,
		window: Dimensions.get("window"),
		screen: Dimensions.get("screen"),
		isPortrait: screen.height >= screen.width,
		isLandscape: screen.width >= screen.height,
	};
}
/****
	hoook permettant de récupérer les dimensions de la page lorsque la fenêtre est redimensionnée
	@param {responsive} boolean, par défaut true, lorsque responsive est à false, alors l'éccoute de l'èvenement de redimensionement est non écouté
*/
export const useDimensions = (responsive: boolean = true): IDimensionsProps => {
	const [dimensions, setDimensions] = useState(getDimensionsProps());
	responsive = typeof responsive == "boolean" ? responsive : true;
	useEffect(() => {
		const bind = responsive ? main.on(main.EVENTS.RESIZE_PAGE, () => {
			setDimensions(getDimensionsProps());
		}) : null;
		return () => {
			bind?.remove();
		}
	}, [responsive]);
	return dimensions;
}



/*** permet d'attacher un lister sur la modification des props de manière responsive : 
	permet de récupérer la fonction à attacher par défaut au listener DimensionChange, pour la mise à jour automatique de la propriété style
   * @param onChangeListenerCallback{function}, la fonction permettant de mettre à jour les props lorsque la taille de l'écran change
   * @param timeout {number}, le délai d'attente à passer à la fonction debounce, pour pouvoir appeler la fonction de mise à jour des props lorsque la taile de l'écran change
 *  @return {object{remove:function}||null} l'objet null ou ayan la fonction remove permettant de suprimer le listerner lorsque le composant est démonté
 */
export const addOnChangeListener = (onChangeListenerCallback: (dimensions: IDimensionsProps) => any, timeout: number = 200) => {
	if (typeof onChangeListenerCallback != 'function') return null;
	timeout = typeof timeout == 'number' ? timeout : 200;
	return Dimensions.addEventListener("change", _.debounce(() => {
		return onChangeListenerCallback(getDimensionsProps());
	}, timeout));
}