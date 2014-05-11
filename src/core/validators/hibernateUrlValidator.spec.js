describe('valdrHibernateUrlValidator', function () {

  var urlValidator;

  beforeEach(module('valdr'));

  beforeEach(inject(function (valdrHibernateUrlValidator) {
    urlValidator = valdrHibernateUrlValidator;
  }));

  it('should provide the correct name', function () {
    expect(urlValidator.name).toBe('hibernateUrl');
  });

  it('should return true for empty values', function () {
    expect(urlValidator.validate('')).toBe(true);
    expect(urlValidator.validate(undefined)).toBe(true);
  });

  it('should return true for valid url', function () {
    // some trivial tests
    expect(urlValidator.validate('http://www.google.ch')).toBe(true);
    expect(urlValidator.validate('http://server:123/path')).toBe(true);
    // some tests from http://djpowell.net/atomrdf/0.1/files/uritest.xml
    expect(urlValidator.validate('http://a/b/c/d;p?q#s')).toBe(true);
    expect(urlValidator.validate('http://a/b/c/g?y#s')).toBe(true);
    expect(urlValidator.validate('http://a/b/c/g..')).toBe(true);
    expect(urlValidator.validate('http://a/b/c/d;p?y')).toBe(true);
    expect(urlValidator.validate('http://a/b/c/g;x=1/y')).toBe(true);
  });

  it('should return false for invalid url', function () {
    expect(urlValidator.validate('a@B.c')).toBe(false);
    expect(urlValidator.validate('hanueli')).toBe(false);
  });

});
