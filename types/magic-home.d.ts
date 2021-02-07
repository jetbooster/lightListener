/* eslint-disable */

declare module 'magic-home' {
  declare interface callback<T=any> { (err:Error, value:T):void}
  declare interface ack {
    power: boolean;
    color: boolean;
    pattern: boolean;
    custom_pattern: boolean;
  }
  declare interface ControlOptions {
    ack?: ack;
    log_all_received?: boolean;
    apply_masks?: boolean;
    connect_timeout?: number;
    command_timeout?: number;
    cold_white_support?: boolean;
  }

  declare class Control {
    constructor(address:string, opt?:ControlOptions)

    static patternNames: string[];

    static ackMask(mask:number):ack;

    setPower(boolean, cb:callback)

    turnOn(cb:callback)

    turnOff(cb:callback)

    setColorAndWarmWhite(red:number, green:number, blue:number, ww:number, cb:callback)

    setColorAndWhites(red:number, green:number, blue:number, ww:number, cw:number, cb:callback)

    setColor(red:number, green:number, blue:number, cb:callback)

    setWarmWhite(red:number, green:number, blue:number, ww:number, cw:number, cb:callback)

    setWhites(ww:number, cw:number, cb:callback)

    setColorWithBrightness(red:number, green:number, blue:number, brightness:number, cb:callback)

    setPattern(pattern:string, speed:number, cb:callback)

    setCustomPattern() // TBD

    setIAPattern() // TBD

    queryState(cb:callback) // TBD

    startEffectMode(cb:callback)
  }

  declare interface client {
    address:string,
    id: string,
    model:string
  }

  declare class Discovery {
    static scan(timeout:number)
    constructor()
    scan(timeout?:number,cb?:callback)
    scan(cb?:callback)
    declare const clients:client[]
    declare const scanned: boolean
  }

}
