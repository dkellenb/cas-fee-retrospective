import { CasFeeRetrospectivePage } from './app.po';

describe('cas-fee-retrospective App', function() {
  let page: CasFeeRetrospectivePage;

  beforeEach(() => {
    page = new CasFeeRetrospectivePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
