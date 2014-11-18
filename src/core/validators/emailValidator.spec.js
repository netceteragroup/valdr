describe('valdrEmailValidator', function () {

  var emailValidator;

  beforeEach(module('valdr'));

  beforeEach(inject(function (valdrEmailValidator) {
    emailValidator = valdrEmailValidator;
  }));

  it('should provide the correct name', function () {
    expect(emailValidator.name).toBe('email');
  });

  it('should return true for empty values', function () {
    expect(emailValidator.validate('')).toBe(true);
    expect(emailValidator.validate(undefined)).toBe(true);
  });

  it('should return true for valid email addresses', function () {
    expect(emailValidator.validate('hanueli@mountains.ch')).toBe(true);
    expect(emailValidator.validate('valdr.welds@anything.com')).toBe(true);
    expect(emailValidator.validate('hanueli@asdf')).toBe(true);
    expect(emailValidator.validate('hanueli@192.168.1.1')).toBe(true);
    expect(emailValidator.validate('a@3b.c')).toBe(true);
    expect(emailValidator.validate('a@b')).toBe(true);
  });

  it('should return false for invalid email addresses', function () {
    expect(emailValidator.validate('hanueli@')).toBe(false);
    expect(emailValidator.validate('hanueli@@gmail.com')).toBe(false);
    expect(emailValidator.validate('hanueli@gm ail.com')).toBe(false);
    expect(emailValidator.validate('hanueli@gmail..com')).toBe(false);
    expect(emailValidator.validate('hanueli@gmail.com.')).toBe(false);
    expect(emailValidator.validate('@anything.com')).toBe(false);
    expect(emailValidator.validate('...')).toBe(false);
    expect(emailValidator.validate('.@.')).toBe(false);
    expect(emailValidator.validate(' aaa.@. ')).toBe(false);
    expect(emailValidator.validate('a@-b.c')).toBe(false);
    expect(emailValidator.validate('a@b-.c')).toBe(false);
  });

});
