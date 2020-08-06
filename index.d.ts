// TypeScript definitions for project: leekslazylogger
// Project: https://github.com/eartharoid/leekslazylogger
// Definitions by:
//    - August <august@augu.dev>

declare module 'leekslazylogger' {
	import * as leeks from 'leeks.js';
  
	type Dictionary<K extends string | number | symbol, V> = Record<K, V>;
	type LogFunc = (message: string | object, color?: leeks.Colors) => void;
  
	interface CustomTypeDefinition {
	  colour: leeks.Colors;
	  title: string;
	}
  
	interface Options {
	  name: string;
	  custom?: Dictionary<string, CustomTypeDefinition>;
	  logToFile?: boolean;
	  timestamp?: string;
	  maxAge?: number;
	}
  
	export function init(options: Options): void;
	export function startup(options: Options): void;
	export function setup(options: Options): void;
	export function custom(type: string, message: string | object | leeks.Colors, color?: leeks.Colors): void;
	export function newLine(): void;
	export function getPath(): string;
	export function getFile(): void;
	export function timestamp(): void;
  
	export const basic: LogFunc;
	export const console: LogFunc;
	export const info: LogFunc;
	export const success: LogFunc;
	export const debug: LogFunc;
	export const warn: LogFunc;
	export const error: LogFunc;
	export const colors: Dictionary<leeks.Colors, (text: string) => string>;
	export const colours: Dictionary<leeks.Colors, (text: string) => string>;
	export const color: Dictionary<leeks.Colors, (text: string) => string>;
	export const colour: Dictionary<leeks.Colors, (text: string) => string>;
	export const style: Dictionary<leeks.Styles, (text: string) => string>;
	export const styles: Dictionary<leeks.Styles, (text: string) => string>;
	export const options: Options;
	export const type: Dictionary<string, (message: string, color?: leeks.Colors) => void>;
	export const types: Dictionary<string, (message: string, color?: leeks.Colors) => void>;
	export const time: string;
  
	// @ts-ignore
	global {
	  var customTypes: Dictionary<string, (message: string, color: leeks.Colors) => void>;
	  var format: string;
	  var init: boolean;
	  var log: boolean;
	}
  }