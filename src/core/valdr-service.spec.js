describe('valdr', function () {

  var valdr, $rootScope, valdrEvents, valdrClasses, sizeValidator, requiredValidator,
    personConstraints = {
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
    addressConstraints = {
      'Address': {
        'street': {
          'Required': {
            'message': 'required'
          }
        }
      }
    };

  beforeEach(module('valdr'));

  beforeEach(inject(
    function (_valdr_, _$rootScope_, _valdrEvents_, _valdrClasses_, _sizeValidator_, _requiredValidator_) {
    valdr = _valdr_;
    $rootScope = _$rootScope_;
    valdrEvents = _valdrEvents_;
    valdrClasses = _valdrClasses_;
    sizeValidator = _sizeValidator_;
    requiredValidator = _requiredValidator_;
  }));

  describe('addConstraints()', function () {

    it('should add initial constraints', function () {
      // when
      valdr.addConstraints(personConstraints);

      // then
      expect(valdr.getConstraints()).toEqual(personConstraints);
    });

    it('should extend initial constraints', function () {
      // when
      valdr.addConstraints(personConstraints);
      valdr.addConstraints(addressConstraints);

      // then
      expect(valdr.getConstraints().Person).toEqual(personConstraints.Person);
      expect(valdr.getConstraints().Address).toEqual(addressConstraints.Address);
    });

    it('should broadcast event when constraints change', function () {
      // given
      spyOn($rootScope, '$broadcast');

      // when
      valdr.addConstraints(personConstraints);

      // then
      expect($rootScope.$broadcast).toHaveBeenCalledWith(valdrEvents.revalidate);
    });
  });

  describe('validate()', function () {

    it('should validate with correct validator', function () {
      // given
      valdr.addConstraints(personConstraints);
      spyOn(sizeValidator, 'validate').andCallThrough();

      // when
      var validationResult = valdr.validate('Person', 'firstName', 'Hanueli');

      // then
      expect(validationResult.valid).toBe(true);
      expect(validationResult.violations).toBeUndefined();
      expect(sizeValidator.validate).toHaveBeenCalled();
    });

    it('should return invalid state and message if validation fails', function () {
      // given
      valdr.addConstraints(personConstraints);
      spyOn(sizeValidator, 'validate').andCallThrough();

      // when
      var validationResult = valdr.validate('Person', 'firstName', 'Hanueli with a name that is too long');

      // then
      expect(sizeValidator.validate).toHaveBeenCalled();
      expect(validationResult.valid).toBe(false);
      expect(validationResult.violations[0].message).toBe('size');
      expect(validationResult.violations[0].field).toBe('firstName');
      expect(validationResult.violations[0].value).toBe('Hanueli with a name that is too long');
      expect(validationResult.violations[0].max).toBe(10);
      expect(validationResult.violations[0].min).toBe(0);
    });

    it('should return invalid state and message if multiple validations fail', function () {
      // given
      valdr.addConstraints({
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
      var validationResult = valdr.validate('Person', 'firstName', undefined);

      // then
      expect(sizeValidator.validate).toHaveBeenCalled();
      expect(requiredValidator.validate).toHaveBeenCalled();
      expect(validationResult.valid).toBe(false);
      expect(validationResult.violations[0].field).toBe('firstName');
      expect(validationResult.violations[0].value).toBeUndefined();
      expect(validationResult.violations[0].message).toBe('size');
      expect(validationResult.violations[1].message).toBe('required');
    });

  });

  describe('setClasses()', function () {

    it('should add the given classes to the valdrClasses and broadcast an event', function () {
      // given
      spyOn($rootScope, '$broadcast');
      var newClass = 'is-valid';
      expect(valdrClasses.valid).toBe('has-success');
      expect(valdrClasses.invalid).toBe('has-error');

      // when
      valdr.setClasses({ valid: newClass });

      // then
      expect($rootScope.$broadcast).toHaveBeenCalledWith(valdrEvents.revalidate);
      expect(valdrClasses.valid).toBe(newClass);
      expect(valdrClasses.invalid).toBe('has-error');

      // cleanup to prevent side-effects
      valdr.setClasses({ valid: 'has-success' });
    });

  });
});

describe('valdrProvider', function () {

  it('should load the constraints via $http', function () {
    // given
    var $httpBackend, apiUrl = '/api/validation';

    // when
    module('valdr');
    module(function (valdrProvider) {
      valdrProvider.setConstraintUrl(apiUrl);
    });
    inject(function (_$httpBackend_) {
      $httpBackend= _$httpBackend_;
      $httpBackend.expect('GET', apiUrl).respond(200, {});
    });

    /*jshint unused:false */
    inject(function (valdr) {
      // injecting the valdr service triggers the loading and therefore the GET to the apiUrl
      $httpBackend.flush();

      // then
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });

  it('should support to use aliases for constraint names', function () {
    // given
    module('valdr');
    module(function (valdrProvider) {
      valdrProvider.addConstraints({
        'Person': {
          'firstName': {
            'SizeBetween': {
              'min': 0,
              'max': 10
            }
          }
        }
      });
      valdrProvider.addConstraintAlias('Size', 'SizeBetween');
    });


    inject(function (valdr, sizeValidator) {
      // when
      spyOn(sizeValidator, 'validate').andCallThrough();
      var validationResult = valdr.validate('Person', 'firstName', 'Hanueli');

      // then
      expect(validationResult.valid).toBe(true);
      expect(validationResult.violations).toBeUndefined();
      expect(sizeValidator.validate).toHaveBeenCalled();
    });
  });

});