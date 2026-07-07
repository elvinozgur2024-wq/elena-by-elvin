import "server-only";
import crypto from "node:crypto";
import { env } from "@/lib/env";

// Direct REST integration with iyzico — no iyzipay npm package.
//
// The package dynamically fs.readdirSync()'s and require()'s its own resource
// files at runtime instead of using static imports. That pattern survives
// local dev (full node_modules on disk) and even `next build` locally, but
// Vercel's serverless file tracer can't reliably follow it, so the deployed
// function was missing files and crashing on every request. This
// reimplementation follows iyzico's documented IYZWSv2 HMAC-SHA256 auth
// scheme directly — verified against the (working) iyzipay package's own
// signing code before being extracted here.

const IYZI_WS_HEADER = "IYZWSv2";

function formatPrice(price: number): string {
  const str = price.toFixed(2);
  return str.endsWith(".00") ? `${Math.trunc(price)}.0` : str;
}

function randomString(): string {
  return crypto.randomBytes(16).toString("hex");
}

function signRequest(uriPath: string, body: unknown) {
  const rnd = randomString();
  const bodyJson = JSON.stringify(body);
  const signature = crypto
    .createHmac("sha256", env.IYZICO_SECRET_KEY)
    .update(rnd + uriPath + bodyJson)
    .digest("hex");

  const authorizationParams = [
    `apiKey:${env.IYZICO_API_KEY}`,
    `randomKey:${rnd}`,
    `signature:${signature}`,
  ];
  const authorization = `${IYZI_WS_HEADER} ${Buffer.from(authorizationParams.join("&")).toString("base64")}`;

  return {
    bodyJson,
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
      "x-iyzi-rnd": rnd,
      "x-iyzi-client-version": "elena-by-elvin-direct-1.0",
    },
  };
}

async function iyzicoPost<T>(uriPath: string, body: unknown): Promise<T> {
  const { bodyJson, headers } = signRequest(uriPath, body);
  const res = await fetch(`${env.IYZICO_BASE_URL}${uriPath}`, {
    method: "POST",
    headers,
    body: bodyJson,
  });
  return (await res.json()) as T;
}

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
  registrationAddress: string;
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

interface RawInitializeResponse {
  status: string;
  paymentPageUrl?: string;
  errorMessage?: string;
}

export async function initializeCheckoutForm(
  params: InitializeCheckoutParams,
): Promise<{ status: string; paymentPageUrl?: string; errorMessage?: string }> {
  const uriPath = "/payment/iyzipos/checkoutform/initialize/auth/ecom";

  const requestBody = {
    locale: "tr",
    conversationId: params.conversationId,
    price: formatPrice(Number(params.price)),
    paidPrice: formatPrice(Number(params.paidPrice)),
    currency: params.currency ?? "TRY",
    basketId: params.basketId,
    paymentGroup: "PRODUCT",
    callbackUrl: params.callbackUrl,
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
      id: params.buyer.id,
      name: params.buyer.name,
      surname: params.buyer.surname,
      identityNumber: params.buyer.identityNumber,
      email: params.buyer.email,
      gsmNumber: params.buyer.gsmNumber,
      registrationAddress: params.buyer.registrationAddress,
      city: params.buyer.city,
      country: params.buyer.country,
      ip: params.buyer.ip,
    },
    shippingAddress: {
      address: params.shippingAddress.address,
      contactName: params.shippingAddress.contactName,
      city: params.shippingAddress.city,
      country: params.shippingAddress.country,
    },
    billingAddress: {
      address: params.billingAddress.address,
      contactName: params.billingAddress.contactName,
      city: params.billingAddress.city,
      country: params.billingAddress.country,
    },
    basketItems: params.basketItems.map((item) => ({
      id: item.id,
      price: formatPrice(Number(item.price)),
      name: item.name,
      category1: item.category1,
      itemType: "PHYSICAL",
    })),
  };

  const result = await iyzicoPost<RawInitializeResponse>(uriPath, requestBody);
  return {
    status: result.status,
    paymentPageUrl: result.paymentPageUrl,
    errorMessage: result.errorMessage,
  };
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

export async function retrieveCheckoutForm(
  token: string,
  conversationId: string,
): Promise<RetrieveCheckoutResult> {
  const uriPath = "/payment/iyzipos/checkoutform/auth/ecom/detail";
  const requestBody = { locale: "tr", conversationId, token };

  const result = await iyzicoPost<RawCheckoutFormResult>(uriPath, requestBody);

  return {
    status: result.status,
    paymentStatus: result.paymentStatus,
    paymentId: result.paymentId,
    price: result.price,
    paidPrice: result.paidPrice,
    errorMessage: result.errorMessage,
    raw: result,
  };
}
