describe('valdrMessage input directive', function () {

  var $scope, $compile;

  beforeEach(module('valdr'));

  var compileTemplate = function (template) {
    var element = $compile(angular.element(template))($scope);
    $scope.$digest();
    return element;
  };

  beforeEach(inject(function ($rootScope, _$compile_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    $scope.myObject = { field: 'fieldValue' };
  }));


  it('should add a the valdr-message directive after the input field and bind it to the correct form field',
    function () {
      // given
      var element = compileTemplate(
        '<form name="demoForm">' +
          '<div valdr-type="TestClass" valdr-form-group>' +
            '<input type="text" name="fieldName" ng-model="myObject.field">' +
          '</div>' +
        '</form>'
      );

      // when
      var nextElement = element.find('input').next()[0];

      //then
      expect(nextElement.attributes['valdr-message']).toBeDefined();
      expect(nextElement.attributes['valdr-message'].value).toBe('fieldName');
    });


  it('should add a the valdr-message directive to the form group if there is one', function () {
    // given
    var element = compileTemplate(
            '<form name="demoForm">' +
              '<section valdr-form-group>' +
                '<div valdr-type="TestClass">' +
                  '<input type="text" name="fieldName" ng-model="myObject.field">' +
                '</div>' +
              '</section>' +
            '</form>'
    );

    // when
    var formGroupChildren = element.find('section').children();
    var lastInFormGroup = formGroupChildren[formGroupChildren.length - 1];

    //then
    expect(lastInFormGroup.attributes['valdr-message']).toBeDefined();
    expect(lastInFormGroup.attributes['valdr-message'].value).toBe('fieldName');
  });

  it('should NOT add a the valdr-message after the input if valdr-no-message is set', function () {
    // given
    var element = compileTemplate(
      '<form name="demoForm">' +
        '<div valdr-form-group valdr-type="TestClass">' +
        '<input type="text" name="fieldName" ng-model="myObject.field" valdr-no-message>' +
        '</div>' +
      '</form>'
    );

    // when
    var nextElement = element.find('input').next();

    //then
    expect(nextElement.length).toBe(0);
  });

  it('should NOT add a the valdr-message after the input is not wrapped in a valdr-type', function () {
    // given
    var element = compileTemplate(
      '<form name="demoForm">' +
        '<div>' +
        '<input type="text" name="fieldName" ng-model="myObject.field">' +
        '</div>' +
      '</form>'
    );

    // when
    var nextElement = element.find('input').next();

    //then
    expect(nextElement.length).toBe(0);
  });

  it('should NOT add valdr-message after the input if valdr-no-validate is set', function () {
    // given
    var element = compileTemplate(
        '<form name="demoForm">' +
          '<div valdr-type="TestClass" valdr-form-group>' +
            '<input type="text" name="fieldName" ng-model="myObject.field" valdr-no-validate>' +
          '</div>' +
        '</form>'
    );
    // when
    var nextElement = element.find('input').next();

    //then
    expect(nextElement.length).toBe(0);
  });

});

describe('valdrMessage directive', function () {

  var $scope, $compile, valdrMessage;

  beforeEach(module('valdr'));

  var compileTemplate = function (template) {
    var html = template ||
      '<form name="testForm">' +
        '<input type="text" name="testField" ng-model="model">' +
        '<span valdr-message="testField"></span>' +
      '</form>';
    var element = $compile(angular.element(html))($scope);
    $scope.$digest();
    return element;
  };

  var addViolations = function () {
    // manually add some violations for the tests (these are usually added if the field is invalid)
    $scope.testForm.testField.valdrViolations = [
      { message: 'message-1' },
      { message: 'message-2' }
    ];
    $scope.testForm.testField.$error = { valdr: [] };
    $scope.testForm.testField.$invalid = true;
    $scope.$digest();
  };

  var compileTemplateAndAddViolations = function (template) {
    var element = compileTemplate(template);
    addViolations();
    return element;
  };

  beforeEach(inject(function ($rootScope, _$compile_, _valdrMessage_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    valdrMessage = _valdrMessage_;
  }));

  it('should display the first message in the default template', function () {
    // when
    var element = compileTemplateAndAddViolations();

    // then
    expect(element.find('div').html()).toBe('message-1');
  });

  it('should update the messages in the default template', function () {
    // given
    var element = compileTemplateAndAddViolations();

    // when
    $scope.testForm.testField.valdrViolations[0].message = 'updatedMessage';
    $scope.$digest();

    // then
    expect(element.find('div').html()).toBe('updatedMessage');
  });

  it('should support custom templates', function () {
    // given
    valdrMessage.setTemplate('<div>Number of violations: {{ violations.length }}</div>');

    // when
    var element = compileTemplateAndAddViolations();

    // then
    expect(element.find('div').html()).toBe('Number of violations: 2');
  });


  it('should support dynamically added form items', function () {
    // given
    $scope.isVisible = false;
    var element = compileTemplate(
      '<form name="testForm">' +
        '<input type="text" ng-if="isVisible" name="testField" ng-model="model">' +
        '<span valdr-message="testField"></span>' +
      '</form>');

    // when
    $scope.isVisible = true;
    $scope.$digest();
    addViolations();

    // then
    expect(element.find('div').html()).toBe('message-1');
  });


  it('should show messages for angular validators', function () {
    // given
    valdrMessage.angularMessagesEnabled = true;
    valdrMessage.addMessages({
      'required': 'This field is required'
    });
    var template =
      '<form name="testForm">' +
        '<input required type="text" name="testField" ng-model="model">' +
        '<span valdr-message="testField"></span>' +
      '</form>';

    // when
    var element = $compile(angular.element(template))($scope);
    $scope.$digest();

    // then
    expect(element.find('div').html()).toBe('This field is required');
  });

  it('should not show messages for angular validators by default', function () {
    // given
    valdrMessage.addMessages({
      'required': 'This field is required'
    });
    var template =
      '<form name="testForm">' +
        '<input required type="text" name="testField" ng-model="model">' +
        '<span valdr-message="testField"></span>' +
      '</form>';

    // when
    var element = $compile(angular.element(template))($scope);
    $scope.$digest();

    // then
    expect(element.find('div').html()).toBe('');
  });

});

describe('valdrMessage directive with angular-translate', function () {

  var $scope, $compile, $translate, valdrMessage;

  beforeEach(function () {
    module('valdr');
    module('pascalprecht.translate');
    module(function ($translateProvider) {
      $translateProvider.translations('en', {
        'message-1': '{{fieldName}} english.',
        'message-2': 'field: {{fieldName}} param: {{param}} secondParam: {{secondParam}}',
        'Person.testField': 'Field Name'
      });

      $translateProvider.translations('de', {
        'message-1': '{{fieldName}} deutsch.',
        'message-2': 'field: {{fieldName}} param: {{param}} secondParam: {{secondParam}}',
        'Person.testField': 'Feldname'
      });

      $translateProvider.preferredLanguage('en');
    });
  });

  var compileTemplate = function () {
    var html =
      '<form name="testForm">' +
        '<input type="text" name="testField" ng-model="model">' +
        '<span valdr-message="testField"></span>' +
      '</form>';
    var element = $compile(angular.element(html))($scope);

    $scope.testForm.testField.valdrViolations = [
      { message: 'message-1', field: 'testField', type: 'Person', param: '2' },
      { message: 'message-2', field: 'testField', type: 'Person', param: '3' }
    ];
    $scope.testForm.testField.$error = { valdr: [] };
    $scope.testForm.testField.$invalid = true;
    $scope.$digest();
    return element;
  };

  beforeEach(inject(function ($rootScope, _$compile_, _valdrMessage_, _$translate_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    $translate = _$translate_;
    valdrMessage = _valdrMessage_;
  }));

  it('should translate the field name', function () {
    // given
    valdrMessage.setTemplate('<div>{{ violations[0].fieldName }}</div>');

    // when
    var element = compileTemplate();

    // then
    expect(element.find('div').html()).toBe('Field Name');
  });

  it('should translate the field name to german', function () {
    // given
    $translate.use('de');
    valdrMessage.setTemplate('<div>{{ violations[0].fieldName }}</div>');

    // when
    var element = compileTemplate();

    // then
    expect(element.find('div').html()).toBe('Feldname');
  });

  it('should update field names on language switch at runtime', function () {
    // given
    valdrMessage.setTemplate('<div>{{ violations[0].fieldName }}</div>');
    var element = compileTemplate();
    expect(element.find('div').html()).toBe('Field Name');

    // when
    $translate.use('de');
    $scope.$digest();

    // then
    expect(element.find('div').html()).toBe('Feldname');
  });


  it('should allow to use parameters in the translated messages', function () {
    // given / when
    var element = compileTemplate();
    $scope.testForm.testField.valdrViolations = [
      // note: message-2 has parameters defined in the translation tables
      { message: 'message-2', field: 'testField', type: 'Person', param: '3', secondParam: '4' }
    ];
    $scope.$digest();

    // then
    expect(element.find('span').html()).toBe('field: Field Name param: 3 secondParam: 4');
  });

});

describe('valdrMessage directive with angular-translate and valdrFieldNameKeyGenerator', function () {

  var $scope, $compile, $translate, valdrMessage;

  var fieldNameKeyGenerator = function(violation) {
    return violation.type + '.' + violation.field + '.' + violation.validator + 'Name';
  };

  beforeEach(function () {
    module('valdr');
    module('pascalprecht.translate');
    module(function ($translateProvider, $provide) {
      $provide.factory('valdrFieldNameKeyGenerator', function() { return fieldNameKeyGenerator; });

      $translateProvider.translations('en', {
        'message-1': '{{fieldName}} english.',
        'message-2': 'field: {{fieldName}} param: {{param}} secondParam: {{secondParam}}',
        'Person.testField': 'Field Name',
        'Person.testField.requiredName': 'The Field Name'
      });

      $translateProvider.translations('de', {
        'message-1': '{{fieldName}} deutsch.',
        'message-2': 'field: {{fieldName}} param: {{param}} secondParam: {{secondParam}}',
        'Person.testField': 'Feldname',
        'Person.testField.requiredName': 'Der Feldname'
      });

      $translateProvider.preferredLanguage('en');
    });
  });

  var compileTemplate = function () {
    var html =
      '<form name="testForm">' +
      '<input type="text" name="testField" ng-model="model">' +
      '<span valdr-message="testField"></span>' +
      '</form>';
    var element = $compile(angular.element(html))($scope);

    $scope.testForm.testField.valdrViolations = [
      { message: 'message-1', field: 'testField', type: 'Person', param: '2', validator: 'required' },
      { message: 'message-2', field: 'testField', type: 'Person', param: '3', validator: 'required' }
    ];
    $scope.testForm.testField.$error = { valdr: [] };
    $scope.testForm.testField.$invalid = true;
    $scope.$digest();
    return element;
  };

  beforeEach(inject(function ($rootScope, _$compile_, _valdrMessage_, _$translate_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    $translate = _$translate_;
    valdrMessage = _valdrMessage_;
  }));

  it('should translate the field name using the fieldNameKeyGenerator', function () {
    // given
    valdrMessage.setTemplate('<div>{{ violations[0].fieldName }}</div>');

    // when
    var element = compileTemplate();

    // then
    expect(element.find('div').html()).toBe('The Field Name');
  });

  it('should translate the field name to german using the fieldNameKeyGenerator', function () {
    // given
    $translate.use('de');
    valdrMessage.setTemplate('<div>{{ violations[0].fieldName }}</div>');

    // when
    var element = compileTemplate();

    // then
    expect(element.find('div').html()).toBe('Der Feldname');
  });

  it('should update field names on language switch at runtime', function () {
    // given
    valdrMessage.setTemplate('<div>{{ violations[0].fieldName }}</div>');
    var element = compileTemplate();
    expect(element.find('div').html()).toBe('The Field Name');

    // when
    $translate.use('de');
    $scope.$digest();

    // then
    expect(element.find('div').html()).toBe('Der Feldname');
  });


  it('should allow to use parameters in the translated messages', function () {
    // given / when
    var element = compileTemplate();
    $scope.testForm.testField.valdrViolations = [
      // note: message-2 has parameters defined in the translation tables
      { message: 'message-2', field: 'testField', type: 'Person', param: '3', secondParam: '4', validator: 'required' }
    ];
    $scope.$digest();

    // then
    expect(element.find('span').html()).toBe('field: The Field Name param: 3 secondParam: 4');
  });

});
