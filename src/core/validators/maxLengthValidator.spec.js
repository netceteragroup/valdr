describe('valdrMaxLengthValidator', function () {

  var maxLengthValidator, constraint = {
    number: 5,
    message: 'message'
  };

  beforeEach(module('valdr'));

  beforeEach(inject(function (valdrMaxLengthValidator) {
    maxLengthValidator = valdrMaxLengthValidator;
  }));

  it('should provide the correct name', function () {
    expect(maxLengthValidator.name).toBe('maxLength');
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

  it('should be invalid if value is number', function () {
    // given
    constraint.number = 2;

    // when
    var valid = maxLengthValidator.validate(123, constraint);

    // then
    expect(valid).toBe(false);
  });

  it('should be valid if value is null', function () {
    // given

    // when
    var valid = maxLengthValidator.validate(null, constraint);

    // then
    expect(valid).toBe(true);
  });

});
