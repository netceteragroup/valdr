describe('valdrMinValidator', function () {

  var minValidator, constraint;

  beforeEach(module('valdr'));

  beforeEach(inject(function (valdrMinValidator) {
    minValidator = valdrMinValidator;
    constraint = { value: '10' };
  }));

  it('should provide the correct name', function () {
    expect(minValidator.name).toBe('min');
  });

  it('should return true for empty values', function () {
    expect(minValidator.validate('', constraint)).toBe(true);
    expect(minValidator.validate(null, constraint)).toBe(true);
    expect(minValidator.validate(undefined, constraint)).toBe(true);
  });

  it('should return false for NaN', function () {
    expect(minValidator.validate(NaN, constraint)).toBe(false);
  });

  it('should return true for valid numbers', function () {
    expect(minValidator.validate('10', constraint)).toBe(true);
    expect(minValidator.validate(10, constraint)).toBe(true);
    expect(minValidator.validate(10.001, constraint)).toBe(true);
    expect(minValidator.validate('10.000001', constraint)).toBe(true);
    expect(minValidator.validate('11', constraint)).toBe(true);
    expect(minValidator.validate(11, constraint)).toBe(true);
  });

  it('should return false for invalid numbers and strings', function () {
    expect(minValidator.validate('9', constraint)).toBe(false);
    expect(minValidator.validate(9, constraint)).toBe(false);
    expect(minValidator.validate('-9', constraint)).toBe(false);
    expect(minValidator.validate(-9, constraint)).toBe(false);
    expect(minValidator.validate('9.9999999', constraint)).toBe(false);
    expect(minValidator.validate('string', constraint)).toBe(false);
    expect(minValidator.validate('number', constraint)).toBe(false);
    expect(minValidator.validate(' ', constraint)).toBe(false);
  });

});
