import IMailTemplateProvider from '../models/IMailTemplateProvider';

class FakeTemplateMailProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail Content';
  }
}

export default FakeTemplateMailProvider;
