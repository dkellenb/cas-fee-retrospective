import {browser, element, by, protractor} from 'protractor';
import {RetrospectivePage} from './retrospective-page.po';

export class InitialPage {
  public joinRetroKeyInput = element(by.id('joinSessionKey'));
  public joinShortNameInput = element(by.id('joinSessionShortName'));

  public createRetroTitleInput = element(by.id('createSessionTitle'));
  public createDescriptionInput = element(by.id('createSessionDesc'));
  public createShortNameInput = element(by.id('createSessionShortName'));
  public createSubmitButton = element(by.xpath('//*[contains(text(),"Create new Retrospective")]'));

  private until = protractor.ExpectedConditions;

  public navigateTo() {
    browser.get('/');
    // Reset browser Local Storage so no user is logged in.
    browser.executeScript('window.localStorage.clear();');
  }

  public createRetrospective(title: string, description: string, shortName: string): RetrospectivePage {
    this.createRetroTitleInput.sendKeys(title);
    this.createDescriptionInput.sendKeys(description);
    this.createShortNameInput.sendKeys(shortName);
    this.createSubmitButton.click();

    browser.waitForAngular();
    browser.wait(this.until.presenceOf(element(by.xpath('//*[contains(text(),"Continue doing")]'))), 5000,
      'Toke too long for loading retro');
    return;
  }

}
