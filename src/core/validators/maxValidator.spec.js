describe('valdrMaxValidator', function () {

  var maxValidator, constraint;

  beforeEach(module('valdr'));

  beforeEach(inject(function (valdrMaxValidator) {
    maxValidator = valdrMaxValidator;
    constraint = { value: '10' };
  }));

  it('should provide the correct name', function () {
    expect(maxValidator.name).toBe('max');
  });

  it('should return true for empty values', function () {
    expect(maxValidator.validate('', constraint)).toBe(true);
    expect(maxValidator.validate(null, constraint)).toBe(true);
    expect(maxValidator.validate(undefined, constraint)).toBe(true);
  });

  it('should return false for NaN', function () {
    expect(maxValidator.validate(NaN, constraint)).toBe(false);
  });

  it('should return true for valid numbers', function () {
    expect(maxValidator.validate('10', constraint)).toBe(true);
    expect(maxValidator.validate(10, constraint)).toBe(true);
    expect(maxValidator.validate('9', constraint)).toBe(true);
    expect(maxValidator.validate(9, constraint)).toBe(true);
    expect(maxValidator.validate('-9', constraint)).toBe(true);
    expect(maxValidator.validate(-9, constraint)).toBe(true);
    expect(maxValidator.validate('9.9999999', constraint)).toBe(true);
  });

  it('should return false for invalid numbers and strings', function () {
    expect(maxValidator.validate(10.001, constraint)).toBe(false);
    expect(maxValidator.validate('10.000001', constraint)).toBe(false);
    expect(maxValidator.validate('11', constraint)).toBe(false);
    expect(maxValidator.validate(11, constraint)).toBe(false);
    expect(maxValidator.validate('string', constraint)).toBe(false);
    expect(maxValidator.validate('number', constraint)).toBe(false);
  });

});
