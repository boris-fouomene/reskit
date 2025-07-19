"use client";
import { Form } from "@resk/nativewind/components/form";
import { Div } from "@resk/nativewind/html";

export function FormExamples() {
    return (
        <Div className="p-4">
            <Form
                name="example-form"
                className=""
                fields={{
                    name: { label: "Nom", type: "email", required: true },
                    email: { type: "email", label: "Email" },
                    password: { type: "password", label: "Password" },
                    checked: { type: "switch", checkedLabel: "Checked", uncheckedLabel: "unchecked", defaultValue: 1 }
                }}
            >
                <Form.Action
                    label={"Send"}
                    formName="example-form"
                />
            </Form>
        </Div>
    );
}