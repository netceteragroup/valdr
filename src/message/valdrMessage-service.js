angular.module('valdr')

/**
 * This service provides shared configuration between all valdr-message directive instances like the configured
 * template to render the violation messages and whether or not angular-translate is available.
 */
  .provider('valdrMessage', function () {

    var userDefinedTemplateUrl, userDefinedTemplate,
      messages = {},
      defaultTemplateUrl = 'valdr/default-message.html',
      defaultTemplate =   '<div class="valdr-message">' +
                            '{{ violation.message }}' +
                          '</div>',
      translateTemplate = '<div class="valdr-message" ng-show="violation">' +
                            '<span ' +
                            'translate="{{ violation.message }}" ' +
                            'translate-values="violation"></span>' +
                          '</div>';

    this.setTemplate = function (template) {
      userDefinedTemplate = template;
    };

    this.setTemplateUrl = function (templateUrl) {
      userDefinedTemplateUrl = templateUrl;
    };

    this.addMessages = function (newMessages) {
      angular.extend(messages, newMessages);
    };
    var addMessages = this.addMessages;

    this.getMessage = function (typeName, fieldName, validatorName) {
      var fullMessageKey = typeName + '.' + fieldName + '.' + validatorName;
      return messages[fullMessageKey] || messages[validatorName] || '[' + validatorName + ']';
    };
    var getMessage = this.getMessage;

    this.$get = ['$templateCache', '$injector', function ($templateCache, $injector) {

      var angularMessagesEnabled = false;

      function getTranslateService() {
        try {
          return $injector.get('$translate');
        } catch (error) {
          return undefined;
        }
      }

      function getFieldNameKeyGenerator() {
        try {
          return $injector.get('valdrFieldNameKeyGenerator');
        } catch (error) {
          return function(violation) {
            return violation.type + '.' + violation.field;
          };
        }
      }

      var $translate = getTranslateService(),
        translateAvailable = angular.isDefined($translate),
        fieldNameKeyGenerator = getFieldNameKeyGenerator();

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
        $translate: $translate,
        fieldNameKeyGenerator: fieldNameKeyGenerator,
        addMessages: addMessages,
        getMessage: getMessage,
        angularMessagesEnabled: angularMessagesEnabled
      };
    }];
  });
