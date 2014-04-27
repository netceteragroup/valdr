describe('valdrEmailValidator', function () {

  var hibernateEmailValidator;

  beforeEach(module('valdr'));

  beforeEach(inject(function (valdrHibernateEmailValidator) {
    hibernateEmailValidator = valdrHibernateEmailValidator;
  }));

  it('should provide the correct name', function () {
    expect(hibernateEmailValidator.name).toBe('hibernateEmail');
  });

  it('should return true for empty values', function () {
    expect(hibernateEmailValidator.validate('')).toBe(true);
    expect(hibernateEmailValidator.validate(undefined)).toBe(true);
  });

  it('should return true for valid email addresses', function () {
    expect(hibernateEmailValidator.validate('hanueli@mountains.ch')).toBe(true);
    expect(hibernateEmailValidator.validate('valdr.welds@anything.com')).toBe(true);
    expect(hibernateEmailValidator.validate('hanueli@asdf')).toBe(true);
    expect(hibernateEmailValidator.validate('hanueli@192.168.1.1')).toBe(true);
  });

  it('should return false for invalid email addresses', function () {
    expect(hibernateEmailValidator.validate('hanueli@')).toBe(false);
    expect(hibernateEmailValidator.validate('hanueli@@gmail.com')).toBe(false);
    expect(hibernateEmailValidator.validate('hanueli@gm ail.com')).toBe(false);
    expect(hibernateEmailValidator.validate('hanueli@gmail..com')).toBe(false);
    expect(hibernateEmailValidator.validate('hanueli@gmail.com.')).toBe(false);
    expect(hibernateEmailValidator.validate('@anything.com')).toBe(false);
    expect(hibernateEmailValidator.validate('...')).toBe(false);
    expect(hibernateEmailValidator.validate('.@.')).toBe(false);
    expect(hibernateEmailValidator.validate(' aaa.@. ')).toBe(false);
    expect(hibernateEmailValidator.validate('hanueli.@gmail.com')).toBe(false);
  });

});
