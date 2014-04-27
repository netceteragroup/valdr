describe('valdrRequiredValidator', function () {

  var requiredValidator, valdrUtil;

  beforeEach(module('valdr'));

  beforeEach(inject(function (valdrRequiredValidator, _valdrUtil_) {
    requiredValidator = valdrRequiredValidator;
    valdrUtil = _valdrUtil_;
  }));

  it('should provide the correct name', function () {
    expect(requiredValidator.name).toBe('required');
  });

  it('should validate using the valdrUtil', function () {
    // given
    spyOn(valdrUtil, 'notEmpty');
    var value = 'someValue';

    // when
    requiredValidator.validate(value);

    // then
    expect(valdrUtil.notEmpty).toHaveBeenCalledWith(value);
  });

  it('should return the validation result', function () {
    expect(requiredValidator.validate('value')).toBe(true);
  });

});
