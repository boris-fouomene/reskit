
import { defaultStr, extendObj, IFieldType, IField, IFields, IResourceName, isEmpty, isNonNullString, isObj, areEquals, uniqid, Auth } from "@resk/core";
import { isValidElement, ObservableComponent } from "@utils";
import { FormsManager } from "./FormsManager";
import { IFormField, IForm, IFormProps, IFormState, IFormEvent, IFormGetDataOptions, IFormData, IFormFields, IFormKeyboardEventHandlerOptions, IFormRenderTabProp, IFormCallbackOptions, IFormOnSubmitOptions, IFormContext, IFormTabItemProp, IFormAction } from "./types";
import { ReactElement, ReactNode, useMemo, Fragment, FC } from 'react';
import { ScrollView, StyleSheet } from "react-native";
import { ActivityIndicator } from "@components/ActivityIndicator";
import { Field } from "./Field";
import { IViewStyle } from "@src/types";
import { FormContext } from "./context";
import "./types/augmented";
import { IDialogControlledProps } from "@components/Dialog";
import { ViewProps } from "react-native";
import { IDrawerProps } from "@components/Drawer";









Form.Loading.displayName = "Form.Loading";






const styles = StyleSheet.create({
    hidden: { display: "none", opacity: 0 },
    helperTextHidden: { opacity: 0 },
    labelLoading: {
        marginHorizontal: 15,
        marginBottom: -5,
    },
    loadingContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        padding: 10,
    },
    formContainer: {
        padding: 10,
        //paddingTop: 15,
        marginVertical: 2,
        rowGap: 5,
    },
    mainFormTab: {
        flexWrap: "wrap",
    },
    submitting: {
        pointerEvents: "none",
    },
    responsiveFormContainer: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    tabsContainer: {
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
});


FormsManager.isFormInstance = (form: any) => {
    return form instanceof Form;
}

function App() {
    return <Form
        fields={{
            text: {
                type: "text",
                label: "Text",
                visible: false,
                name: "boris",
            }
        }}
    />
}