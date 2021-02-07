import { importable } from './import';

export const imported = importable;

export interface myInterface {
  a: boolean;
  b: string
}

export const c: myInterface = {
  a: false,
  b: '',
};

export default {};
