import { Alert } from "@resk/nativewind";
import { Div, H2 } from "@resk/nativewind/html";
export function AlertExamples() {
    return <Div className="p-5">
        <H2>Alert Examples</H2>
        <Alert title="Alert" message="An example of alert" className="m-5" />
        <Alert title="Alert" message="An example of alert" className="m-5" type="info" />
        <Alert title="Alert" message="An example of alert" className="m-5" type="warning" />
        <Alert title="Alert" message="An example of alert" className="m-5" type="error" />
        <Alert title="Alert" message="An example of alert" className="m-5" type="success" />


        <Alert title="Alert Primary" message="An example of alert" className="m-5" variant={{ outline: "primary", borderStyle: "dashed", rounded: "rounded" }} />
        <Alert title="Alert Secondary" message="An example outline of alert secondary" className="m-5" variant={{ outline: "secondary" }} />
        <Alert title="Alert Info" message="An example of alert info" className="m-5" variant={{ outline: "info" }} />
        <Alert title="Alert Warning" message="An example of alert warning" className="m-5" variant={{ outline: "warning" }} />
        <Alert title="Alert Error" message="An example of alert error" className="m-5" variant={{ outline: "error" }} />
        <Alert title="Alert Success" message="An example of alert success" className="m-5" variant={{ outline: "success" }} />
    </Div>
}