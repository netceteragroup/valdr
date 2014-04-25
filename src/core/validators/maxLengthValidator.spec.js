describe('minLengthValidator', function () {

  var maxLengthValidator, constraint = {
      number: 5,
      message: 'message'
    };

  beforeEach(module('valdr'));

  beforeEach(inject(function (_maxLengthValidator_) {
    maxLengthValidator = _maxLengthValidator_;
  }));

  it('should provide the correct name', function () {
    expect(maxLengthValidator.name).toBe('maxLengthValidator');
  });

  it('should return true if value is valid', function () {
    // given
    var value = 'a';

    // when
    var valid = maxLengthValidator.validate(value, constraint);

    // then
    expect(valid).toBe(true);
  });

  it('should return false if string exceeds maxLength', function () {
    // given
    var value = 'super long string that exceeds maxLength';

    // when
    var valid = maxLengthValidator.validate(value, constraint);

    // then
    expect(valid).toBe(false);
  });

  it('should be valid if value is undefined', function () {
    // given

    // when
    var valid = maxLengthValidator.validate(undefined, constraint);

    // then
    expect(valid).toBe(true);
  });

  it('should be valid if value is null', function () {
    // given

    // when
    var valid = maxLengthValidator.validate(null, constraint);

    // then
    expect(valid).toBe(true);
  });

});
