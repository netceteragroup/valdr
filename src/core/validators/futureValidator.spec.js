describe('valdrFutureValidator', function () {

  var futureValidator;

  beforeEach(module('valdr'));

  beforeEach(inject(function (valdrFutureValidator) {
    futureValidator = valdrFutureValidator;
  }));

  it('should be named "future"', function () {
    expect(futureValidator.name).toBe('future');
  });

  it('should return true for empty values', function () {
    expect(futureValidator.validate('')).toBe(true);
    expect(futureValidator.validate(null)).toBe(true);
    expect(futureValidator.validate(undefined)).toBe(true);
  });

  it('should return false for NaN', function () {
    expect(futureValidator.validate(NaN)).toBe(false);
  });

  it('should return false for non-dates', function () {
    expect(futureValidator.validate(' ')).toBe(false);
    expect(futureValidator.validate('foo')).toBe(false);
    expect(futureValidator.validate('_1.1.2014')).toBe(false);
    expect(futureValidator.validate('31.2.2014')).toBe(false);
    expect(futureValidator.validate('31:1:2014')).toBe(false);
  });

  it('should return false for dates in the past', function () {
    expect(futureValidator.validate('1.1.1900')).toBe(false);
    expect(futureValidator.validate('01.01.1900')).toBe(false);
    expect(futureValidator.validate('1. 1. 1900')).toBe(false);
    expect(futureValidator.validate('01. 01. 1900')).toBe(false);
    expect(futureValidator.validate('1-1-1900')).toBe(false);
    expect(futureValidator.validate('01-01-1900')).toBe(false);
    expect(futureValidator.validate('1/1/1900')).toBe(false);
    expect(futureValidator.validate('01/01/1900')).toBe(false);
    expect(futureValidator.validate('1900.1.1')).toBe(false);
    expect(futureValidator.validate('1900.01.01')).toBe(false);
    expect(futureValidator.validate('2000/12/31')).toBe(false);
    expect(futureValidator.validate('2000-12-31')).toBe(false);
    expect(futureValidator.validate(moment().subtract(1, 'seconds'))).toBe(false);
  });

  it('should return true for dates in the future', function () {
    expect(futureValidator.validate('1.1.2900')).toBe(true);
    expect(futureValidator.validate('2030/12/31')).toBe(true);
    expect(futureValidator.validate('2030-12-31')).toBe(true);
    expect(futureValidator.validate(moment().add(10, 'seconds'))).toBe(true);
  });
});
