"use client";
import { Form } from "@resk/nativewind/components/form";
import { Div } from "@resk/nativewind/html";

export function FormExamples() {
    const formName = "example-form";
    return (
        <Div className="p-4">
            <Form
                name={formName}
                className=""
                fields={{
                    name: { label: "Nom", type: "text", required: true },
                    email: { type: "email", label: "Email" },
                    password: { type: "password", label: "Password" },
                    checked: { type: "switch", checkedLabel: "Checked", uncheckedLabel: "unchecked", defaultValue: 1, validationRules: ["Required"] }
                }}
            >
                <Form.FieldRenderer
                    name="custom-field-renderer"
                    formName={formName}
                    type="checkbox"
                    label={"Custom Field Renderer example"}
                    checkedValue={"Yes"}
                    uncheckedValue={"No"}
                    onFieldValid={({ value }) => {
                        console.log(value, " is field value");
                    }}
                    onChange={(value) => console.log("Checkbox changed:", value)}
                />
                <Form.Action
                    label={"Send"}
                    formName={formName}
                    onPress={(_, { formData }) => {
                        console.log("Form submitted with data:", formData);
                    }}
                />
            </Form>
        </Div>
    );
}