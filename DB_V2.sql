CREATE TABLE "category" (
  "id" varchar(36) PRIMARY KEY,
  "name" varchar NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "brand" (
  "id" varchar(36) PRIMARY KEY,
  "name" varchar NOT NULL,
  "logo" varchar NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "category_detail" (
  "id" varchar(36) NOT NULL,
  "brand_id" varchar(36) NOT NULL,
  "cate_id" varchar(36) NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "products" (
  "id" varchar(36) PRIMARY KEY,
  "name" varchar NOT NULL UNIQUE,
  "content" text,
  "image_link" text NOT NULL,
  "image_list" text NOT NULL,
  "view" int NOT NULL DEFAULT 0,
  "sold" int NOT NULL DEFAULT 0,
  "qty" int NOT NULL DEFAULT 0,
  "status" int NOT NULL DEFAULT 0,
  "cate_id" varchar(36) NOT NULL,
  "brand_id" varchar(36) NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "ribbon" (
  "id" varchar(36) PRIMARY KEY,
  "name" varchar NOT NULL UNIQUE,
  "active" int NOT NULL DEFAULT 0,
  "priority" int NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "ribbon_detail" (
  "id" varchar(36) NOT NULL,
  "ribbon_id" varchar(36) NOT NULL,
  "product_id" varchar(36) NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "users" (
  "id" varchar(36) PRIMARY KEY,
  "name" varchar NOT NULL,
  "gender" int NOT NULL,
  "avatar" varchar NOT NULL,
  "age" int NOT NULL,
  "email" varchar NOT NULL,
  "password" varchar NOT NULL,
  "phone" varchar NOT NULL,
  "status" int NOT NULL DEFAULT 0,
	"token" varchar NOT NULL DEFAULT 0,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "address" (
  "id" varchar(36) PRIMARY KEY,
  "user_id" varchar(36) NOT NULL,
  "address" varchar NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "rate" (
  "id" varchar(36) NOT NULL,
  "product_id" varchar(36) NOT NULL,
  "order_id" varchar(36) NOT NULL,
  "point" int NOT NULL DEFAULt 5,
  "comment" varchar,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

-- CREATE TABLE "cart" (
--   "id" varchar(36) PRIMARY KEY,
--   "user_id" varchar(36) NOT NULL,
--   "status" int NOT NULL DEFAULT 0,
--   "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
--   "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
-- );

-- CREATE TABLE "cart_detail" (
--   "id" varchar(36) NOT NULL,
--   "cart_id" varchar(36) NOT NULL,
--   "product_id" varchar(36) NOT NULL,
--   "qty" int NOT NULL DEFAULT 1,
--   "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
--   "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
-- );
CREATE TABLE "cart_detail" (
  "id" varchar(36) NOT NULL,
  "user_id" varchar(36) NOT NULL,
  "product_id" varchar(36) NOT NULL,
  "price" int NOT NULL,
  "qty" int NOT NULL DEFAULT 1,
  "status" int NOT NULL DEFAULT 0,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "admin" (
"id" varchar(36) PRIMARY KEY,
"name" varchar NOT NULL,
"gender" int NOT NULL DEFAULT 0,
"birthday" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
"avatar" varchar,
"address" varchar NOT NULL,
"email" varchar NOT NULL,
"password" varchar NOT NULL,
"phone" varchar NOT NULL,
"status" int NOT NULL DEFAULT 0,
"home_town" varchar NOT NULL,
"cccd" varchar NOT NULL,
"token" varchar NOT NULL DEFAULT 0,
"createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
"updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "shipper" (
"id" varchar(36) PRIMARY KEY,
"name" varchar NOT NULL,
"gender" int NOT NULL DEFAULT 0,
"birthday" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
"avatar" varchar,
"address" varchar NOT NULL,
"email" varchar NOT NULL,
"password" varchar NOT NULL,
"phone" varchar NOT NULL,
"status" int NOT NULL DEFAULT 0,
"home_town" varchar NOT NULL,
"cccd" varchar NOT NULL,
"token" varchar NOT NULL DEFAULT 0,
"createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
"updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "order" (
"id" varchar(36) PRIMARY KEY,
"user_id" varchar(36) NOT NULL,
-- "total" int NOT NULL DEFAULT 0,
"discount" int NOT NULL DEFAULT 0,
"order_date" date NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
"admin_id" varchar(36) NOT NULL,
"shipper_id" varchar(36) NOT NULL,
"status" int NOT NULL DEFAULT 0,
"user_checkout" json,
"createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
"updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "order_detail" (
  "id" varchar(36) NOT NULL,
  "order_id" varchar(36) NOT NULL,
  "product_id" varchar(36) NOT NULL,
  "price" int NOT NULL,
  "qty" int NOT NULL DEFAULT 1,
  -- "status" int NOT NULL DEFAULT 0,
  -- "comment" varchar NOT NULL DEFAULT '',
  -- "rate" int NOT NULL DEFAULT 0,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

-- CREATE TABLE "phieu_tra" (
-- "id" varchar(36) PRIMARY KEY,
-- "user_id" varchar(36) NOT NULL,
-- "address_receive" varchar NOT NULL,
-- "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
-- "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
-- );

CREATE TABLE "transaction" (
  "id" varchar(36) NOT NULL,
  "order_id" varchar(36) NOT NULL,
  "user_id" varchar(36) NOT NULL,
  "amount" int NOT NULL,
  "status" varchar NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "promoes" (
  "id" varchar(36) PRIMARY KEY,
  "title" varchar NOT NULL,
  "code" varchar(10) NOT NULL,
  "type" int NOT NULL DEFAULT 0,
  "value_type" int NOT NULL DEFAULT 0,
  "status" int NOT NULL DEFAULT 0,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "voucher" (
  "id" varchar(36) NOT NULL,
  "user_id" varchar(36) NOT NULL,
  "promo_id" varchar NOT NULL,
  "is_active" int NOT NULL DEFAULT 0,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "nhap_hang" (
  "id" varchar(36) PRIMARY KEY,
  "admin_id" varchar(36) NOT NULL,
  "total" int NOT NULL DEFAULT 0,
  "note" text NOT NULL,
  "nhaphang_date" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "chi_tiet_nhap_hang" (
  "id" varchar(36) NOT NULL,
  "nhaphang_id" varchar(36) NOT NULL,
  "product_id" varchar(36) NOT NULL,
  "qty" int NOT NULL DEFAULT 0,
  "amount" int NOT NULL DEFAULT 0,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "thay_doi_gia" (
  "id" varchar(36) NOT NULL,
  "product_id" varchar(36) NOT NULL,
  "admin_id" varchar(36) NOT NULL,
  "price_change_date_to" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "price_change_date_from" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "price" int NOT NULL DEFAULT 0,
  "active" int NOT NULL DEFAULT 0,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "dot_khuyen_mai" (
  "id" varchar(36) PRIMARY KEY,
  "admin_id" varchar(36) NOT NULL,
  "start_At" date NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())), 
  "end_At" date NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "status" int NOT NULL DEFAULT 0,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "chi_tiet_dot_khuyen_mai" (
  "id" varchar(36) NOT NULL,
  "dotkhuyenmai_id" varchar(36) NOT NULL,
  "product_id" varchar(36) NOT NULL,
  "value" int NOT NULL DEFAULT 0,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

-- CREATE TABLE "tra_hang" (
--   "id" varchar(36) NOT NULL,
--   "order_id" varchar(36) NOT NULL,
--   "admin_id" varchar(36) NOT NULL,
--   "shipper_id" varchar(36) NOT NULL,
--   "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
--   "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
-- );

-- CREATE TABLE "chi_tiet_tra_hang" (
--   "trahang_id" varchar(36) NOT NULL,
--   "product_id" varchar(36) NOT NULL,
--   "qty" int NOT NULL DEFAULT 1,
--   "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
--   "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
-- );

ALTER TABLE "category_detail" ADD FOREIGN KEY ("brand_id") REFERENCES "brand" ("id");
ALTER TABLE "category_detail" ADD FOREIGN KEY ("cate_id") REFERENCES "category" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("cate_id") REFERENCES "category" ("id");
ALTER TABLE "products" ADD FOREIGN KEY ("brand_id") REFERENCES "brand" ("id");

ALTER TABLE "ribbon_detail" ADD FOREIGN KEY ("ribbon_id") REFERENCES "ribbon" ("id");
ALTER TABLE "ribbon_detail" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "address" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "rate" ADD FOREIGN KEY ("order_id") REFERENCES "order" ("id");
ALTER TABLE "rate" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

-- ALTER TABLE "cart" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "cart_detail" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "cart_detail" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "order" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "order" ADD FOREIGN KEY ("admin_id") REFERENCES "admin" ("id");
ALTER TABLE "order" ADD FOREIGN KEY ("shipper_id") REFERENCES "shipper" ("id");

ALTER TABLE "order_detail" ADD FOREIGN KEY ("order_id") REFERENCES "order" ("id");
ALTER TABLE "order_detail" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "transaction" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "transaction" ADD FOREIGN KEY ("order_id") REFERENCES "order" ("id");

ALTER TABLE "voucher" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "voucher" ADD FOREIGN KEY ("promo_id") REFERENCES "promoes" ("id");

ALTER TABLE "nhap_hang" ADD FOREIGN KEY ("admin_id") REFERENCES "admin" ("id");

ALTER TABLE "chi_tiet_nhap_hang" ADD FOREIGN KEY ("nhaphang_id") REFERENCES "nhap_hang" ("id");
ALTER TABLE "chi_tiet_nhap_hang" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "thay_doi_gia" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");
ALTER TABLE "thay_doi_gia" ADD FOREIGN KEY ("admin_id") REFERENCES "admin" ("id");

ALTER TABLE "dot_khuyen_mai" ADD FOREIGN KEY ("admin_id") REFERENCES "admin" ("id");

ALTER TABLE "chi_tiet_dot_khuyen_mai" ADD FOREIGN KEY ("dotkhuyenmai_id") REFERENCES "dot_khuyen_mai" ("id");
ALTER TABLE "chi_tiet_dot_khuyen_mai" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

-- fix table tra_hang
CREATE TABLE "tra_hang" (
  "id" varchar(36) NOT NULL,
  "order_id" varchar(36) NOT NULL,
  "admin_id" varchar(36),
  "shipper_id" varchar(36) NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "chi_tiet_tra_hang" (
  "trahang_id" varchar(36) NOT NULL,
  "product_id" varchar(36) NOT NULL,
  "qty" int NOT NULL DEFAULT 1,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

ALTER TABLE "tra_hang" ADD FOREIGN KEY ("order_id") REFERENCES "order" ("id");
ALTER TABLE "tra_hang" ADD FOREIGN KEY ("admin_id") REFERENCES "admin" ("id");

ALTER TABLE "chi_tiet_tra_hang" ADD FOREIGN KEY ("trahang_id") REFERENCES "tra_hang" ("id");
ALTER TABLE "chi_tiet_tra_hang" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");