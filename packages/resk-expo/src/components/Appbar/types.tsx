import { ILabelProps } from "@components/Label";
import { ISurfaceProps } from "@components/Surface";
import { ReactNode } from "react";
import { IThemeColorTokenKey } from "@theme/types";
import { GestureResponderEvent } from "react-native";
import { IBackActionProps } from "./BackAction";

export interface IAppbarProps extends ISurfaceProps {
    backgroundColor?: string;
    /**la couleur des éléments textuels du composant AppBar,  */
    color?: string;
    /**
     * Extra padding to add at the top of header to account for translucent status bar.
     * This is automatically handled on iOS >= 11 including iPhone X using `SafeAreaView`.
     * If you are using Expo, we assume translucent status bar and set a height for status bar automatically.
     * Pass `0` or a custom value to disable the default behaviour, and customize the height.
     */
    statusBarHeight?: number;

    title: ReactNode;
    subtitle?: ReactNode;
    titleProps?: ILabelProps;
    subtitleProps?: ILabelProps;
    colorScheme?: IThemeColorTokenKey;

    maxActions?: number; //le nombre maximal d'actions à afficher directement sur l'appBar, notons que le reste seront affichés à travers le composant Menu
    windowWidth?: number; //la taille de la fenêtre, utilise pour calculer automatiquement le nombre maximal d'actions à afficher. ce champ permet de récupérer la taille de l'appBar, afin d'en faire un calcul du nombre des différentes actions à afficher en fonction de la taille


    onBackActionPress?: (event: GestureResponderEvent) => void; //lorsque le bouton backAction est pressé
    bindResizeEvent?: boolean; //si le contenu appBar sera mis à jour en cas de redimentionnement de la page
    elevation?: number; //Le niveau d'élévation du composant AppBar

    /*** Si backAction est une chaine de caractère, alors il s'agit du nom de l'incone FontIcon à rendre par le backAction */
    backAction?: React.ReactNode | false | null | ((props: IBackActionProps) => ReactNode); //le composant BackAction, spécifie si le back action est rendu ou pas
    backActionProps?: IBackActionProps; //les props du composant BackAction, lorsque celui-ci est rendu

}
