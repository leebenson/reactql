// @ts-ignore

// Export the `styled-component` lib with theme definitions

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as styledComponents from "styled-components";

/* Local */
import { ITheme } from "@/themes/interface";

// ----------------------------------------------------------------------------

export interface IClassNameProps {
  className: string;
}

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<ITheme>;

export {
  createGlobalStyle,
  css,
  ITheme,
  keyframes,
  ThemeProvider,
};

export default styled;
