#include "pxt.h"
#include <stdint.h>
#include <stdbool.h>

using namespace pxt;

/**
* DMD operations
*/
//% weight=5 color=#002050 icon="\uf0a0"
namespace dmd
{    
    typedef uint8_t byte;

    //Arduino pins used for the display connection
    #define PIN_DMD_nOE       uBit.io.P9    // D9 active low Output Enable, setting this low lights all the LEDs in the selected rows. Can pwm it at very high frequency for brightness control.
    #define PIN_DMD_A         uBit.io.P6    // D6
    #define PIN_DMD_B         uBit.io.P7    // D7
    #define PIN_DMD_CLK       13   // D13_SCK  is SPI Clock if SPI is used
    #define PIN_DMD_SCLK      uBit.io.P8    // D8
    #define PIN_DMD_R_DATA    15   // D11_MOSI is SPI Master Out if SPI is used
    //Define this chip select pin that the Ethernet W5100 IC or other SPI device uses
    //if it is in use during a DMD scan request then scanDisplayBySPI() will exit without conflict! (and skip that scan)
    #define PIN_OTHER_SPI_nCS uBit.io.P16
    // ######################################################################################################################
    // ######################################################################################################################

    //DMD I/O pin macros
    #define LIGHT_DMD_ROW_01_05_09_13()       {  PIN_DMD_B.setDigitalValue(0); PIN_DMD_A.setDigitalValue(0); }
    #define LIGHT_DMD_ROW_02_06_10_14()       { PIN_DMD_B.setDigitalValue(0); PIN_DMD_A.setDigitalValue(1); }
    #define LIGHT_DMD_ROW_03_07_11_15()       { PIN_DMD_B.setDigitalValue(1); PIN_DMD_A.setDigitalValue(0); }
    #define LIGHT_DMD_ROW_04_08_12_16()       { PIN_DMD_B.setDigitalValue(1); PIN_DMD_A.setDigitalValue(1); }
    #define LATCH_DMD_SHIFT_REG_TO_OUTPUT()   { PIN_DMD_SCLK.setDigitalValue(1); PIN_DMD_SCLK.setDigitalValue(0); }
    #define OE_DMD_ROWS_OFF()                 { PIN_DMD_nOE.setDigitalValue(0); }
    #define OE_DMD_ROWS_ON()                  { PIN_DMD_nOE.setDigitalValue(1); }

    //display screen (and subscreen) sizing
    #define DMD_PIXELS_ACROSS         32      //pixels across x axis (base 2 size expected)
    #define DMD_PIXELS_DOWN           16      //pixels down y axis
    #define DMD_BITSPERPIXEL           1      //1 bit per pixel, use more bits to allow for pwm screen brightness control
    #define DMD_RAM_SIZE_BYTES        ((DMD_PIXELS_ACROSS*DMD_BITSPERPIXEL/8)*DMD_PIXELS_DOWN)
                                    // (32x * 1 / 8) = 4 bytes, * 16y = 64 bytes per screen here.
    //lookup table for DMD::writePixel to make the pixel indexing routine faster
    static byte bPixelLookupTable[8] =
    {
        0x80,   //0, bit 7
        0x40,   //1, bit 6
        0x20,   //2. bit 5
        0x10,   //3, bit 4
        0x08,   //4, bit 3
        0x04,   //5, bit 2
        0x02,   //6, bit 1
        0x01    //7, bit 0
    };

    //Display information
    const byte DisplaysWide = 1;
    const byte DisplaysHigh = 1;
    const byte DisplaysTotal = 1;
    int row1, row2, row3;

    byte bDMDScreenRAM[DisplaysTotal*DMD_RAM_SIZE_BYTES] = {0};

    //scanning pointer into bDMDScreenRAM, setup init @ 48 for the first valid scan
    volatile byte bDMDByte;

    SPI spi(MOSI, MISO, SCK); // mosi, miso, sclk

    static bool inited = false;

    // Initializes file system. Must be called before any FS operation.
    // built-in size computation for file system
    // does not take into account size changes
    // for compiled code
    void initDmd()
    {
        if (!inited)
        {
            spi.format(8,0);
            spi.frequency(1000000);
        }
    }

    /**
    */
    //% blockId="update_display" block="update display"
    //% blockExternalInputs=1 weight=90 blockGap=8
    void updateDisplay()
    {
        initDmd();
        
        //if PIN_OTHER_SPI_nCS is in use during a DMD scan request then scanDisplayBySPI() will exit without conflict! (and skip that scan)
        //SPI transfer pixels to the display hardware shift registers
        int rowsize=DisplaysTotal<<2;
        int offset=rowsize * bDMDByte;
        for (int i=0;i<rowsize;i++) {
            spi.write((int)bDMDScreenRAM[offset+i+row3]);
            spi.write((int)bDMDScreenRAM[offset+i+row2]);
            spi.write((int)bDMDScreenRAM[offset+i+row1]);
            spi.write((int)bDMDScreenRAM[offset+i]);
        }

        OE_DMD_ROWS_OFF();
        LATCH_DMD_SHIFT_REG_TO_OUTPUT();
        switch (bDMDByte) {
        case 0:			// row 1, 5, 9, 13 were clocked out
            LIGHT_DMD_ROW_01_05_09_13();
            bDMDByte=1;
            break;
        case 1:			// row 2, 6, 10, 14 were clocked out
            LIGHT_DMD_ROW_02_06_10_14();
            bDMDByte=2;
            break;
        case 2:			// row 3, 7, 11, 15 were clocked out
            LIGHT_DMD_ROW_03_07_11_15();
            bDMDByte=3;
            break;
        case 3:			// row 4, 8, 12, 16 were clocked out
            LIGHT_DMD_ROW_04_08_12_16();
            bDMDByte=0;
            break;
        }
        OE_DMD_ROWS_ON();
    }

}
