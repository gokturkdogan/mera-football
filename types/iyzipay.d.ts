declare module 'iyzipay' {
  export default class Iyzipay {
    constructor(config: {
      apiKey: string
      secretKey: string
      uri: string
    })
    
    checkoutForm: {
      create: (request: any, callback: (err: any, result: any) => void) => void
      retrieve: (request: any, callback: (err: any, result: any) => void) => void
    }
    
    [key: string]: any
  }
}
