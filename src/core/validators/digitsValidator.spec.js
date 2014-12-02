describe('valdrDigitsValidator', function () {

  var digitsValidator, constraint;

  beforeEach(module('valdr'));

  beforeEach(inject(function (valdrDigitsValidator) {
    digitsValidator = valdrDigitsValidator;
    constraint = { integer: '4', fraction: '2' };
  }));

  it('should be named "digits"', function () {
    expect(digitsValidator.name).toBe('digits');
  });

  it('should return true for empty, null, and undefined', function () {
    expect(digitsValidator.validate('', constraint)).toBe(true);
    expect(digitsValidator.validate(null, constraint)).toBe(true);
    expect(digitsValidator.validate(undefined, constraint)).toBe(true);
  });

  it('should return false for NaN', function () {
    expect(digitsValidator.validate(NaN, constraint)).toBe(false);
  });

  it('should return true for valid integers', function () {
    expect(digitsValidator.validate('10', constraint)).toBe(true);
    expect(digitsValidator.validate(10, constraint)).toBe(true);
    expect(digitsValidator.validate(1000, constraint)).toBe(true);
    expect(digitsValidator.validate(-1000, constraint)).toBe(true);
    expect(digitsValidator.validate('10.02', constraint)).toBe(true);
    expect(digitsValidator.validate(10.02, constraint)).toBe(true);
    expect(digitsValidator.validate(-10.02, constraint)).toBe(true);
    expect(digitsValidator.validate(9999.99, constraint)).toBe(true);
    expect(digitsValidator.validate(-9999.99, constraint)).toBe(true);
  });

  it('should return false for invalid numbers and strings', function () {
    expect(digitsValidator.validate(10.001, constraint)).toBe(false);
    expect(digitsValidator.validate('10001', constraint)).toBe(false);
    expect(digitsValidator.validate('10.001', constraint)).toBe(false);
    expect(digitsValidator.validate(1000.001, constraint)).toBe(false);
    expect(digitsValidator.validate('string', constraint)).toBe(false);
    expect(digitsValidator.validate('number', constraint)).toBe(false);
    expect(digitsValidator.validate('47:11', constraint)).toBe(false);
    expect(digitsValidator.validate('47;11', constraint)).toBe(false);
    expect(digitsValidator.validate('47\'11', constraint)).toBe(false);
  });

  it('should validate correctly with fraction > 4', function() {
    constraint.fraction = 4;
    expect(digitsValidator.validate(1000.00001, constraint)).toBe(false);
    expect(digitsValidator.validate(1000.0001, constraint)).toBe(true);
  });

  it('should not choke on integer:1 conditions', function () {
    constraint.integer = 1;
    expect(digitsValidator.validate('10', constraint)).toBe(false);
    expect(digitsValidator.validate(10.0, constraint)).toBe(false);
    expect(digitsValidator.validate(0.1, constraint)).toBe(true);
    expect(digitsValidator.validate(0.11, constraint)).toBe(true);
    expect(digitsValidator.validate(0.111, constraint)).toBe(false);
  });

  it('should not choke on fraction:0 conditions', function () {
    constraint.fraction = 1;
    expect(digitsValidator.validate('10', constraint)).toBe(true);
    expect(digitsValidator.validate(10.0, constraint)).toBe(true);
    expect(digitsValidator.validate(10, constraint)).toBe(true);
    expect(digitsValidator.validate(0, constraint)).toBe(true);
    expect(digitsValidator.validate(0.11, constraint)).toBe(false);
    expect(digitsValidator.validate(0.111, constraint)).toBe(false);
  });
});
