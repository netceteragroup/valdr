describe('valdr', function () {

  var valdr, $rootScope, valdrEvents, sizeValidator, requiredValidator,
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

  beforeEach(inject(function (_valdr_, _$rootScope_, _valdrEvents_, _sizeValidator_, _requiredValidator_) {
    valdr = _valdr_;
    $rootScope = _$rootScope_;
    valdrEvents = _valdrEvents_;
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
      expect($rootScope.$broadcast).toHaveBeenCalledWith(valdrEvents.constraintsChanged);
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
});

describe('valdrProvider', function () {

  var $httpBackend, apiUrl = '/api/validation';

  beforeEach(function () {
    module('valdr');
    module(function (valdrProvider) {
      valdrProvider.setConstraintUrl(apiUrl);
    });
    inject(function (_$httpBackend_) {
      $httpBackend= _$httpBackend_;
    });
  });

  it('should load the constraints via $http', function () {

    $httpBackend.expect('GET', apiUrl).respond(200, {});

    /*jshint unused:false */
    inject(function (valdr) {
      $httpBackend.flush();
    });
  });

});