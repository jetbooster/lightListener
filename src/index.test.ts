import index, { imported, c } from './index';

describe('index.ts', () => {
  it('expect importable to have imported', () => {
    expect(index).toEqual({});
    expect(imported).toEqual({
      thing: 'otherThing',
    });
  });
  it('expect a Typed object to be correctly imported', () => {
    expect(c).toEqual({
      a: false,
      b: '',
    });
  });
});
