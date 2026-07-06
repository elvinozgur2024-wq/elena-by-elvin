import "server-only";
import Iyzipay from "iyzipay";
import { env } from "@/lib/env";

export const iyzico = new Iyzipay({
  apiKey: env.IYZICO_API_KEY,
  secretKey: env.IYZICO_SECRET_KEY,
  uri: env.IYZICO_BASE_URL,
});

export interface IyzicoBasketItem {
  id: string;
  name: string;
  category1: string;
  itemType: string;
  price: string;
}

export interface IyzicoBuyer {
  id: string;
  name: string;
  surname: string;
  email: string;
  gsmNumber: string;
  identityNumber: string;
  city: string;
  country: string;
  address: string;
  ip: string;
}

export interface InitializeCheckoutParams {
  conversationId: string;
  price: string; // sum of basket item prices, as string
  paidPrice: string; // total charged, as string
  currency?: string;
  basketId: string;
  callbackUrl: string;
  buyer: IyzicoBuyer;
  shippingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  basketItems: IyzicoBasketItem[];
}

export function initializeCheckoutForm(
  params: InitializeCheckoutParams,
): Promise<{ status: string; paymentPageUrl?: string; errorMessage?: string }> {
  return new Promise((resolve, reject) => {
    iyzico.checkoutFormInitialize.create(
      {
        locale: Iyzipay.LOCALE.TR,
        conversationId: params.conversationId,
        price: params.price,
        paidPrice: params.paidPrice,
        currency: Iyzipay.CURRENCY.TRY,
        basketId: params.basketId,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        callbackUrl: params.callbackUrl,
        enabledInstallments: [1, 2, 3, 6, 9],
        buyer: params.buyer,
        shippingAddress: params.shippingAddress,
        billingAddress: params.billingAddress,
        basketItems: params.basketItems.map((item) => ({
          ...item,
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        })),
      },
      (err: unknown, result: { status: string; paymentPageUrl?: string; errorMessage?: string }) => {
        if (err) reject(err);
        else resolve(result);
      },
    );
  });
}

export interface RetrieveCheckoutResult {
  status: string;
  paymentStatus?: string;
  paymentId?: string;
  price?: string;
  paidPrice?: string;
  errorMessage?: string;
  raw: unknown;
}

interface RawCheckoutFormResult {
  status: string;
  paymentStatus?: string;
  paymentId?: string;
  price?: string;
  paidPrice?: string;
  errorMessage?: string;
  conversationId?: string;
}

export function retrieveCheckoutForm(
  token: string,
  conversationId: string,
): Promise<RetrieveCheckoutResult> {
  return new Promise((resolve, reject) => {
    iyzico.checkoutForm.retrieve(
      { locale: Iyzipay.LOCALE.TR, conversationId, token },
      (err: unknown, result: RawCheckoutFormResult) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({
          status: result.status,
          paymentStatus: result.paymentStatus,
          paymentId: result.paymentId,
          price: result.price,
          paidPrice: result.paidPrice,
          errorMessage: result.errorMessage,
          raw: result,
        });
      },
    );
  });
}
