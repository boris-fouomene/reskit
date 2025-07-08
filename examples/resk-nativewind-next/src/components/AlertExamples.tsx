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
    </Div>
}