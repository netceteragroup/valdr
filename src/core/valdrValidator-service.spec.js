describe('valdrValidator', function () {

  var valdrValidator, $rootScope, valdrEvents, sizeValidator, requiredValidator,
    personRules = {
      'Person': {
        'firstName': {
          'Size': {
            'min': 0,
            'max': 10,
            'message': 'size'
          }
        }
      }
    },
    addressRules = {
      'Address': {
        'street': {
          'Required': {
            'message': 'required'
          }
        }
      }
    };

  beforeEach(module('valdr'));

  beforeEach(inject(function (_valdrValidator_, _$rootScope_, _valdrEvents_, _sizeValidator_, _requiredValidator_) {
    valdrValidator = _valdrValidator_;
    $rootScope = _$rootScope_;
    valdrEvents = _valdrEvents_;
    sizeValidator = _sizeValidator_;
    requiredValidator = _requiredValidator_;
  }));

  describe('addValidationRules()', function () {

    it('should add initial validation rules', function () {
      // when
      valdrValidator.addValidationRules(personRules);

      // then
      expect(valdrValidator.getValidationRules()).toEqual(personRules);
    });

    it('should extend initial validation rules', function () {
      // when
      valdrValidator.addValidationRules(personRules);
      valdrValidator.addValidationRules(addressRules);

      // then
      expect(valdrValidator.getValidationRules().Person).toEqual(personRules.Person);
      expect(valdrValidator.getValidationRules().Address).toEqual(addressRules.Address);
    });

    it('should broadcast event when validation rules change', function () {
      // given
      spyOn($rootScope, '$broadcast');

      // when
      valdrValidator.addValidationRules(personRules);

      // then
      expect($rootScope.$broadcast).toHaveBeenCalledWith(valdrEvents.rulesChanged);
    });
  });

  describe('validate()', function () {

    it('should validate with correct validator', function () {
      // given
      valdrValidator.addValidationRules(personRules);
      spyOn(sizeValidator, 'validate').andCallThrough();

      // when
      var validationResult = valdrValidator.validate('Person', 'firstName', 'Hanueli');

      // then
      expect(validationResult.valid).toBe(true);
      expect(sizeValidator.validate).toHaveBeenCalled();
    });

    it('should return invalid state and message if validation fails', function () {
      // given
      valdrValidator.addValidationRules(personRules);
      spyOn(sizeValidator, 'validate').andCallThrough();

      // when
      var validationResult = valdrValidator.validate('Person', 'firstName', 'Hanueli with a name that is too long');

      // then
      expect(sizeValidator.validate).toHaveBeenCalled();
      expect(validationResult.valid).toBe(false);
      expect(validationResult.messages[0].message).toBe('size');
      expect(validationResult.messages[0].messageParams.max).toBe(10);
      expect(validationResult.messages[0].messageParams.min).toBe(0);
    });

    it('should return invalid state and message if multiple validations fail', function () {
      // given
      valdrValidator.addValidationRules({
        'Person': {
          'firstName': {
            'Size': {
              'min': 2,
              'max': 10,
              'message': 'size'
            },
            'Required': {
              'message': 'required'
            }
          }
        }
      });
      spyOn(sizeValidator, 'validate').andCallThrough();
      spyOn(requiredValidator, 'validate').andCallThrough();

      // when
      var validationResult = valdrValidator.validate('Person', 'firstName', undefined);

      // then
      expect(sizeValidator.validate).toHaveBeenCalled();
      expect(requiredValidator.validate).toHaveBeenCalled();
      expect(validationResult.valid).toBe(false);
      expect(validationResult.messages[0].message).toBe('size');
      expect(validationResult.messages[1].message).toBe('required');
    });

  });
});

describe('valdrValidatorProvider', function () {

  var $httpBackend, apiUrl = '/api/validation';

  beforeEach(function () {
    module('valdr');
    module(function (valdrValidatorProvider) {
      valdrValidatorProvider.setValidationRulesUrl(apiUrl);
    });
    inject(function (_$httpBackend_) {
      $httpBackend= _$httpBackend_;
    });
  });

  it('should load the validation rules via $http', function () {

    $httpBackend.expect('GET', apiUrl).respond(200, {});

    /*jshint unused:false */
    inject(function (valdrValidator) {
      $httpBackend.flush();
    });
  });

});