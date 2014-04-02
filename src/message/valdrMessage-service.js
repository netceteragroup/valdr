angular.module('valdr')

  .provider('valdrMessage', function () {

    var templateUrl, template,
      defaultTemplateUrl = 'valdr/default-message.html',
      defaultTemplate = '<div class="valdr-message">{{ violation.message }}</div>';

    this.setTemplate = function (newTemplate) {
      template = newTemplate;
    };

    this.setTemplateUrl = function (newTemplateUrl) {
      templateUrl = newTemplateUrl;
    };

    this.$get = ['$templateCache', function($templateCache) {

      $templateCache.put(defaultTemplateUrl, template || defaultTemplate);
      if (templateUrl && template) {
        $templateCache.put(templateUrl, template);
      }

      return {
        templateUrl: templateUrl || defaultTemplateUrl
      };
    }];
  });