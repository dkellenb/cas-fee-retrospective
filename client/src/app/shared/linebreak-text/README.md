#Linebreak Component
Provides a save (no use of innterHtml) way to convert a text with linebreak (\n \r) to a html paragraph (p) with breaks.

##Inputfields
| Parameter | Type   | Default | Description                    |
|-----------|--------|---------|--------------------------------|
| text      | string | null    | Text with linebreak (\n or \r) |

##Structure
there is just one component _rsb-linebreak-text_

There is a internal array of strings which represent the lines of the text. This array will be updated when ever a change happens on the input text.

##Examples
###In angular
```html
<rsb-linebreak-text [text]="'this is a example text.\nThis is the next Line.\nand aganin'"></rsb-linebreak-text>
```
###Outpout
```html
<p>this is a example text.<br/>This is the next Line.<br/>and aganin</p>
```


