CREATE TABLE "category" (
  "id" varchar(36) PRIMARY KEY,
  "name" varchar NOT NULL,
  "parent_id" varchar(36) NOT NULL DEFAULT 0,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "products" (
  "id" varchar(36) PRIMARY KEY,
  "name" varchar NOT NULL,
"name_without_unicode" varchar NOT NULL,
  "price" bigint NOT NULL,
  "discount" bigint NOT NULL,
  "content" text,
  "image_link" varchar,
  "image_list" varchar,
  "view" int NOT NULL,
  "sold" int NOT NULL,
	"qty" int NOT NULL,
	"status" int NOT NULL,
  "warehouse_id" varchar(36),
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "cate_product" (
  "id" varchar(36) PRIMARY KEY,
  "catelog_id" varchar(36),
  "product_id" varchar(36),
	"createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "warehouse" (
  "id" varchar(36) PRIMARY KEY,
  "status" int NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "users" (
  "id" varchar(36) PRIMARY KEY,
  "name" varchar NOT NULL,
"avatar" varchar NOT NULL,
  "age" int NOT NULL,
  "email" varchar NOT NULL,
  "address" varchar NOT NULL,
  "password" varchar NOT NULL,
  "phone" varchar NOT NULL,
  "new" int NOT NULL,
  "status" int NOT NULL,
	"token" varchar NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "promoes" (
  "id" varchar(36) PRIMARY KEY,
  "title" varchar NOT NULL,
  "code" varchar(10) NOT NULL,
  "status" int NOT NULL,
  "type" int NOT NULL,
  "value_type" varchar NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "voucher" (
  "id" varchar(36) PRIMARY KEY,
  "user_id" varchar(36),
  "promoes_id" varchar(36),
  "is_active" int NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "card" (
  "id" varchar(36) PRIMARY KEY,
  "user_id" varchar(36),
  "order_id" varchar(36),
  "total_price" bigint NOT NULL,
  "status" int DEFAULT 0,
  "note" text,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "card_detail" (
  "id" varchar(36) PRIMARY KEY,
  "card_id" varchar(36),
  "product_id" varchar(36),
  "qty" int NOT NULL,
  "rate" int NOT NULL DEFAULT 0,
 "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "order" (
  "id" varchar(36) PRIMARY KEY,
  "user_id" varchar(36),
  "discount" bigint,
  "total" bigint NOT NULL,
  "order_date" date NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "admin_id" varchar(36),
  "card_id" varchar(36),
  "transaction_id" varchar(36),
  "status" int NOT NULL,
	"products" varchar ,
	"user_checkout" varchar,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "rate" (
  "id" varchar(36) PRIMARY KEY,
  "user_id" varchar(36),
  "product_id" varchar(36),
  "point" int NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "comment" (
  "id" varchar(36) PRIMARY KEY,
  "parent_cmt_id" varchar(36),
  "user_id" varchar(36),
  "product_id" varchar(36),
  "content" varchar NOT NULL,
 "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "transaction" (
  "id" varchar(36) PRIMARY KEY,
  "order_id" varchar(36),
  "status" int NOT NULL,
  "amount" bigint NOT NULL,
  "user_id" varchar(36),
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "history" (
	"id" varchar(36) PRIMARY KEY,
  "user_id" varchar(36),
  "product_id" varchar(36),
 "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "ribbon" (
  "id" varchar(36) PRIMARY KEY,
  "name" text NOT NULL,
  "active" int NOT NULL DEFAULT 0,
  "priority" int NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "ribbon_product" (
	"id" varchar(36) PRIMARY KEY,
  "ribbon_id" varchar(36),
  "product_id" varchar(36),
  "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);

CREATE TABLE "log" (
  "id" varchar(36) PRIMARY KEY,
  "refId" varchar(36),
  "params" varchar,
  "action" varchar,
 "createdAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now())),
  "updatedAt" timestamptz NOT NULL DEFAULT (timezone('Asia/Ho_Chi_Minh'::text, now()))
);



COMMENT ON COLUMN "voucher"."is_active" IS '0: active, 1: unactive';

COMMENT ON COLUMN "log"."refId" IS 'can userId or orderId, any params can specify action';

ALTER TABLE "products" ADD FOREIGN KEY ("warehouse_id") REFERENCES "warehouse" ("id");

ALTER TABLE "cate_product" ADD FOREIGN KEY ("catelog_id") REFERENCES "category" ("id");

ALTER TABLE "cate_product" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "voucher" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "voucher" ADD FOREIGN KEY ("promoes_id") REFERENCES "promoes" ("id");

ALTER TABLE "card" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "card" ADD FOREIGN KEY ("order_id") REFERENCES "order" ("id");

ALTER TABLE "card_detail" ADD FOREIGN KEY ("card_id") REFERENCES "card" ("id");

ALTER TABLE "card_detail" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "order" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "order" ADD FOREIGN KEY ("admin_id") REFERENCES "users" ("id");

ALTER TABLE "order" ADD FOREIGN KEY ("card_id") REFERENCES "card" ("id");

ALTER TABLE "order" ADD FOREIGN KEY ("transaction_id") REFERENCES "transaction" ("id");

ALTER TABLE "rate" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "rate" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "comment" ADD FOREIGN KEY ("parent_cmt_id") REFERENCES "comment" ("id");

ALTER TABLE "comment" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "comment" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "transaction" ADD FOREIGN KEY ("order_id") REFERENCES "order" ("id");

ALTER TABLE "transaction" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "history" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "history" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "ribbon_product" ADD FOREIGN KEY ("ribbon_id") REFERENCES "users" ("id");

ALTER TABLE "ribbon_product" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");
