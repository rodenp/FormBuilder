///Users/osx/Applications/AI/Form Builder/src/settings/defaultSettings.ts
export interface ComponentSettings {
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
    // Button specific settings
    buttonWidthType?: 'auto' | 'custom' | 'full';
    buttonWidth?: number;
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    fontSize?: number;
    lineHeight?: number;
    letterSpacing?: number;
    // Border settings
    borderStyleTop?: string;
    borderWidthTop?: number;
    borderColorTop?: string;
    borderStyleRight?: string;
    borderWidthRight?: number;
    borderColorRight?: string;
    borderStyleBottom?: string;
    borderWidthBottom?: number;
    borderColorBottom?: string;
    borderStyleLeft?: string;
    borderWidthLeft?: number;
    borderColorLeft?: string;
    // Radius settings
    borderRadiusTopLeft?: number;
    borderRadiusTopRight?: number;
    borderRadiusBottomLeft?: number;
    borderRadiusBottomRight?: number;
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
    rowGap?: number;
    columnGap?: number;
    gap?: number;
    // Social Links settings
    socialLinks?: { platform: string; url: string; icon: string }[];
}

export const globalDefaults: ComponentSettings = {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
};

// Specific defaults per component type
export const typeDefaults: Partial<Record<FormElementType, Partial<ComponentSettings>>> = {
    'text': { marginTop: 4, paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 },
    'email': { marginTop: 4, paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 },
    'number': { marginTop: 4, paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 },
    'date': { marginTop: 4, paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 },
    'time': { marginTop: 4, paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 },
    'month': { marginTop: 4, paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 },
    'textarea': { marginTop: 4, paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 }, // Applying to textarea for consistency unless otherwise requested
    'text-block': { marginTop: 4, paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 },
    'heading': { marginTop: 4, paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 },
    'checkbox': { marginTop: 4, paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 },
    'radio': { marginTop: 4, paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 },
    'menu': { marginTop: 4, paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 },
    'social': { marginTop: 4, paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 },
    'select': { marginTop: 4, paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 },
    'button': {
        paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16,
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
        borderRadiusTopLeft: 25,
        borderRadiusTopRight: 25,
        borderRadiusBottomLeft: 25,
        borderRadiusBottomRight: 25,

        // Button defaults
        buttonWidthType: 'auto',
        buttonWidth: 100,
        backgroundColor: undefined,
        textColor: undefined,
        fontFamily: undefined,
        fontWeight: 'normal',
        fontSize: 16,
        lineHeight: 120,
        letterSpacing: 0,
    },
    // Layouts typically have 0
    'container': { marginTop: 0, paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
    'columns': { marginTop: 0, paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
    'rows': { marginTop: 0, paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
};

export const defaultSettings = {
    global: globalDefaults,
    types: typeDefaults
};
