import { RetrospectiveClientPage } from './app.po';

describe('retrospective-client App', function() {
  let page: RetrospectiveClientPage;

  beforeEach(() => {
    page = new RetrospectiveClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
