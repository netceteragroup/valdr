describe('valdrMinLengthValidator', function () {

  var minLengthValidator, constraint = {
    number: 5,
    message: 'message'
  };

  beforeEach(module('valdr'));

  beforeEach(inject(function (valdrMinLengthValidator) {
    minLengthValidator = valdrMinLengthValidator;
  }));

  it('should provide the correct name', function () {
    expect(minLengthValidator.name).toBe('minLength');
  });

  it('should return true if value is valid', function () {
    // given
    var value = 'valid-value';

    // when
    var valid = minLengthValidator.validate(value, constraint);

    // then
    expect(valid).toBe(true);
  });

  it('should return the validation result', function () {
    // given
    var value = 'a';

    // when
    var valid = minLengthValidator.validate(value, constraint);

    // then
    expect(valid).toBe(false);
  });

  it('should be valid if minLength is 0 and value undefined', function () {
    // given
    constraint.number = 0;

    // when
    var valid = minLengthValidator.validate(undefined, constraint);

    // then
    expect(valid).toBe(true);
  });

  it('should be invalid if value is number', function () {
    // given
    constraint.number = 4;

    // when
    var valid = minLengthValidator.validate(123, constraint);

    // then
    expect(valid).toBe(false);
  });

  it('should be valid if minLength is 0 and value null', function () {
    // given
    constraint.number = 0;

    // when
    var valid = minLengthValidator.validate(null, constraint);

    // then
    expect(valid).toBe(true);
  });

  it('should be valid if minLength is 1 and value undefined', function () {
    // given
    constraint.number = 1;

    // when
    var valid = minLengthValidator.validate(undefined, constraint);

    // then
    expect(valid).toBe(true);
  });

  it('should be valid if minLength is 1 and value null', function () {
    // given
    constraint.number = 1;

    // when
    var valid = minLengthValidator.validate(null, constraint);

    // then
    expect(valid).toBe(true);
  });

});
