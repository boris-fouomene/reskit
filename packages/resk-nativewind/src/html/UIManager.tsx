import { defaultStr, isObj } from "@resk/core/utils";
import { getBoundingClientRect } from "@utils/getBoundingClientRect";
import { MeasureInWindowOnSuccessCallback, MeasureOnSuccessCallback } from "react-native";
import { isDOMElement } from "@resk/core/utils";

const isSupported = (node?: any): node is Element => {
    return isDOMElement(node);
}

const getRect = (node?: HTMLElement) => {
    if (!isSupported(node)) {
        return { width: 0, height: 0, top: 0, left: 0 };
    }
    const height = node?.offsetHeight;
    const width = node?.offsetWidth;
    let left = node?.offsetLeft;
    let top = node?.offsetTop;
    (node as any) = node?.offsetParent;
    while (node && node.nodeType === 1) {
        left += node.offsetLeft + node.clientLeft - node.scrollLeft;
        top += node.offsetTop + node.clientTop - node.scrollTop;
        (node as any) = node.offsetParent;
    }
    top -= window.scrollY;
    left -= window.scrollX;
    return { width, height, top, left };
};

const measureLayout = (node?: HTMLElement | null, relativeToNativeNode?: HTMLElement | null, callback?: MeasureOnSuccessCallback) => {
    if (!isSupported(node)) return;
    const relativeNode = relativeToNativeNode || (node && node.parentNode);
    if (node && relativeNode) {
        setTimeout(() => {
            if (node.isConnected && relativeNode.isConnected && typeof callback == "function") {
                const relativeRect = getRect(relativeNode as HTMLElement);
                const { height, left, top, width } = getRect(node);
                const x = left - relativeRect.left;
                const y = top - relativeRect.top;
                callback(x, y, width, height, left, top);
            }
        }, 0);
    }
};

const elementsToIgnore = {
    A: true,
    BODY: true,
    INPUT: true,
    SELECT: true,
    TEXTAREA: true
};

export const UIManager = {
    blur(node: HTMLElement) {
        if (!isSupported(node)) return;
        try {
            node.blur();
        } catch (err) { }
    },
    focus(node: HTMLElement) {
        if (!isSupported(node)) return;
        try {
            const name = defaultStr(node?.nodeName).toUpperCase().trim();
            if (
                node.getAttribute('tabIndex') == null &&
                node.isContentEditable !== true &&
                (elementsToIgnore as any)[name] == null
            ) {
                node.setAttribute('tabIndex', '-1');
            }
            node.focus();
        } catch (err) { }
    },

    measure(node: HTMLElement, callback: MeasureOnSuccessCallback) {
        measureLayout(node, null, callback);
    },

    measureInWindow(node: HTMLElement, callback: MeasureInWindowOnSuccessCallback) {
        if (!isSupported(node)) return;
        setTimeout(() => {
            const r = getBoundingClientRect(node);
            if (r && isObj(r) && typeof callback == "function") {
                const { height, left, top, width } = r;
                callback(left, top, width, height);
            }
        }, 0);
    },

    measureLayout(node: HTMLElement, relativeToNativeNode: HTMLElement, onFail: Function, onSuccess: MeasureOnSuccessCallback) {
        measureLayout(node, relativeToNativeNode, onSuccess);
    },
    normalizeRef: function (hostNode: any) {
        try {
            if (hostNode != null) {
                if (typeof hostNode?.measure !== "function") {
                    hostNode.measure = (callback: MeasureOnSuccessCallback) => UIManager.measure(hostNode, callback);
                }
                if (typeof hostNode?.measureLayout !== "function") {
                    hostNode.measureLayout = (relativeToNode?: HTMLElement | null, success?: MeasureOnSuccessCallback, failure?: Function) => UIManager.measureLayout(hostNode, relativeToNode as any, failure as any, success as any);
                }
                if (typeof hostNode?.measureInWindow !== "function") {
                    hostNode.measureInWindow = (callback: MeasureInWindowOnSuccessCallback) => UIManager.measureInWindow(hostNode, callback);
                }
            }
            return hostNode;
        } catch (e) {
            console.log(e, " normalizing native ref");
        }
    }
};