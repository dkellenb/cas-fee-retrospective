import {InitialPage} from './initial-page.po';
import {browser} from 'protractor';

describe('retrospective-client App', function () {

  it('sould walk through a complete retro', () => {
    let initalPage: InitialPage = new InitialPage();
    initalPage.navigateTo();
    initalPage.createRetrospective('My Title', 'This is a Description \nwith new Line', 'protector');
  });

});
