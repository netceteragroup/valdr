describe('requiredValidator', function () {

  var requiredValidator,
    valdrUtil,
    config = {
      message: 'messageKey'
    };

  beforeEach(module('valdr'));

  beforeEach(inject(function (_requiredValidator_, _valdrUtil_) {
    requiredValidator = _requiredValidator_;
    valdrUtil = _valdrUtil_;
  }));

  it('should validate using the valdrUtil', function () {
    // given
    spyOn(valdrUtil, 'notNull');
    var value = 'someValue';

    // when
    requiredValidator.validate(config, value);

    // then
    expect(valdrUtil.notNull).toHaveBeenCalledWith(value);
  });

  it('should return the validation result', function () {
    // given
    var value = 'value';

    // when
    var validationResult = requiredValidator.validate(config, value);

    // then
    expect(validationResult.messageKey).toBe(config.message);
    expect(validationResult.valid).toBe(true);
  });

  it('should provide the correct name', function () {
    expect(requiredValidator.name).toBe('Required');
  });

});
