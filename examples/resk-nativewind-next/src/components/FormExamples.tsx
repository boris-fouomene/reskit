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
                    name: { label: "Nom", type: "email", required: true },
                    email: { type: "email", label: "Email" },
                    password: { type: "password", label: "Password" },
                    checked: { type: "switch", checkedLabel: "Checked", uncheckedLabel: "unchecked", defaultValue: 1 }
                }}
            >
                <Form.FieldRenderer
                    formName={formName}
                    type="checkbox"
                    label={"Field Renderer example"}
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
                />
            </Form>
        </Div>
    );
}