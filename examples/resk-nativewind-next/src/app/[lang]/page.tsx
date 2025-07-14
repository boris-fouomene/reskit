import { ScreenContent } from "../../components/ScreenContent";
import { ReactNode } from "react";

export default function Home({ children }: { children: ReactNode }) {
    return <ScreenContent title="Sceen content from Next" >{children}</ScreenContent>;
}
