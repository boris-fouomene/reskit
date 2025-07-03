import TextInput from "./Input";
import { TelInput } from "./Tel";

type TextInputExported = typeof TextInput & { Tel: typeof TelInput };

const TextInputExported = TextInput as TextInputExported;

TextInputExported.Tel = TelInput;
export { TextInputExported as TextInput };

//export * from "./Tel";

export * from "./types";