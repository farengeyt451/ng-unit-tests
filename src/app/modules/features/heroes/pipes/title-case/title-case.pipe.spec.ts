import { TitleCasePipe } from './title-case.pipe';

describe('TitleCasePipe', () => {
  /** This pipe is a pure, stateless function so no need for BeforeEach */
  const pipe = new TitleCasePipe();

  it('Should transform "abc" to "Abc"', () => {
    expect(pipe.transform('abc')).toBe('Abc');
  });

  it('Should transform "abc def" to "Abc Def"', () => {
    expect(pipe.transform('abc def')).toBe('Abc Def');
  });

  it('Should leave "Abc Def" unchanged', () => {
    expect(pipe.transform('Abc Def')).toBe('Abc Def');
  });

  it('Should transform "abc-def" to "Abc-def"', () => {
    expect(pipe.transform('abc-def')).toBe('Abc-def');
  });

  it('Should transform "   abc   def" to "   Abc   Def" (preserves spaces) ', () => {
    expect(pipe.transform('   abc   def')).toBe('   Abc   Def');
  });
});
