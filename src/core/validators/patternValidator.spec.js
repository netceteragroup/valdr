describe('valdrPatternValidator', function () {

  var patternValidator,
    constraint = { value: '/^[a-z]+$/' };

  beforeEach(module('valdr'));

  beforeEach(inject(function (valdrPatternValidator) {
    patternValidator = valdrPatternValidator;
  }));

  it('should provide the correct name', function () {
    expect(patternValidator.name).toBe('pattern');
  });

  it('should return true for empty values', function () {
    expect(patternValidator.validate('', constraint)).toBe(true);
    expect(patternValidator.validate(undefined, constraint)).toBe(true);
  });

  it('should return true for matching values', function () {
    expect(patternValidator.validate('asd', constraint)).toBe(true);
  });

  it('should return false for not matching values', function () {
    expect(patternValidator.validate('123', constraint)).toBe(false);
  });

  it('should work with RegExp object in constraint', function () {
    constraint.value = /^[a-z]+$/;
    expect(patternValidator.validate('asd', constraint)).toBe(true);
    expect(patternValidator.validate('123', constraint)).toBe(false);
  });

  it('should throw when RegExp is invalid', function () {
    constraint.value = 'no RegExp';
    expect(function () {
      patternValidator.validate('asd', constraint);
    }).toThrow();
  });

});
