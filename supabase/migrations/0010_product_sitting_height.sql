-- Product spec display is moving to a Dimensions + Sitting Height format
-- (e.g. "15 x 6 x 6 cm" / "9 cm"), matching common plush-retailer product
-- pages. The existing `size` column is repurposed to hold the dimensions
-- string; this adds the second, optional value.
alter table products add column if not exists sitting_height text;
