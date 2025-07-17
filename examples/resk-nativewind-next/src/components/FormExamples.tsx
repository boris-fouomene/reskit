"use client";
import { Form } from "@resk/nativewind/components/form";
import { Div } from "@resk/nativewind/html";

export function FormExamples() {
    return (
        <Div>
            <Form
                fields={{
                    name: { label: "Nom" },
                    email: { type: "email" },
                    password: { type: "password" },
                }}
            >
            </Form>
        </Div>
    );
}