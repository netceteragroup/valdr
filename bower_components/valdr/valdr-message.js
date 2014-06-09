(function (window, document) {
'use strict';

angular.module('valdr')

/**
 * This service provides shared configuration between all valdr-message directive instances like the configured
 * template to render the violation messages and whether or not angular-translate is available.
 */
  .provider('valdrMessage', function () {

    var userDefinedTemplateUrl, userDefinedTemplate,
      defaultTemplateUrl = 'valdr/default-message.html',
      defaultTemplate =   '<div class="valdr-message">' +
                            '{{ violation.message }}' +
                          '</div>',
      translateTemplate = '<div class="valdr-message">' +
                            '<span ng-if="violation" ' +
                            'translate="{{ violation.message }}" ' +
                            'translate-values="violation"></span>' +
                          '</div>';

    this.setTemplate = function (template) {
      userDefinedTemplate = template;
    };

    this.setTemplateUrl = function (templateUrl) {
      userDefinedTemplateUrl = templateUrl;
    };

    this.$get = ['$templateCache', '$injector', function ($templateCache, $injector) {

      function getTranslateService() {
        try {
          return $injector.get('$translate');
        } catch (error) {
          return undefined;
        }
      }

      var $translate = getTranslateService(),
        translateAvailable = angular.isDefined($translate);

      function determineTemplate() {
        if (angular.isDefined(userDefinedTemplate)) {
          return userDefinedTemplate;
        } else if (translateAvailable) {
          return translateTemplate;
        } else {
          return defaultTemplate;
        }
      }

      function updateTemplateCache() {
        $templateCache.put(defaultTemplateUrl, determineTemplate());
        if (userDefinedTemplateUrl && userDefinedTemplate) {
          $templateCache.put(userDefinedTemplateUrl, userDefinedTemplate);
        }
      }

      updateTemplateCache();

      return {
        templateUrl: userDefinedTemplateUrl || defaultTemplateUrl,
        setTemplate: function (newTemplate) {
          userDefinedTemplate = newTemplate;
          updateTemplateCache();
        },
        translateAvailable: translateAvailable,
        $translate: $translate
      };
    }];
  });
/**
 * This directive appends a validation message to the parent element of any input, select or textarea element, which
 * is nested in a valdr-type directive and has an ng-model bound to it.
 * If the form element is wrapped in an element marked with the class defined in valdrClasses.formGroup,
 * the messages is appended to this element instead of the direct parent.
 * To prevent adding messages to specific input fields, the attribute 'no-valdr-message' can be added to those input
 * or select fields. The valdr-message directive is used to do the actual rendering of the violation messages.
 */
var valdrMessageDirectiveDefinition = ['$compile', 'valdrUtil', function ($compile, valdrUtil) {
  return  {
    restrict: 'E',
    require: ['?^valdrType', '?^ngModel', '?^form'],
    link: function (scope, element, attrs, controllers) {

      var valdrTypeController = controllers[0],
        ngModelController = controllers[1],
        formController = controllers[2],
        fieldName = attrs.name;

      // Stop right here if this is an <input> that's either not inside of a valdr-type block
      // or there is no ng-model bound to it.
      if (!valdrTypeController || !ngModelController || !formController) {
        return;
      }

      // Add violation message if there is no 'no-valdr-message' attribute on this input field.
      if (angular.isUndefined(attrs.noValdrMessage)) {
        var formField = formController.$name + '.' + fieldName;
        var valdrMessageElement = angular.element('<span valdr-message="' + formField + '"></span>');
        var formGroup = valdrUtil.findWrappingFormGroup(element);
        formGroup.append(valdrMessageElement);
        $compile(valdrMessageElement)(scope);
      }
    }
  };
}];

angular.module('valdr')
  .directive('input', valdrMessageDirectiveDefinition)
  .directive('select', valdrMessageDirectiveDefinition)
  .directive('textarea', valdrMessageDirectiveDefinition)

/**
 * The valdr-message directive is responsible for the rendering of violation messages. The template used for rendering
 * is defined in the valdrMessage service where it can be overridden or a template URL can be configured.
 */
  .directive('valdrMessage',
    ['$rootScope', '$injector', 'valdrMessage', function ($rootScope, $injector, valdrMessage) {
      return {
        replace: true,
        restrict: 'A',
        scope: {
          formField: '=valdrMessage'
        },
        templateUrl: function () {
          return valdrMessage.templateUrl;
        },
        link: function (scope) {

          var updateTranslations = function () {
            if (valdrMessage.translateAvailable && angular.isArray(scope.violations)) {
              angular.forEach(scope.violations, function (violation) {
                var fieldNameKey = violation.type + '.' + violation.field;
                valdrMessage.$translate(fieldNameKey).then(function (translation) {
                  violation.fieldName = translation;
                });
              });
            }
          };

          scope.$watch('formField.valdrViolations', function (valdrViolations) {
            if (valdrViolations && valdrViolations.length) {
              scope.violations = valdrViolations;
              scope.violation = valdrViolations[0];
              updateTranslations();
            } else {
              scope.violation = undefined;
              scope.violations = undefined;
            }
          });

          $rootScope.$on('$translateChangeSuccess', function () {
            updateTranslations();
          });
        }
      };
    }]);

})(window, document);