describe('valdrUrlValidator', function () {

  var urlValidator;

  beforeEach(module('valdr'));

  beforeEach(inject(function (valdrUrlValidator) {
    urlValidator = valdrUrlValidator;
  }));

  it('should provide the correct name', function () {
    expect(urlValidator.name).toBe('url');
  });

  it('should return true for empty values', function () {
    expect(urlValidator.validate('')).toBe(true);
    expect(urlValidator.validate(undefined)).toBe(true);
  });

  it('should return true for valid url', function () {
    expect(urlValidator.validate('http://www.google.ch')).toBe(true);
    expect(urlValidator.validate('http://server:123/path')).toBe(true);
  });

  it('should return false for invalid url', function () {
    expect(urlValidator.validate('a@B.c')).toBe(false);
    expect(urlValidator.validate('hanueli')).toBe(false);
  });

});
