describe('valdrPastValidator', function () {

  var pastValidator;

  beforeEach(module('valdr'));

  beforeEach(inject(function (valdrPastValidator) {
    pastValidator = valdrPastValidator;
  }));

  it('should be named "past"', function () {
    expect(pastValidator.name).toBe('past');
  });

  it('should return true for empty values', function () {
    expect(pastValidator.validate('')).toBe(true);
    expect(pastValidator.validate(null)).toBe(true);
    expect(pastValidator.validate(undefined)).toBe(true);
  });

  it('should return false for NaN', function () {
    expect(pastValidator.validate(NaN)).toBe(false);
  });

  it('should return false for non-dates', function () {
    expect(pastValidator.validate(' ')).toBe(false);
    expect(pastValidator.validate('foo')).toBe(false);
    expect(pastValidator.validate('_1.1.2014')).toBe(false);
    expect(pastValidator.validate('31.2.2014')).toBe(false);
    expect(pastValidator.validate('31:1:2014')).toBe(false);
  });

  it('should return false for dates in the future', function () {
    expect(pastValidator.validate('1.1.2900')).toBe(false);
    expect(pastValidator.validate('2030/12/31')).toBe(false);
    expect(pastValidator.validate('2030-12-31')).toBe(false);
    expect(pastValidator.validate(moment().add(10, 'seconds'))).toBe(false);
  });

  it('should return true for dates in the past', function () {
    expect(pastValidator.validate('1.1.1900')).toBe(true);
    expect(pastValidator.validate('01.01.1900')).toBe(true);
    expect(pastValidator.validate('1. 1. 1900')).toBe(true);
    expect(pastValidator.validate('01. 01. 1900')).toBe(true);
    expect(pastValidator.validate('1-1-1900')).toBe(true);
    expect(pastValidator.validate('01-01-1900')).toBe(true);
    expect(pastValidator.validate('1/1/1900')).toBe(true);
    expect(pastValidator.validate('01/01/1900')).toBe(true);
    expect(pastValidator.validate('1900.1.1')).toBe(true);
    expect(pastValidator.validate('1900.01.01')).toBe(true);
    expect(pastValidator.validate('2000/12/31')).toBe(true);
    expect(pastValidator.validate('2000-12-31')).toBe(true);
    expect(pastValidator.validate(moment().subtract(10, 'seconds'))).toBe(true);
  });
});
