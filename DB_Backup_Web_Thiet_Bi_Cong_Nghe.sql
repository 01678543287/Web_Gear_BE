PGDMP     2        
    	        z            dc9b19mjjcl1f4     14.5 (Ubuntu 14.5-1.pgdg20.04+1)    14.4 d    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    30518185    dc9b19mjjcl1f4    DATABASE     c   CREATE DATABASE dc9b19mjjcl1f4 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.UTF-8';
    DROP DATABASE dc9b19mjjcl1f4;
                fzspnkptxqzeyo    false            �           0    0    DATABASE dc9b19mjjcl1f4    ACL     A   REVOKE CONNECT,TEMPORARY ON DATABASE dc9b19mjjcl1f4 FROM PUBLIC;
                   fzspnkptxqzeyo    false    4514            �           0    0    dc9b19mjjcl1f4    DATABASE PROPERTIES     R   ALTER DATABASE dc9b19mjjcl1f4 SET search_path TO '$user', 'public', 'heroku_ext';
                     fzspnkptxqzeyo    false                        2615    30518186 
   heroku_ext    SCHEMA        CREATE SCHEMA heroku_ext;
    DROP SCHEMA heroku_ext;
                uc6a37d910t6te    false            �           0    0    SCHEMA heroku_ext    ACL     4   GRANT USAGE ON SCHEMA heroku_ext TO fzspnkptxqzeyo;
                   uc6a37d910t6te    false    6            �           0    0    LANGUAGE plpgsql    ACL     1   GRANT ALL ON LANGUAGE plpgsql TO fzspnkptxqzeyo;
                   postgres    false    902            �            1259    30535588    admins    TABLE     �  CREATE TABLE public.admins (
    id character varying(36) NOT NULL,
    name character varying NOT NULL,
    gender integer NOT NULL,
    birthday timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    avatar character varying,
    email character varying NOT NULL,
    address character varying NOT NULL,
    password character varying NOT NULL,
    phone character varying NOT NULL,
    status integer DEFAULT 0 NOT NULL,
    home_town character varying,
    cccd character varying,
    token character varying NOT NULL,
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL
);
    DROP TABLE public.admins;
       public         heap    fzspnkptxqzeyo    false            �            1259    30534888    card    TABLE     �  CREATE TABLE public.card (
    id character varying(36) NOT NULL,
    user_id character varying(36) NOT NULL,
    order_id character varying(36),
    total_price bigint,
    status integer DEFAULT 0 NOT NULL,
    note text,
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL
);
    DROP TABLE public.card;
       public         heap    fzspnkptxqzeyo    false            �            1259    30534899    card_detail    TABLE     �  CREATE TABLE public.card_detail (
    id character varying(36) NOT NULL,
    card_id character varying(36),
    product_id character varying(36),
    qty integer NOT NULL,
    rate integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL
);
    DROP TABLE public.card_detail;
       public         heap    fzspnkptxqzeyo    false            �            1259    30534848    cate_product    TABLE     b  CREATE TABLE public.cate_product (
    id character varying(36) NOT NULL,
    catelog_id character varying(36),
    product_id character varying(36),
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL
);
     DROP TABLE public.cate_product;
       public         heap    fzspnkptxqzeyo    false            �            1259    30534829    category    TABLE     o  CREATE TABLE public.category (
    id character varying(36) NOT NULL,
    name character varying NOT NULL,
    parent_id character varying(36) DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL
);
    DROP TABLE public.category;
       public         heap    fzspnkptxqzeyo    false            �            1259    30535994    chi_tiet_nhap_hang    TABLE     �  CREATE TABLE public.chi_tiet_nhap_hang (
    id character varying(36) NOT NULL,
    nhaphang_id character varying(36) NOT NULL,
    product_id character varying(36) NOT NULL,
    qty integer NOT NULL,
    amount bigint NOT NULL,
    "createdAt" timestamp without time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()),
    "updatedAt" timestamp without time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now())
);
 &   DROP TABLE public.chi_tiet_nhap_hang;
       public         heap    fzspnkptxqzeyo    false            �            1259    30534924    comment    TABLE     �  CREATE TABLE public.comment (
    id character varying(36) NOT NULL,
    parent_cmt_id character varying(36),
    user_id character varying(36),
    product_id character varying(36),
    content character varying NOT NULL,
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL
);
    DROP TABLE public.comment;
       public         heap    fzspnkptxqzeyo    false            �            1259    30534940    history    TABLE     Z  CREATE TABLE public.history (
    id character varying(36) NOT NULL,
    user_id character varying(36),
    product_id character varying(36),
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL
);
    DROP TABLE public.history;
       public         heap    fzspnkptxqzeyo    false            �            1259    30534964    log    TABLE     l  CREATE TABLE public.log (
    id character varying(36) NOT NULL,
    "refId" character varying(36),
    params character varying,
    action character varying,
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL
);
    DROP TABLE public.log;
       public         heap    fzspnkptxqzeyo    false            �           0    0    COLUMN log."refId"    COMMENT     `   COMMENT ON COLUMN public.log."refId" IS 'can userId or orderId, any params can specify action';
          public          fzspnkptxqzeyo    false    226            �            1259    30535738 	   nhap_hang    TABLE     k  CREATE TABLE public.nhap_hang (
    id character varying(36) NOT NULL,
    admin_id character varying(36) NOT NULL,
    total bigint NOT NULL,
    note character varying,
    "createdAt" timestamp without time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()),
    "updatedAt" timestamp without time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now())
);
    DROP TABLE public.nhap_hang;
       public         heap    fzspnkptxqzeyo    false            �            1259    30534907    order    TABLE     �  CREATE TABLE public."order" (
    id character varying(36) NOT NULL,
    user_id character varying(36),
    discount bigint,
    total bigint NOT NULL,
    order_date timestamp without time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    admin_id character varying(36),
    card_id character varying(36),
    transaction_id character varying(36),
    status integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    products json,
    user_checkout json
);
    DROP TABLE public."order";
       public         heap    fzspnkptxqzeyo    false            �            1259    30534839    products    TABLE     �  CREATE TABLE public.products (
    id character varying(36) NOT NULL,
    name character varying NOT NULL,
    name_without_unicode character varying NOT NULL,
    price bigint NOT NULL,
    discount bigint NOT NULL,
    content text,
    image_link character varying,
    image_list character varying,
    view integer NOT NULL,
    sold integer NOT NULL,
    qty integer NOT NULL,
    status integer NOT NULL,
    warehouse_id character varying(36),
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL
);
    DROP TABLE public.products;
       public         heap    fzspnkptxqzeyo    false            �            1259    30534871    promoes    TABLE     �  CREATE TABLE public.promoes (
    id character varying(36) NOT NULL,
    title character varying NOT NULL,
    code character varying(10) NOT NULL,
    status integer NOT NULL,
    type integer NOT NULL,
    value_type character varying NOT NULL,
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL
);
    DROP TABLE public.promoes;
       public         heap    fzspnkptxqzeyo    false            �            1259    30534917    rate    TABLE     s  CREATE TABLE public.rate (
    id character varying(36) NOT NULL,
    user_id character varying(36),
    product_id character varying(36),
    point integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL
);
    DROP TABLE public.rate;
       public         heap    fzspnkptxqzeyo    false            �            1259    30534947    ribbon    TABLE     n  CREATE TABLE public.ribbon (
    id character varying(36) NOT NULL,
    name text NOT NULL,
    active integer DEFAULT 0 NOT NULL,
    priority integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL
);
    DROP TABLE public.ribbon;
       public         heap    fzspnkptxqzeyo    false            �            1259    30534957    ribbon_product    TABLE     c  CREATE TABLE public.ribbon_product (
    id character varying(36) NOT NULL,
    ribbon_id character varying(36),
    product_id character varying(36),
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL
);
 "   DROP TABLE public.ribbon_product;
       public         heap    fzspnkptxqzeyo    false            �            1259    30534933    transaction    TABLE     �  CREATE TABLE public.transaction (
    id character varying(36) NOT NULL,
    order_id character varying(36),
    status integer NOT NULL,
    amount bigint NOT NULL,
    user_id character varying(36),
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL
);
    DROP TABLE public.transaction;
       public         heap    fzspnkptxqzeyo    false            �            1259    30534862    users    TABLE     �  CREATE TABLE public.users (
    id character varying(36) NOT NULL,
    name character varying NOT NULL,
    avatar character varying,
    age integer NOT NULL,
    email character varying NOT NULL,
    address character varying NOT NULL,
    password character varying NOT NULL,
    phone character varying NOT NULL,
    new integer DEFAULT 0 NOT NULL,
    status integer DEFAULT 0 NOT NULL,
    token character varying DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    gender integer DEFAULT 0
);
    DROP TABLE public.users;
       public         heap    fzspnkptxqzeyo    false            �            1259    30534880    voucher    TABLE     �  CREATE TABLE public.voucher (
    id character varying(36) NOT NULL,
    user_id character varying(36),
    promoes_id character varying(36),
    is_active integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL
);
    DROP TABLE public.voucher;
       public         heap    fzspnkptxqzeyo    false            �           0    0    COLUMN voucher.is_active    COMMENT     H   COMMENT ON COLUMN public.voucher.is_active IS '0: active, 1: unactive';
          public          fzspnkptxqzeyo    false    216            �            1259    30534855 	   warehouse    TABLE     0  CREATE TABLE public.warehouse (
    id character varying(36) NOT NULL,
    status integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL
);
    DROP TABLE public.warehouse;
       public         heap    fzspnkptxqzeyo    false            �          0    30535588    admins 
   TABLE DATA           �   COPY public.admins (id, name, gender, birthday, avatar, email, address, password, phone, status, home_town, cccd, token, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    227   �       �          0    30534888    card 
   TABLE DATA           j   COPY public.card (id, user_id, order_id, total_price, status, note, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    217   ��       �          0    30534899    card_detail 
   TABLE DATA           c   COPY public.card_detail (id, card_id, product_id, qty, rate, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    218   ��       �          0    30534848    cate_product 
   TABLE DATA           \   COPY public.cate_product (id, catelog_id, product_id, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    212   ^�       �          0    30534829    category 
   TABLE DATA           Q   COPY public.category (id, name, parent_id, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    210   !�       �          0    30535994    chi_tiet_nhap_hang 
   TABLE DATA           p   COPY public.chi_tiet_nhap_hang (id, nhaphang_id, product_id, qty, amount, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    229   �       �          0    30534924    comment 
   TABLE DATA           l   COPY public.comment (id, parent_cmt_id, user_id, product_id, content, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    221   ��       �          0    30534940    history 
   TABLE DATA           T   COPY public.history (id, user_id, product_id, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    223   ��       �          0    30534964    log 
   TABLE DATA           T   COPY public.log (id, "refId", params, action, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    226   ��       �          0    30535738 	   nhap_hang 
   TABLE DATA           X   COPY public.nhap_hang (id, admin_id, total, note, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    228   י       �          0    30534907    order 
   TABLE DATA           �   COPY public."order" (id, user_id, discount, total, order_date, admin_id, card_id, transaction_id, status, "createdAt", "updatedAt", products, user_checkout) FROM stdin;
    public          fzspnkptxqzeyo    false    219   ��       �          0    30534839    products 
   TABLE DATA           �   COPY public.products (id, name, name_without_unicode, price, discount, content, image_link, image_list, view, sold, qty, status, warehouse_id, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    211   ��       �          0    30534871    promoes 
   TABLE DATA           f   COPY public.promoes (id, title, code, status, type, value_type, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    215    �       �          0    30534917    rate 
   TABLE DATA           X   COPY public.rate (id, user_id, product_id, point, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    220   ��       �          0    30534947    ribbon 
   TABLE DATA           V   COPY public.ribbon (id, name, active, priority, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    224   h�       �          0    30534957    ribbon_product 
   TABLE DATA           ]   COPY public.ribbon_product (id, ribbon_id, product_id, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    225   ��       �          0    30534933    transaction 
   TABLE DATA           f   COPY public.transaction (id, order_id, status, amount, user_id, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    222   ��       �          0    30534862    users 
   TABLE DATA           �   COPY public.users (id, name, avatar, age, email, address, password, phone, new, status, token, "createdAt", "updatedAt", gender) FROM stdin;
    public          fzspnkptxqzeyo    false    214   n�       �          0    30534880    voucher 
   TABLE DATA           _   COPY public.voucher (id, user_id, promoes_id, is_active, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    216   ��       �          0    30534855 	   warehouse 
   TABLE DATA           I   COPY public.warehouse (id, status, "createdAt", "updatedAt") FROM stdin;
    public          fzspnkptxqzeyo    false    213   f�       �           2606    30535597    admins admins_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_pkey;
       public            fzspnkptxqzeyo    false    227            �           2606    30534906    card_detail card_detail_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.card_detail
    ADD CONSTRAINT card_detail_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.card_detail DROP CONSTRAINT card_detail_pkey;
       public            fzspnkptxqzeyo    false    218            �           2606    30534898    card card_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.card
    ADD CONSTRAINT card_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.card DROP CONSTRAINT card_pkey;
       public            fzspnkptxqzeyo    false    217            �           2606    30534854    cate_product cate_product_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.cate_product
    ADD CONSTRAINT cate_product_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.cate_product DROP CONSTRAINT cate_product_pkey;
       public            fzspnkptxqzeyo    false    212            �           2606    30534838    category category_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.category DROP CONSTRAINT category_pkey;
       public            fzspnkptxqzeyo    false    210            �           2606    30536000 *   chi_tiet_nhap_hang chi_tiet_nhap_hang_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.chi_tiet_nhap_hang
    ADD CONSTRAINT chi_tiet_nhap_hang_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.chi_tiet_nhap_hang DROP CONSTRAINT chi_tiet_nhap_hang_pkey;
       public            fzspnkptxqzeyo    false    229            �           2606    30534932    comment comment_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.comment DROP CONSTRAINT comment_pkey;
       public            fzspnkptxqzeyo    false    221            �           2606    30534946    history history_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.history
    ADD CONSTRAINT history_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.history DROP CONSTRAINT history_pkey;
       public            fzspnkptxqzeyo    false    223            �           2606    30534972    log log_pkey 
   CONSTRAINT     J   ALTER TABLE ONLY public.log
    ADD CONSTRAINT log_pkey PRIMARY KEY (id);
 6   ALTER TABLE ONLY public.log DROP CONSTRAINT log_pkey;
       public            fzspnkptxqzeyo    false    226            �           2606    30535744    nhap_hang nhap_hang_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.nhap_hang
    ADD CONSTRAINT nhap_hang_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.nhap_hang DROP CONSTRAINT nhap_hang_pkey;
       public            fzspnkptxqzeyo    false    228            �           2606    30534916    order order_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."order" DROP CONSTRAINT order_pkey;
       public            fzspnkptxqzeyo    false    219            �           2606    30534847    products products_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            fzspnkptxqzeyo    false    211            �           2606    30534879    promoes promoes_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.promoes
    ADD CONSTRAINT promoes_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.promoes DROP CONSTRAINT promoes_pkey;
       public            fzspnkptxqzeyo    false    215            �           2606    30534923    rate rate_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.rate
    ADD CONSTRAINT rate_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.rate DROP CONSTRAINT rate_pkey;
       public            fzspnkptxqzeyo    false    220            �           2606    30534956    ribbon ribbon_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.ribbon
    ADD CONSTRAINT ribbon_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.ribbon DROP CONSTRAINT ribbon_pkey;
       public            fzspnkptxqzeyo    false    224            �           2606    30534963 "   ribbon_product ribbon_product_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.ribbon_product
    ADD CONSTRAINT ribbon_product_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.ribbon_product DROP CONSTRAINT ribbon_product_pkey;
       public            fzspnkptxqzeyo    false    225            �           2606    30534939    transaction transaction_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.transaction DROP CONSTRAINT transaction_pkey;
       public            fzspnkptxqzeyo    false    222            �           2606    30541919    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            fzspnkptxqzeyo    false    214            �           2606    30541921    users users_phone_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_phone_key;
       public            fzspnkptxqzeyo    false    214            �           2606    30534870    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            fzspnkptxqzeyo    false    214            �           2606    30534886    voucher voucher_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.voucher
    ADD CONSTRAINT voucher_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.voucher DROP CONSTRAINT voucher_pkey;
       public            fzspnkptxqzeyo    false    216            �           2606    30534861    warehouse warehouse_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.warehouse
    ADD CONSTRAINT warehouse_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.warehouse DROP CONSTRAINT warehouse_pkey;
       public            fzspnkptxqzeyo    false    213            �           2606    30535745    nhap_hang admin_fkey    FK CONSTRAINT     u   ALTER TABLE ONLY public.nhap_hang
    ADD CONSTRAINT admin_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(id);
 >   ALTER TABLE ONLY public.nhap_hang DROP CONSTRAINT admin_fkey;
       public          fzspnkptxqzeyo    false    227    228    4318            �           2606    30535008 $   card_detail card_detail_card_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.card_detail
    ADD CONSTRAINT card_detail_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.card(id);
 N   ALTER TABLE ONLY public.card_detail DROP CONSTRAINT card_detail_card_id_fkey;
       public          fzspnkptxqzeyo    false    217    218    4298            �           2606    30535013 '   card_detail card_detail_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.card_detail
    ADD CONSTRAINT card_detail_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);
 Q   ALTER TABLE ONLY public.card_detail DROP CONSTRAINT card_detail_product_id_fkey;
       public          fzspnkptxqzeyo    false    211    218    4282            �           2606    30535003    card card_order_id_fkey    FK CONSTRAINT     y   ALTER TABLE ONLY public.card
    ADD CONSTRAINT card_order_id_fkey FOREIGN KEY (order_id) REFERENCES public."order"(id);
 A   ALTER TABLE ONLY public.card DROP CONSTRAINT card_order_id_fkey;
       public          fzspnkptxqzeyo    false    219    4302    217            �           2606    30534998    card card_user_id_fkey    FK CONSTRAINT     u   ALTER TABLE ONLY public.card
    ADD CONSTRAINT card_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 @   ALTER TABLE ONLY public.card DROP CONSTRAINT card_user_id_fkey;
       public          fzspnkptxqzeyo    false    214    4292    217            �           2606    30534978 )   cate_product cate_product_catelog_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.cate_product
    ADD CONSTRAINT cate_product_catelog_id_fkey FOREIGN KEY (catelog_id) REFERENCES public.category(id);
 S   ALTER TABLE ONLY public.cate_product DROP CONSTRAINT cate_product_catelog_id_fkey;
       public          fzspnkptxqzeyo    false    210    4280    212            �           2606    30534983 )   cate_product cate_product_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.cate_product
    ADD CONSTRAINT cate_product_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);
 S   ALTER TABLE ONLY public.cate_product DROP CONSTRAINT cate_product_product_id_fkey;
       public          fzspnkptxqzeyo    false    4282    211    212            �           2606    30535048 "   comment comment_parent_cmt_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_parent_cmt_id_fkey FOREIGN KEY (parent_cmt_id) REFERENCES public.comment(id);
 L   ALTER TABLE ONLY public.comment DROP CONSTRAINT comment_parent_cmt_id_fkey;
       public          fzspnkptxqzeyo    false    221    4306    221            �           2606    30535058    comment comment_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);
 I   ALTER TABLE ONLY public.comment DROP CONSTRAINT comment_product_id_fkey;
       public          fzspnkptxqzeyo    false    4282    211    221            �           2606    30535053    comment comment_user_id_fkey    FK CONSTRAINT     {   ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 F   ALTER TABLE ONLY public.comment DROP CONSTRAINT comment_user_id_fkey;
       public          fzspnkptxqzeyo    false    221    4292    214            �           2606    30535078    history history_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.history
    ADD CONSTRAINT history_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);
 I   ALTER TABLE ONLY public.history DROP CONSTRAINT history_product_id_fkey;
       public          fzspnkptxqzeyo    false    4282    223    211            �           2606    30535073    history history_user_id_fkey    FK CONSTRAINT     {   ALTER TABLE ONLY public.history
    ADD CONSTRAINT history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 F   ALTER TABLE ONLY public.history DROP CONSTRAINT history_user_id_fkey;
       public          fzspnkptxqzeyo    false    223    214    4292            �           2606    30536001    chi_tiet_nhap_hang nh_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.chi_tiet_nhap_hang
    ADD CONSTRAINT nh_fkey FOREIGN KEY (nhaphang_id) REFERENCES public.nhap_hang(id);
 D   ALTER TABLE ONLY public.chi_tiet_nhap_hang DROP CONSTRAINT nh_fkey;
       public          fzspnkptxqzeyo    false    4320    228    229            �           2606    30545199    order order_admin_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(id) NOT VALID;
 E   ALTER TABLE ONLY public."order" DROP CONSTRAINT order_admin_id_fkey;
       public          fzspnkptxqzeyo    false    219    227    4318            �           2606    30535028    order order_card_id_fkey    FK CONSTRAINT     x   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.card(id);
 D   ALTER TABLE ONLY public."order" DROP CONSTRAINT order_card_id_fkey;
       public          fzspnkptxqzeyo    false    217    4298    219            �           2606    30535033    order order_transaction_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transaction(id);
 K   ALTER TABLE ONLY public."order" DROP CONSTRAINT order_transaction_id_fkey;
       public          fzspnkptxqzeyo    false    222    4308    219            �           2606    30535018    order order_user_id_fkey    FK CONSTRAINT     y   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 D   ALTER TABLE ONLY public."order" DROP CONSTRAINT order_user_id_fkey;
       public          fzspnkptxqzeyo    false    4292    219    214            �           2606    30536006    chi_tiet_nhap_hang pr_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.chi_tiet_nhap_hang
    ADD CONSTRAINT pr_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);
 D   ALTER TABLE ONLY public.chi_tiet_nhap_hang DROP CONSTRAINT pr_fkey;
       public          fzspnkptxqzeyo    false    4282    211    229            �           2606    30534973 #   products products_warehouse_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouse(id);
 M   ALTER TABLE ONLY public.products DROP CONSTRAINT products_warehouse_id_fkey;
       public          fzspnkptxqzeyo    false    211    213    4286            �           2606    30535043    rate rate_product_id_fkey    FK CONSTRAINT     ~   ALTER TABLE ONLY public.rate
    ADD CONSTRAINT rate_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);
 C   ALTER TABLE ONLY public.rate DROP CONSTRAINT rate_product_id_fkey;
       public          fzspnkptxqzeyo    false    211    220    4282            �           2606    30535038    rate rate_user_id_fkey    FK CONSTRAINT     u   ALTER TABLE ONLY public.rate
    ADD CONSTRAINT rate_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 @   ALTER TABLE ONLY public.rate DROP CONSTRAINT rate_user_id_fkey;
       public          fzspnkptxqzeyo    false    214    4292    220            �           2606    30535088 -   ribbon_product ribbon_product_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ribbon_product
    ADD CONSTRAINT ribbon_product_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);
 W   ALTER TABLE ONLY public.ribbon_product DROP CONSTRAINT ribbon_product_product_id_fkey;
       public          fzspnkptxqzeyo    false    211    4282    225            �           2606    30535083 ,   ribbon_product ribbon_product_ribbon_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ribbon_product
    ADD CONSTRAINT ribbon_product_ribbon_id_fkey FOREIGN KEY (ribbon_id) REFERENCES public.users(id);
 V   ALTER TABLE ONLY public.ribbon_product DROP CONSTRAINT ribbon_product_ribbon_id_fkey;
       public          fzspnkptxqzeyo    false    214    4292    225            �           2606    30535063 %   transaction transaction_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_order_id_fkey FOREIGN KEY (order_id) REFERENCES public."order"(id);
 O   ALTER TABLE ONLY public.transaction DROP CONSTRAINT transaction_order_id_fkey;
       public          fzspnkptxqzeyo    false    219    4302    222            �           2606    30535068 $   transaction transaction_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 N   ALTER TABLE ONLY public.transaction DROP CONSTRAINT transaction_user_id_fkey;
       public          fzspnkptxqzeyo    false    214    222    4292            �           2606    30534993    voucher voucher_promoes_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.voucher
    ADD CONSTRAINT voucher_promoes_id_fkey FOREIGN KEY (promoes_id) REFERENCES public.promoes(id);
 I   ALTER TABLE ONLY public.voucher DROP CONSTRAINT voucher_promoes_id_fkey;
       public          fzspnkptxqzeyo    false    216    215    4294            �           2606    30534988    voucher voucher_user_id_fkey    FK CONSTRAINT     {   ALTER TABLE ONLY public.voucher
    ADD CONSTRAINT voucher_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 F   ALTER TABLE ONLY public.voucher DROP CONSTRAINT voucher_user_id_fkey;
       public          fzspnkptxqzeyo    false    4292    214    216            �   v  x�}QMo1={n��gl��{�'��.�$�����l �(~}��UZ��4���F3��;�QfPa�P͙�,Ɯ1�Q���fK��A�\���Tg�����A嫩VW�  m4m`mu�������^NX��^�l���}!�Fw��r�[L��g�\T��'�s)$�D��ʹ�5O�� ё�I������)$�;Z@XF��u���A^(�C�t+[�R�R����ᒟ����.�j���_̋+��l7�E�[z�p�?����p�J��8��Q�H�1��R@�h��=<�����Y��˓�:���.�N��(S��f��wk�0[Vbz��2��q��`<	�tt�1���/6�މ��'E��m      �   �   x���M�!�u{��)���s��Ĕ��c/���� �6�/Z�i�X���͘��
�65��Ic--Q@��7�S3���j~��<�#3���B섽�A��7��i�|���:���X�p�5����*H:�V�| =�i��K��@L�\@|��©f�����LU�A/iڅ,΀1	��	>d�M�yF��MWA�3�E�} =����Ai�R�A~B�_j������+�zi���Ug̯��4ݏ��/����      �   �  x���A�!D�ݧ�>r�6���,� ��!d������]��G��I�&X.d�BoF�%[�Wb�#�̰� ���1��P�k�6Y��=at�H)�S�`*x02�>�o�[�"g���Q�0�ő�����	��F�'I��n��P��lA�����U\���n��M���U=5ȫZ��w0B�A4!MBT�(�A}p�#��;�,M�`4�5�f	�1�ܼ�\�h_�s��sȂ��?��{w ]Qwv6�|��*�-q�]�G���ӳŘnPX�&��e�	T#CLK�zm��p����}����9F��>̶��v3]Q�|�}��ڐq�݀I;j-�.��s�s�]��U$j����m���֠���Mqq�*� �����F'���D"�7�Ծ)����~T���ނ���ӟ���<�**      �   �   x����m1�U�\�+�[���$�_���x�3�!ME�4� B*�&�žȑphª2�i|C�U"LW�5�傚����T����	�\�̀�/���Q�����ߴ��L;Ze�#PǞ ��]��S���D�@{/Hރ��p��/���q������y�־ �}M�      �   �   x�}�1N1@�:9���#�vbgʥG�43I�lf;.�	(�$܄v�FԿx��0���=��<�z%pT���L)���o��~�z� +�M��"6c%�w���V���2acq '3n�RxZ����>���3%K���I�z��� �l`*
��.���p��|_�o�:a].ȳV-�����9��4�I�      �   �  x���A�[1E�ﭢ �1d-�l���:U�~�",]K]��6a�H�	޷�pe	��(���tb�\2G��p c��c����&7�&D �A���9t�uҋ��s12�9?��?	�lg���Mڥ-���ϖ%z��[��`l�w�T�:���t^ �c�ň�^���D�R�7ɍ�(V.Pߧ�����ƌ �r+�p���A�D�@�d�.�����H�(����n/����Wg!1��Q:��⇴~�v��(�1���e�"%S���7����������摁�;ׂ��h���/�b�"����yD��HD�8���Y��Om��}�����ql��;a!X�ĝs�ޟ�~�.�8�񺓽���Um��      �      x������ � �      �      x������ � �      �      x������ � �      �   �   x����m�0�vi�"M��."%�_B����m	p�5/� �����e ���3|��t���J�w�h<q����6Ff���x5��73���g�֒u�hz� U�Ygz�|���{�ƒ� ��@V*4->iy�g,߼���m�tI��yY#.㴇��&t!_j��Q���u���	�sy�      �   �  x��W�oE?;�h�x����(�S|U4��ٙqv{��봡�q���ā��C�*
���\��?���&I�C�����̾�{�7����4�>R`E����.�.P%��\�.ij]���J'�HQl�fا���;��m��Q$��aDH����ʨi�����
��eN,&�y�Lp��J�e�HDH�̈́�&U�;�Sgi��{-���^:�E|��ͤ�I'���ɀEP���ij�Jr�ɤ�8;���Uȁ�`X����>��@�֘
>JuqFS��2,S�iI�|R�&�N��IG��tdW�)m��W�wJ4ȧ��P��G�_4�|�^�C]Uu�>̋:4ct��Å��E�W��ڸ,\�0��sA�����5���b�q	%q課�h��������CY1;���1�Jԛ�A����ê�Be>���:?|x�_�b6�5F�Q��p�|v�C�z&X��&�-M�'�Ì��^w��f��P��<�6\@��>�?�����w��_ޓ[ue���j��u������e���"BDj;��8�ի�S+	3��� �uxj�n�8�@��5*̣��*���k��G���~?f�3����՚|U.V��m��w|Ua"���w�a���
�zE�{���`����Ѻ�Uc_�v�������n����xЫ��ءJQ*)�j���/���敋�.͍FR���Ta0cJ*C��+�!9Q���K��MX�#J0���)(�7%�P`��^͓����=�'���h��d��c`�S��IG��lh�!	0Q�z<j���a�b�����x��^�����Xi纂��H��>n�\������򱃀�{��ML�F�BMo�E(c��U�	O���(b�o�Ln���З��L��doMz�aNӠ��D��	C6tSV��p}Z���SJ	[�u�.O���N&#c��5H�����q��q��u��0����Zli��L �%T�h��{��A����h/Zǋ��u����^��Z�,2�DN�� �5"ͺ�J���s��	2��XX$そ�E�c�/���q4^�Y}��~�����߀�7��=X7��[+H���p�KĤ�'{{^������u��A����龃��F���1���^�[����%�t�=g���Z�O�6�ǻ��X,<��KM�f�/A(*Ё	m�~�[����1���|�@�s�;!�;@⸐�Q=��8�t,��Q��"J;�k������n4��m{B�@���j��1�i���ǵi���%�#��EqJ�6ʊ�TiV��gQ(/V~�*-�ߋ�)�)%Q�SF��x2
�����xB�Km�9Q��-W G�PD���}�S�1�q8��O��|ZD����=��G�t�����g��}�/c� :�z��W^��_:o�|��p|7������������?5�7      �   f  x��U�kG>�����Ո���3�Ł��BKܒC[�jw�],��25%���)%z(=Ԋ�!	&N(�zXW���'}�����,Ďf�}�}�������������@��8�>S�^y��(-��i2�1<�o(}{�Ib�C���4�I��}����A�; ���Qo�:Y\T�Yݬ��eq�K��U�;�=�Ӫx��M��H��8�@��v��A�V��uN��V������D���-.�IU�.��.��0Ev+ź�ד��f�Gͻ8�-�V�9�_��+�iV��]�f.��6�7�y���]��v3�`�KtT�w=�0�qM�B^�|/+�#�i�c�%6X����A��T�<_M�"�ô�G��W(._�=_�L�W�2�H��*}A�����l��o�Y~��4o.H@��Qͧ��C0�5'�(W��]LT�ђ�7�~�1�jC�S��\�XJA��)сbD�(:��
%��)����;��M`f>B���ۆA3%~7&�DR�nb,�REYđ�޶b����>��~�}��8�����5F�f�O�7�.�G���3w���ģr�%��O����[�_ g�¡�o��o-�DwWS��Y]|rT�=��
Q�^��[?�j�(���p�ah/	�0-�c�+�K�v-ݷ��)��ttlU�YV��Ԇ�sH���r�j�rv�6��I�e�U��Z����0B]��meY��1m8���(��0��`�2��ᑛ �:$�I���M�߂u�2\�wAp��T
�%�.�ψ�M���wb%�{��D�����"�s�3���q5p��#e[q#�e���6�n7� �芼      �   s   x�3L1J551H�M����5143ӵHNJ�5MM�HJN67JM6��8�0/]�R!��N ��p�T�G?wKNNCNC�4202�5��5�P02�26�24�352115�&$����� �N"1      �   �   x���9n1��+��"�c�℺����Áf��.0؍	�)��D�6v�m�Lv-���F�6�d�W��(�#5���E�,t�T7t2ר]��Fz��b��q�����z;i|"�N�TuǙ�hp�r���85\�����㷹D�g�7Z(ͷZ��'&-|c��2D�gH�&Gh�>a<<�0��DE���B7�����;-_w)��un      �      x������ � �      �      x������ � �      �   �   x���;n1Ck�)��gK����e��GXo�@�"$��#��n������2�y��$�,d>Ǫ
����y.�ńc�h�X��o�E�co�Yϼ��p�i�j��zFf�~����=h7�+��s�g{f�	��y+��s����]��ِ�-: �
P�&k��M(�o��T�����B��^?�u]/_�T      �   '  x����N�@���)X��)3�?��ŀ(�"L�L�H)(�����FcH�Y���|	�Q���jI*��Գh��	��U�%�U��y�ـ0bϲ��n�ZO�������yR�:�:g�5׍�R��s$�P]eV���?��}ɳn�ɵ�T�KW�z�p�	Cm�@0���` �y��`S�&����_˜P��0��T�,�V!R!Ju����^�T�y���/�6)�6ʩ�0l��nu���
��x�.o��F����6������FO���>n�M�.p�Ks���e��u���l      �   �   x���;nC1D�ZZE��I�'�%�H��	ynR%���nsf��!� ĎBn*�(��J��xz0��@6,Xr��� n�����+b��De����r>%#3����Dy�=�0"}�?���C"����"�	:��"ߩ����Bp-}9�
�};�G-��=,�ʙ�������G��"�O�      �   K   x��ɱ�0�:LaA�Y���#8��}㙥��r7�,�B9r��M,ܛ4�2Y�-�2��CO�Y�;}�A�     