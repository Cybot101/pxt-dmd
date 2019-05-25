
/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */

const i2cAddr = 8;

enum G_COMMAND {
    G_NONE = 0,
    G_CLEAR,
    G_POINT,
    G_LINE,
    G_CIRCLE,
    G_RECTANGLE,
    G_TEXT,
    G_SCROLL
}

/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon=""
namespace dmd {
    
    /**
     * Clear a single point on display
     * @param x X location
     * @param y Y location
     */
    //% block
    export function clearPoint(x: number, y: number): void {
        let buf: Buffer = pins.createBuffer(5);
        buf[0] = 0x10;
        buf[1] = G_COMMAND.G_POINT;
        buf[2] = x;
        buf[3] = y;
        buf[4] = 0;
        pins.i2cWriteBuffer(i2cAddr, buf);
    }
    /**
     * Draw a single point on display
     * @param x X location
     * @param y Y location
     */
    //% block
    export function drawPoint(x: number, y: number): void {
        let buf: Buffer = pins.createBuffer(5);
        buf[0] = 0x10;
        buf[1] = G_COMMAND.G_POINT;
        buf[2] = x;
        buf[3] = y;
        buf[4] = 1;
        pins.i2cWriteBuffer(i2cAddr, buf);
    }

    /**
     * Draw a circle on display
     * @param x X location
     * @param y Y location
     * @param r Radius
     */
    //% block
    export function drawCircle(x: number, y: number, r: number): void {
        let buf: Buffer = pins.createBuffer(5);
        buf[0] = 0x10;
        buf[1] = G_COMMAND.G_CIRCLE;
        buf[2] = x;
        buf[3] = y;
        buf[4] = r;
        pins.i2cWriteBuffer(i2cAddr, buf);
    }

    /**
     * TODO: describe your function here
     * @param value describe value here, eg: 5
     */
    //% block
    export function fib(value: number): number {
        return value <= 1 ? value : fib(value - 1) + fib(value - 2);
    }
}
