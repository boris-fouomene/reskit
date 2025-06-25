import CountryFlagEmoji from "./Flag";
import { ICountryFlagProps } from "./types";

export function CountryFlag(props: ICountryFlagProps) {
    return <CountryFlagEmoji {...props} />
}

CountryFlag.displayName = "Country.Flag";

export * from "./types";