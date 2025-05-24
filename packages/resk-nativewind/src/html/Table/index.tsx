import { IHtmlDivProps, IHtmlTableTextProps, IHtmlTextProps } from "@html/types";
import { Div } from "../Div";
import { cn } from "@utils/cn";
import { Text } from "../Text";

/**
 * The main table component.
 *
 * This component wraps the HtmlDiv component to provide a table element.
 *
 * @param {IHtmlDivProps} props - The properties for the main table component.
 *   - **style**: Optional additional styles to apply to the component.
 *   - **...props**: Any additional props that should be passed to the underlying HtmlDiv.
 * 
 * @returns {ReactElement} A JSX element representing the main table, styled as a table.
 * 
 *
 * @example
 * <Table>
 *     <Table.THead>
 *         <Table.TR>
 *             <Table.TH>Column 1</Table.TH>
 *             <Table.TH>Column 2</Table.TH>
 *         </Table.TR>
 *     </Table.THead>
 *     <Table.TBody>
 *         <Table.TR>
 *             <Table.TD>Row 1, Cell 1</Table.TD>
 *             <Table.TD>Row 1, Cell 2</Table.TD>
 *         </Table.TR>
 *     </Table.TBody>
 * </Table>
 */
interface ITable extends React.FC<IHtmlDivProps> {
    /**
     * The table head component.
     *
     * This component wraps the HtmlDiv component to provide a thead element.
     *
     * @param {IHtmlDivProps} props - The properties for the table head component.
     *   - **style**: Optional additional styles to apply to the component.
     *   - **...props**: Any additional props that should be passed to the underlying HtmlDiv.
     * 
     * @returns {ReactElement} A JSX element representing the table head, styled as a thead.
     * 
     *
     * @example
     * <Table>
     *     <Table.THead>
     *         <Table.TR>
     *             <Table.TH>Column 1</Table.TH>
     *             <Table.TH>Column 2</Table.TH>
     *         </Table.TR>
     *     </Table.THead>
     * </Table>
     */
    THead: React.FC<IHtmlDivProps>;
    /**
     * The table body component.
     *
     * This component wraps the HtmlDiv component to provide a tbody element.
     *
     * @param {IHtmlDivProps} props - The properties for the table body component.
     *   - **style**: Optional additional styles to apply to the component.
     *   - **...props**: Any additional props that should be passed to the underlying HtmlDiv.
     * 
     * @returns {ReactElement} A JSX element representing the table body, styled as a tbody.
     * 
     *
     * @example
     * <Table>
     *     <Table.THead>
     *         <Table.TR>
     *             <Table.TH>Column 1</Table.TH>
     *             <Table.TH>Column 2</Table.TH>
     *         </Table.TR>
     *     </Table.THead>
     *     <Table.TBody>
     *         <Table.TR>
     *             <Table.TD>Row 1, Cell 1</Table.TD>
     *             <Table.TD>Row 1, Cell 2</Table.TD>
     *         </Table.TR>
     *     </Table.TBody>
     * </Table>
     */
    TBody: React.FC<IHtmlDivProps>;
    /**
     * The table footer component.
     *
     * This component wraps the HtmlDiv component to provide a tfoot element.
     *
     * @param {IHtmlDivProps} props - The properties for the table footer component.
     *   - **style**: Optional additional styles to apply to the component.
     *   - **...props**: Any additional props that should be passed to the underlying HtmlDiv.
     * 
     * @returns {ReactElement} A JSX element representing the table footer, styled as a tfoot.
     * 
     *
     * @example
     * <Table>
     *     <Table.THead>
     *         <Table.TR>
     *             <Table.TH>Column 1</Table.TH>
     *             <Table.TH>Column 2</Table.TH>
     *         </Table.TR>
     *     </Table.THead>
     *     <Table.TBody>
     *         <Table.TR>
     *             <Table.TD>Row 1, Cell 1</Table.TD>
     *             <Table.TD>Row 1, Cell 2</Table.TD>
     *         </Table.TR>
     *     </Table.TBody>
     *     <Table.TFoot>
     *         <Table.TR>
     *             <Table.TH>Footer 1</Table.TH>
     *             <Table.TH>Footer 2</Table.TH>
     *         </Table.TR>
     *     </Table.TFoot>
     * </Table>
     */
    TFoot: React.FC<IHtmlDivProps>;
    /**
    * A wrapper component for the HTML `<th>` element.
    *
    * This component accepts the standard HTML props for the `<th>` element, as well
    * as any additional props supported by the underlying React Native component.
    *
    * @example
    * <Table>
    *     <Table.THead>
    *         <Table.TR>
    *             <Table.TH>Column 1</Table.TH>
    *             <Table.TH>Column 2</Table.TH>
    *         </Table.TR>
    *     </Table.THead>
    * </Table>
    */
    TH: React.FC<IHtmlTableTextProps>;
    /**
     * Represents a table row.
     * 
     * @param {IHtmlDivProps} props - The properties for the table row.
     *   - **style**: Optional additional styles to apply to the component.
     *   - **...props**: Any additional props that should be passed to the underlying HtmlDiv.
     * 
     * @returns {ReactElement} A JSX element representing the table row, styled as a table row.
     */
    TR: React.FC<IHtmlDivProps>;

    /**
     * Represents a table cell.
     *
     * @example
     * <Table.TR>
     *     <Table.TD>Row 1, Cell 1</Table.TD>
     *     <Table.TD>Row 1, Cell 2</Table.TD>
     * </Table.TR>
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td}
     */
    TD: React.FC<IHtmlTableTextProps>;
    /**
     * Represents a table caption.
     *
     * This component wraps the HtmlText component to provide a table caption element.
     *
     * @example
     * <Table>
     *     <Table.Caption>Table caption</Table.Caption>
     *     ...
     * </Table>
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption}
     */
    Caption: React.FC<IHtmlTextProps>;
}

/**
 * The main table component.
 *
 * This component wraps the HtmlDiv component to provide a table element.
 *
 * @param {IHtmlDivProps} props - The properties for the main table component.
 *   - **style**: Optional additional styles to apply to the component.
 *   - **...props**: Any additional props that should be passed to the underlying HtmlDiv.
 * 
 * @returns {ReactElement} A JSX element representing the main table, styled as a table.
 * 
 *
 * @example
 * <Table>
 *     <Table.THead>
 *         <Table.TR>
 *             <Table.TH>Column 1</Table.TH>
 *             <Table.TH>Column 2</Table.TH>
 *         </Table.TR>
 *     </Table.THead>
 *     <Table.TBody>
 *         <Table.TR>
 *             <Table.TD>Row 1, Cell 1</Table.TD>
 *             <Table.TD>Row 1, Cell 2</Table.TD>
 *         </Table.TR>
 *     </Table.TBody>
 * </Table>
 */
function MainTable(props: IHtmlDivProps) {
    return <Div role="table" {...props} asHtmlTag="table" />
}

const Table: ITable = MainTable as any as ITable;
Object.assign(MainTable, {
    THead: function TableHead(props: IHtmlDivProps) {
        return <Div role="rowgroup" {...props} asHtmlTag="thead" />
    },

    TBody: function TableBody(props: IHtmlDivProps) {
        return <Div role="rowgroup" {...props} asHtmlTag="tbody" />
    },

    TFoot: function TableBody(props: IHtmlDivProps) {
        return <Div role='rowgroup' {...props} asHtmlTag="tfoot" />
    },

    TR: function TR(props: IHtmlDivProps) {
        return <Div role="row" {...props} asHtmlTag="tr" className={cn("native:flex-row native:flex", props.className)} />;
    },
    TH: function TH(props: IHtmlTableTextProps) {
        return <Text role="columnheader"  {...props} asHtmlTag="th" className={cn("native:flex-1 text-left font-bold native:flex-col", props.className)} />;
    },

    TD: function TD(props: IHtmlTableTextProps) {
        return <Text role="cell" {...props} asHtmlTag="td" className={cn("native:flex-1 text-left native:flex-col", props.className)} />;
    },

    Caption: function Caption(props: IHtmlTextProps) {
        return <Text {...props} asHtmlTag="caption" className={cn("text-center", props.className)} />;
    }
});

Table.THead.displayName = "Table.Head";
Table.TBody.displayName = "Table.Body";
Table.TFoot.displayName = "Table.Foot";
Table.TR.displayName = "Table.TR";
Table.TH.displayName = "Table.TH";
Table.TD.displayName = "Table.TD";

export { Table };