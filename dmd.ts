
/**
 * LED Dot Matrix Display interface
 */

 const i2cAddr = 126;

 enum G_COMMAND {
     G_NONE = 0,
     G_CLEAR,
     G_POINT,
     G_LINE,
     G_CIRCLE,
     G_RECTANGLE,
     G_TEXT,
     G_SCROLL,
     G_INIT
 }
 
enum NeoPixelColors {
    //% block=black
    Black = 0,
    //% block=red
    Red = 1,
    //% block=purple
    Purple = 2,
    //% block=yellow
    Yellow = 3,
    //% block=green
    Green = 4,
    //% block=cyan
    Cyan = 5,
    //% block=blue
    Blue = 6,
    //% block=white
    White = 7
}
 /**
  * Custom blocks
  */
 //% weight=100 color=#0fbc11 icon="\uf0ce" block="DMD"
 namespace dmd {
 
     /**
      * Configure screen size
      * @param width Number of displays wide (1, 2)
      * @param height Number of displays tall (1, 2)
      */
     //% block="configure screen width %width height %height"
     //% width.min=1 width.max=2 width.defl=1
     //% height.min=1 height.max=2 height.defl=1
     //% width.fieldOptions.precision=1
     //% height.fieldOptions.precision=1
     export function configureScreen(width: number = 1, height: number = 1): void {
         let buf: Buffer = pins.createBuffer(10);
         buf[0] = G_COMMAND.G_INIT;
         buf[1] = width;
         buf[2] = height;
         pins.i2cWriteBuffer(i2cAddr, buf);
     }
  
     /**
      * Fill the whole screen
      * @param colour Colour (0 = off, 1 = on)
      */
     //% block="fill screen with|colour %colour=pixel_colors"
     //% colour.min=0 colour.max=1
     //% colour.fieldOptions.precision=1
     export function fillScreen(colour: number): void {
         let buf: Buffer = pins.createBuffer(10);
         buf[0] = G_COMMAND.G_CLEAR;
         buf[1] = colour;
         pins.i2cWriteBuffer(i2cAddr, buf);
     }
 
     /**
      * Draw a single point on display
      * @param x X location
      * @param y Y location
      * @param colour Colour (0 = off, 1 = on)
      */
     //% block="draw point|x %x y %y|colour %colour=pixel_colors"
     //% x.min=0 y.min=0
     //% x.fieldOptions.precision=1 y.fieldOptions.precision=1
     //% colour.fieldOptions.precision=1
     //% colour.min=0 colour.max=1
     //% colour.fieldOptions.precision=1
     export function drawPoint(x: number, y: number, colour: number): void {
         let buf: Buffer = pins.createBuffer(10);
         buf[0] = G_COMMAND.G_POINT;
         buf[1] = x;
         buf[2] = y;
         buf[3] = colour;
         pins.i2cWriteBuffer(i2cAddr, buf);
     }
 
     /**
      * Draw a circle on display
      * @param x X location
      * @param y Y location
      * @param r Radius
      * @param colour Colour (0 = off, 1 = on)
      */
     //% block="draw circle|x %x y %y|radius %r|fill? %fill|colour %colour=pixel_colors"
     //% x.min=0 y.min=0 r.min=1 r.max=31
     //% x.fieldOptions.precision=1 y.fieldOptions.precision=1 r.fieldOptions.precision=1
     //% colour.fieldOptions.precision=1
     //% colour.min=0 colour.max=1
     //% colour.fieldOptions.precision=1
     export function drawCircle(x: number, y: number, r: number, fill: boolean, colour: number): void {
         let buf: Buffer = pins.createBuffer(10);
         buf[0] = G_COMMAND.G_CIRCLE;
         buf[1] = x;
         buf[2] = y;
         buf[3] = r;
         buf[4] = fill ? 1 : 0;
         buf[5] = colour;
         pins.i2cWriteBuffer(i2cAddr, buf);
     }
 
     /**
      * Draw a rectangle on display
      * @param x1 First X location
      * @param y1 First Y location
      * @param x2 Second X location
      * @param y3 Second Y location
      * @param fill Filled rectangle?
      * @param colour Colour (0 = off, 1 = on)
      */
     //% block="draw rectangle|start x %x1 start y %y1|end x %x2 end y %y2|fill? %fill|colour %colour=pixel_colors"
     //% x1.min=0 y1.min=0
     //% x2.min=0 y2.min=0
     //% colour.min=0 colour.max=1
     //% colour.fieldOptions.precision=1
     //% x1.fieldOptions.precision=1 y1.fieldOptions.precision=1
     //% x2.fieldOptions.precision=1 y2.fieldOptions.precision=1
     //% colour.fieldOptions.precision=1
     export function drawRectangle(x1: number, y1: number, x2: number, y2: number, fill: boolean, colour: number): void {
         let buf: Buffer = pins.createBuffer(10);
         buf[0] = G_COMMAND.G_RECTANGLE;
         buf[1] = x1;
         buf[2] = y1;
         buf[3] = x2;
         buf[4] = y2;
         buf[5] = fill ? 1 : 0;
         buf[6] = colour;
         pins.i2cWriteBuffer(i2cAddr, buf);
     }
 
     /**
      * Draw a line on display
      * @param x1 First X location
      * @param y1 First Y location
      * @param x2 Second X location
      * @param y3 Second Y location
      * @param colour Colour (0 = off, 1 = on)
      */
     //% block="draw line|start x %x1 start y %y1|end x %x2 end y %y2|colour %colour=pixel_colors"
     //% x1.min=0 y1.min=0
     //% x2.min=0 y2.min=0
     //% x1.fieldOptions.precision=1 y1.fieldOptions.precision=1
     //% x2.fieldOptions.precision=1 y2.fieldOptions.precision=1
     //% colour.min=0 colour.max=1
     //% colour.fieldOptions.precision=1
     export function drawLine(x1: number, y1: number, x2: number, y2: number, colour: number): void {
         let buf: Buffer = pins.createBuffer(10);
         buf[0] = G_COMMAND.G_LINE;
         buf[1] = x1;
         buf[2] = y1;
         buf[3] = x2;
         buf[4] = y2;
         buf[5] = colour;
         pins.i2cWriteBuffer(i2cAddr, buf);
     }
 
     /**
      * Draw a short string of text
      * @param x X location
      * @param y Y location
      * @param text Text to display
      * @param colour Colour (0 = off, 1 = on)
      */
     //% block="draw text|x %x y %y|text %text|colour %colour=pixel_colors"
     //% x.min=0 y.min=0 text.maxLength=6
     //% x.fieldOptions.precision=1 y.fieldOptions.precision=1
     //% colour.min=0 colour.max=1
     //% colour.fieldOptions.precision=1
     export function drawText(x: number, y: number, text: string, colour: number): void {
         let buf: Buffer = pins.createBuffer(10);
         buf[0] = G_COMMAND.G_TEXT;
         buf[1] = x;
         buf[2] = y;
         buf[3] = colour;
         buf[4] = text.charCodeAt(0);
         buf[5] = text.charCodeAt(1);
         buf[6] = text.charCodeAt(2);
         buf[7] = text.charCodeAt(3);
         buf[8] = text.charCodeAt(4);
         buf[9] = text.charCodeAt(5);
         pins.i2cWriteBuffer(i2cAddr, buf);
     }
  
     /**
      * Gets the RGB value of a known color
     */
     //% weight=2 blockGap=8
     //% blockId="pixel_colors" block="%color"
     export function colors(color: PixelColors): number {
         return color;
     }
 }
 
