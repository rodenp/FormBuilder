import type { FormElementType } from '../types';

export interface ComponentSettings {
    marginTop: string;
    marginRight: string;
    marginBottom: string;
    marginLeft: string;
    paddingTop: string;
    paddingRight: string;
    paddingBottom: string;
    paddingLeft: string;
    // Button specific settings
    buttonWidthType?: 'auto' | 'custom' | 'full';
    buttonWidth?: string;
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    fontSize?: string;
    lineHeight?: string;
    letterSpacing?: string;
    // Border settings
    borderStyleTop?: string;
    borderWidthTop?: string;
    borderColorTop?: string;
    borderStyleRight?: string;
    borderWidthRight?: string;
    borderColorRight?: string;
    borderStyleBottom?: string;
    borderWidthBottom?: string;
    borderColorBottom?: string;
    borderStyleLeft?: string;
    borderWidthLeft?: string;
    borderColorLeft?: string;
    // Radius settings
    borderRadiusTopLeft?: string;
    borderRadiusTopRight?: string;
    borderRadiusBottomLeft?: string;
    borderRadiusBottomRight?: string;
    // Image settings
    imageWidthPercent?: number;
    imageUrl?: string;
    imageAlt?: string;
    imageAlign?: 'left' | 'center' | 'right' | 'justify';
    // Menu settings
    menuLayout?: 'horizontal' | 'vertical';
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';
    rowGap?: string;
    columnGap?: string;
    gap?: string;
    // Social Links settings
    socialLinks?: { platform: string; url: string; icon: string }[];
}

export const globalDefaults: ComponentSettings = {
    marginTop: "0px",
    marginRight: "0px",
    marginBottom: "0px",
    marginLeft: "0px",
    paddingTop: "0px",
    paddingRight: "0px",
    paddingBottom: "0px",
    paddingLeft: "0px",
};

// Specific defaults per component type
export const typeDefaults: Partial<Record<FormElementType, Partial<ComponentSettings>>> = {
    'text': { marginTop: "16px", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" },
    'email': { marginTop: "16px", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" },
    'number': { marginTop: "16px", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" },
    'date': { marginTop: "16px", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" },
    'time': { marginTop: "16px", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" },
    'month': { marginTop: "16px", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" },
    'textarea': { marginTop: "16px", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" },
    'text-block': { marginTop: "16px", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px", lineHeight: "100%", letterSpacing: "0px" },
    'heading': { marginTop: "16px", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px", lineHeight: "100%", letterSpacing: "0px" },
    'checkbox': { marginTop: "16px", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" },
    'radio': { marginTop: "16px", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" },
    'menu': { marginTop: "16px", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" },
    'social': { marginTop: "16px", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" },
    'select': { marginTop: "16px", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" },
    'button': {
        paddingTop: "16px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px",
        // Default detailed border settings (undefined as requested)
        borderStyleTop: undefined,
        borderWidthTop: undefined,
        borderColorTop: undefined,
        borderStyleRight: undefined,
        borderWidthRight: undefined,
        borderColorRight: undefined,
        borderStyleBottom: undefined,
        borderWidthBottom: undefined,
        borderColorBottom: undefined,
        borderStyleLeft: undefined,
        borderWidthLeft: undefined,
        borderColorLeft: undefined,

        // Default border radius (undefined as requested)
        borderRadiusTopLeft: "25px",
        borderRadiusTopRight: "25px",
        borderRadiusBottomLeft: "25px",
        borderRadiusBottomRight: "25px",

        // Button defaults
        buttonWidthType: 'auto',
        buttonWidth: "100px",
        backgroundColor: undefined,
        textColor: undefined,
        fontFamily: undefined,
        fontWeight: 'normal',
        fontSize: "16px",
        lineHeight: "120%",
        letterSpacing: "0px",
    },
    // Layouts typically have 0
    'container': { marginTop: "0px", paddingTop: "0px", paddingRight: "0px", paddingBottom: "0px", paddingLeft: "0px" },
    'columns': { marginTop: "0px", paddingTop: "0px", paddingRight: "0px", paddingBottom: "0px", paddingLeft: "0px" },
    'rows': { marginTop: "0px", paddingTop: "0px", paddingRight: "0px", paddingBottom: "0px", paddingLeft: "0px" },
};

export const defaultSettings = {
    global: globalDefaults,
    types: typeDefaults
};
