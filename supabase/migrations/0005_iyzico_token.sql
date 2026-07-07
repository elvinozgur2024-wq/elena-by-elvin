-- Elena Babywear — store the iyzico checkout token on the order at
-- initialization time, so the payment callback (which only receives a
-- token) can look up the order directly instead of relying on iyzico's
-- retrieve API to echo back a conversationId — it doesn't; it just echoes
-- back whatever conversationId was sent in that specific retrieve request.

alter table orders add column iyzico_token text;

create index orders_iyzico_token_idx on orders(iyzico_token);
