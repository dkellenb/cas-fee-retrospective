export class IconButtonType {

  /*Static Buttons*/
  public static NONE:IconButtonType = new IconButtonType('icon-button__icon_none',false);
  public static ADD:IconButtonType = new IconButtonType('icon-button__icon_add', false);
  public static ABOARD:IconButtonType = new IconButtonType('icon-button__icon_aboard', false);
  public static DELETE:IconButtonType = new IconButtonType('icon-button__icon_delete', false);
  public static CHECK_MARK:IconButtonType = new IconButtonType('icon-button__icon_check-mark', false);
  public static ARROW_UP:IconButtonType = new IconButtonType('icon-button__icon_collapsible_close', false);
  public static ARROW_DOWN:IconButtonType = new IconButtonType('icon-button__icon_collapsible_open', false);
  public static ARROW_LEFT:IconButtonType = new IconButtonType('icon-button__icon_back', false);
  public static ARROW_RIGHT:IconButtonType = new IconButtonType('icon-button__icon_forward', false);
  public static VOTE:IconButtonType = new IconButtonType('icon-button__icon_vote', false);

  /*Toggle Buttons*/
  public static COLLAPSIBLE:IconButtonType = new IconButtonType('icon-button__icon_vote', true);

  private _isToggleButton;
  private _className:string;

  private constructor(className:string, isToggleButton:boolean) {
    this._className = className;
    this._isToggleButton = isToggleButton;
  }

  get isToggleButton() {
    return this._isToggleButton;
  }

  get className():string {
    return this._className;
  }
}
