import Grid from "./Grid";
import Col from "./Col";

const GridExported: typeof Grid & {
    Col: typeof Col
} = Grid as any;

GridExported.Col = Col;

export * from "./types";
export { GridExported as Grid };