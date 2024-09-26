import EnvironmentEnum from 'src/enums/environment';

const Config = {
  Env: process.env.REACT_APP_NODE_ENV,
  Common: {
    ApiBaseUrl: 'http://localhost:8080',
    ApiKey: 'testerino',
    AppName: 'Viviboom',
    FrontEndRootUrl: 'http://localhost:3028',
    SupportEmailName: 'mail',
    SupportEmailDomain: 'mail.com',
    MobileAppUrl: 'https://mobile.viviboom.co',
    BuilderAppId: '89eb27fc1b6a4fa68a17b4eb34dfec52',
    StreamChatAppKey: '97y36uwkrksp',
    ReCaptchaSiteKey: '6LdXrKUpAAAAAPhTkH3zJ7ZgjLGkqiS86cjlkIuC',
  },
};

if (process.env.REACT_APP_NODE_ENV === EnvironmentEnum.Release) {
  Config.Common.ApiBaseUrl = 'https://release-api.viviboom.co';
  Config.Common.FrontEndRootUrl = 'https://release.viviboom.co';
  Config.Common.BuilderAppId = '89eb27fc1b6a4fa68a17b4eb34dfec52';
}

if (process.env.REACT_APP_NODE_ENV === EnvironmentEnum.Production) {
  Config.Common.ApiBaseUrl = 'https://api.viviboom.co';
  Config.Common.FrontEndRootUrl = 'https://www.viviboom.co';
  Config.Common.BuilderAppId = 'ecc7481e653d4da8828368fd1aeafee0';
}

if (process.env.REACT_APP_NODE_ENV === EnvironmentEnum.Test) {
  Config.Common.FrontEndRootUrl = 'https://test.viviboom.co';
  Config.Common.ApiBaseUrl = 'https://test-api.viviboom.co';
  Config.Common.BuilderAppId = '89eb27fc1b6a4fa68a17b4eb34dfec52';
}
Config.Common.CloudFrontFull = `${Config.Common.CloudFrontUrl}/${Config.Common.CloudFrontIndentifier}`;

export default Config;
