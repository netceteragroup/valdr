describe('emailValidator', function () {

  var emailValidator;

  beforeEach(module('valdr'));

  beforeEach(inject(function (_emailValidator_) {
    emailValidator = _emailValidator_;
  }));

  it('should provide the correct name', function () {
    expect(emailValidator.name).toBe('Email');
  });

  it('should return true for empty values', function () {
    expect(emailValidator.validate('')).toBe(true);
    expect(emailValidator.validate(undefined)).toBe(true);
  });

  it('should return true for valid email addresses', function () {
    expect(emailValidator.validate('hanueli@mountains.ch')).toBe(true);
    expect(emailValidator.validate('valdr.welds@anything.com')).toBe(true);
  });

  it('should return false for invalid email addresses', function () {
    expect(emailValidator.validate('hanueli@')).toBe(false);
    expect(emailValidator.validate('@anything.com')).toBe(false);
    expect(emailValidator.validate('...')).toBe(false);
    expect(emailValidator.validate('.@.')).toBe(false);
    expect(emailValidator.validate(' aaa.@. ')).toBe(false);
  });

});
