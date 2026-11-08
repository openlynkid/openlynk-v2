export type ObsidianSectionId =
  | "overview"
  | "logo"
  | "colors"
  | "themes"
  | "typography"
  | "surfaces"
  | "components"
  | "icons";

export interface ColorSwatchItem {
  name: string;
  variableName: string;
  hex: string;
  oklch?: string;
  role: string;
  textColor?: string;
  borderColor?: string;
}

export interface ColorGroup {
  title: string;
  description: string;
  swatches: ColorSwatchItem[];
}

export interface TypeScaleItem {
  name: string;
  token: string;
  fontSize: string;
  lineHeight: string;
  sample: string;
  weight: string;
  usage: string;
}
