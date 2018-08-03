// @ts-ignore

// Export the `styled-component` lib with theme definitions

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import { ComponentClass } from "react";
import * as styledComponents from "styled-components";

/* Local */
import { ITheme } from "@/themes/interface";

// ----------------------------------------------------------------------------

export interface IClassNameProps {
  className: string;
}

const {default: styled } = styledComponents as styledComponents.ThemedStyledComponentsModule<ITheme>;

const css = styledComponents.css;
const injectGlobal = styledComponents.injectGlobal;
const keyframes = styledComponents.keyframes;
const ThemeProvider = styledComponents.ThemeProvider as ComponentClass<styledComponents.ThemeProviderProps<ITheme>>;

export {
  css,
  keyframes,
  injectGlobal,
  ITheme,
  ThemeProvider,
};

export default styled;
