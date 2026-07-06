declare module "iyzipay" {
  interface IyzipayOptions {
    apiKey: string;
    secretKey: string;
    uri: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Callback = (err: unknown, result: any) => void;

  export default class Iyzipay {
    constructor(options: IyzipayOptions);

    static LOCALE: { TR: string; EN: string };
    static CURRENCY: { TRY: string; USD: string; EUR: string; GBP: string };
    static PAYMENT_GROUP: { PRODUCT: string; LISTING: string; SUBSCRIPTION: string };
    static BASKET_ITEM_TYPE: { PHYSICAL: string; VIRTUAL: string };

    checkoutFormInitialize: {
      create: (request: Record<string, unknown>, callback: Callback) => void;
    };
    checkoutForm: {
      retrieve: (request: Record<string, unknown>, callback: Callback) => void;
    };
  }
}
