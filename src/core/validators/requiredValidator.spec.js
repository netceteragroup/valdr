describe('requiredValidator', function () {

  var requiredValidator,
    valdrUtil,
    config = {
      message: 'message'
    };

  beforeEach(module('valdr'));

  beforeEach(inject(function (_requiredValidator_, _valdrUtil_) {
    requiredValidator = _requiredValidator_;
    valdrUtil = _valdrUtil_;
  }));

  it('should validate using the valdrUtil', function () {
    // given
    spyOn(valdrUtil, 'notEmpty');
    var value = 'someValue';

    // when
    requiredValidator.validate(config, value);

    // then
    expect(valdrUtil.notEmpty).toHaveBeenCalledWith(value);
  });

  it('should return the validation result', function () {
    // given
    var value = 'value';

    // when
    var validationResult = requiredValidator.validate(config, value);

    // then
    expect(validationResult.message).toBe(config.message);
    expect(validationResult.valid).toBe(true);
  });

  it('should provide the correct name', function () {
    expect(requiredValidator.name).toBe('Required');
  });

});
