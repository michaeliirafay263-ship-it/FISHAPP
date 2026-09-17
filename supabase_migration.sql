-- =============================================================================
-- SAMAKI FRESH — FINAL PRODUCTION SUPABASE DATABASE SCHEMA MIGRATION
-- Project Ref: pvxkjtyugwapauibvsac
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. EXTENSIONS & SEQUENCES
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Dedicated sequence for collision-safe, human-readable Order IDs (e.g. ORD-8924)
CREATE SEQUENCE IF NOT EXISTS public.order_id_seq START WITH 8930;

CREATE OR REPLACE FUNCTION public.generate_order_id()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD-' || LPAD(nextval('public.order_id_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;

-- Safe helper function to fetch user role without RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public, pg_temp;

-- Safe trigger function for auto-updating updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;


-- -----------------------------------------------------------------------------
-- 2. TABLE DEFINITIONS
-- -----------------------------------------------------------------------------

-- A. PROFILES (Extends auth.users 1-to-1)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'rider', 'admin')),
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(25) UNIQUE,
  user_type VARCHAR(30) DEFAULT 'Household' CHECK (user_type IN ('Household', 'Restaurant', 'Hotel', 'Catering')),
  default_ward VARCHAR(80),
  default_address TEXT,
  -- Rider fleet attributes
  bike_plate VARCHAR(20),
  bike_model VARCHAR(100),
  current_zone VARCHAR(80),
  rider_status VARCHAR(30) DEFAULT 'ready' CHECK (rider_status IN ('ready', 'on_route', 'offline', 'busy')),
  rating NUMERIC(3,2) DEFAULT 5.00 CHECK (rating >= 1.0 AND rating <= 5.0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- B. DAR WARDS (Delivery zones & official transit fees)
CREATE TABLE IF NOT EXISTS public.dar_wards (
  id VARCHAR(40) PRIMARY KEY, -- E.g. 'masaki', 'mikocheni', 'upanga'
  name VARCHAR(100) NOT NULL,
  district VARCHAR(50) NOT NULL CHECK (district IN ('Ilala', 'Kinondoni', 'Ubungo', 'Temeke', 'Kigamboni')),
  delivery_fee NUMERIC(10,2) NOT NULL CHECK (delivery_fee >= 0),
  estimated_minutes INT NOT NULL CHECK (estimated_minutes > 0),
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- C. FISH PRODUCTS (Master catch & species catalog)
CREATE TABLE IF NOT EXISTS public.fish_products (
  id VARCHAR(60) PRIMARY KEY, -- Slug format e.g. 'changaraweni-snapper'
  name VARCHAR(100) NOT NULL,
  swahili_name VARCHAR(100) NOT NULL,
  category VARCHAR(30) NOT NULL CHECK (category IN ('fresh', 'shellfish', 'frozen', 'smoked')),
  category_label VARCHAR(60) NOT NULL,
  description TEXT NOT NULL,
  price_per_kg NUMERIC(10,2) NOT NULL CHECK (price_per_kg >= 0),
  unit VARCHAR(10) NOT NULL DEFAULT 'kg',
  min_weight_kg NUMERIC(4,2) NOT NULL DEFAULT 0.50 CHECK (min_weight_kg > 0),
  weight_step NUMERIC(4,2) NOT NULL DEFAULT 0.50,
  stock_kg NUMERIC(8,2) NOT NULL DEFAULT 0.00 CHECK (stock_kg >= 0),
  in_stock BOOLEAN NOT NULL DEFAULT true,
  badge VARCHAR(80),
  source VARCHAR(120) NOT NULL,
  image_url TEXT NOT NULL,
  cleaning_options JSONB NOT NULL DEFAULT '[]'::jsonb,
  storage_tip TEXT,
  nutrition TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- D. PLATFORM SETTINGS (Singleton operational configuration)
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  cold_chain_fee NUMERIC(10,2) NOT NULL DEFAULT 1500.00,
  market_hours VARCHAR(100) NOT NULL DEFAULT '05:30 AM - 06:00 PM',
  hub_address TEXT NOT NULL DEFAULT 'Kivukoni Fish Market Landing Bay 3, Ferry Road, Dar es Salaam',
  mpesa_shortcode VARCHAR(100) NOT NULL DEFAULT '5520991 (Samaki Fresh Lipa Namba)',
  tigo_tills VARCHAR(100) NOT NULL DEFAULT '883210 (Tigo Pesa Lipa)',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- E. ORDERS (Protected transaction & dispatch lifecycle)
CREATE TABLE IF NOT EXISTS public.orders (
  id VARCHAR(30) PRIMARY KEY DEFAULT public.generate_order_id(),
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_token UUID DEFAULT gen_random_uuid(), -- Unpredictable token for guest tracking & rating
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(25) NOT NULL,
  customer_type VARCHAR(30) NOT NULL DEFAULT 'Household' CHECK (customer_type IN ('Household', 'Restaurant', 'Hotel', 'Catering')),
  items_subtotal NUMERIC(12,2) NOT NULL CHECK (items_subtotal >= 0),
  cold_chain_fee NUMERIC(10,2) NOT NULL DEFAULT 1500.00 CHECK (cold_chain_fee >= 0),
  delivery_fee NUMERIC(10,2) NOT NULL CHECK (delivery_fee >= 0),
  grand_total NUMERIC(12,2) NOT NULL CHECK (grand_total >= 0),
  ward_id VARCHAR(40) NOT NULL REFERENCES public.dar_wards(id),
  ward_name VARCHAR(100) NOT NULL,
  exact_address TEXT NOT NULL,
  delivery_time_slot VARCHAR(60) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PENDING_COD', 'PAID', 'FAILED', 'REFUNDED')),
  payment_ref VARCHAR(80),
  status VARCHAR(30) NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'sourced', 'packed', 'out_for_delivery', 'delivered', 'cancelled')),
  assigned_rider_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  rider_notes TEXT,
  freshness_rating INT CHECK (freshness_rating >= 1 AND freshness_rating <= 5),
  feedback_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- F. ORDER ITEMS (Purchased fish cuts snapshot)
CREATE TABLE IF NOT EXISTS public.order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id VARCHAR(30) NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  fish_id VARCHAR(60) NOT NULL REFERENCES public.fish_products(id) ON DELETE RESTRICT,
  fish_name VARCHAR(100) NOT NULL,
  price_per_kg NUMERIC(10,2) NOT NULL CHECK (price_per_kg >= 0),
  weight_kg NUMERIC(5,2) NOT NULL CHECK (weight_kg > 0),
  cleaning_option VARCHAR(80) NOT NULL,
  cleaning_extra NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (cleaning_extra >= 0),
  total_price NUMERIC(12,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- G. ORDER STATUS LOGS (Cold-chain live milestone tracking)
CREATE TABLE IF NOT EXISTS public.order_status_logs (
  id BIGSERIAL PRIMARY KEY,
  order_id VARCHAR(30) NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL CHECK (status IN ('received', 'sourced', 'packed', 'out_for_delivery', 'delivered', 'cancelled')),
  time_display VARCHAR(20) NOT NULL,
  label TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- -----------------------------------------------------------------------------
-- 3. INDEXES
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_guest_token ON public.orders(guest_token);
CREATE INDEX IF NOT EXISTS idx_orders_assigned_rider_id ON public.orders(assigned_rider_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at_desc ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_ward_id ON public.orders(ward_id);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_fish_id ON public.order_items(fish_id);

CREATE INDEX IF NOT EXISTS idx_order_status_logs_order_id ON public.order_status_logs(order_id);

CREATE INDEX IF NOT EXISTS idx_fish_products_category ON public.fish_products(category);
CREATE INDEX IF NOT EXISTS idx_fish_products_in_stock ON public.fish_products(in_stock);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);


-- -----------------------------------------------------------------------------
-- 4. VIEWS (Admin Analytics — Secured)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.customer_analytics
WITH (security_invoker = true) AS
SELECT
  COALESCE(p.id::TEXT, o.customer_phone) AS customer_key,
  MAX(o.customer_name) AS name,
  o.customer_phone AS phone,
  MAX(o.customer_type) AS user_type,
  MAX(o.ward_name) AS primary_ward,
  MAX(o.exact_address) AS primary_address,
  COUNT(o.id) AS orders_count,
  COALESCE(SUM(o.grand_total), 0) AS total_spent,
  MIN(o.created_at) AS first_order_date,
  MAX(o.created_at) AS last_order_date
FROM public.orders o
LEFT JOIN public.profiles p ON o.customer_id = p.id
WHERE public.get_current_user_role() = 'admin'
GROUP BY COALESCE(p.id::TEXT, o.customer_phone), o.customer_phone;


-- -----------------------------------------------------------------------------
-- 5. TRIGGERS
-- -----------------------------------------------------------------------------

-- A. Auto updated_at triggers
CREATE OR REPLACE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_fish_products_updated_at
  BEFORE UPDATE ON public.fish_products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- B. Auto create profile on auth signup (with clean phone handling)
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, phone, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Valued Customer'),
    NULLIF(COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone'), ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'Household')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = COALESCE(public.profiles.phone, EXCLUDED.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- C. Append-only cold-chain milestone trigger
CREATE OR REPLACE FUNCTION public.log_order_status_milestone()
RETURNS TRIGGER AS $$
DECLARE
  v_label TEXT;
  v_time TEXT;
BEGIN
  IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    v_time := TO_CHAR(NOW() AT TIME ZONE 'Africa/Dar_es_Salaam', 'HH12:MI AM');
    
    CASE NEW.status
      WHEN 'received' THEN v_label := 'Order placed & awaiting fulfillment';
      WHEN 'sourced' THEN v_label := 'Fresh fish inspected at Kivukoni Market pier';
      WHEN 'packed' THEN v_label := 'Descaled, cleaned & packed in thermal ice pouch';
      WHEN 'out_for_delivery' THEN v_label := 'Dispatched with Boda Rider in cold carrier';
      WHEN 'delivered' THEN v_label := 'Delivered & temperature verified at doorstep';
      WHEN 'cancelled' THEN v_label := 'Order cancelled';
      ELSE v_label := 'Status updated to ' || NEW.status;
    END CASE;

    INSERT INTO public.order_status_logs (order_id, status, time_display, label, created_by)
    VALUES (NEW.id, NEW.status, v_time, v_label, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;

CREATE OR REPLACE TRIGGER trg_order_status_milestone
  AFTER INSERT OR UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.log_order_status_milestone();

-- D. Guard: Enforce that direct updates on orders cannot modify financial/sensitive columns
CREATE OR REPLACE FUNCTION public.guard_orders_immutable_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Admins can update any field
  IF public.get_current_user_role() = 'admin' THEN
    RETURN NEW;
  END IF;

  -- Block any non-admin from altering financial, destination, or identity columns
  IF (OLD.grand_total IS DISTINCT FROM NEW.grand_total) OR
     (OLD.items_subtotal IS DISTINCT FROM NEW.items_subtotal) OR
     (OLD.delivery_fee IS DISTINCT FROM NEW.delivery_fee) OR
     (OLD.cold_chain_fee IS DISTINCT FROM NEW.cold_chain_fee) OR
     (OLD.customer_id IS DISTINCT FROM NEW.customer_id) OR
     (OLD.customer_phone IS DISTINCT FROM NEW.customer_phone) OR
     (OLD.customer_name IS DISTINCT FROM NEW.customer_name) OR
     (OLD.ward_id IS DISTINCT FROM NEW.ward_id) OR
     (OLD.exact_address IS DISTINCT FROM NEW.exact_address) OR
     (OLD.payment_status IS DISTINCT FROM NEW.payment_status) OR
     (OLD.payment_ref IS DISTINCT FROM NEW.payment_ref) OR
     (OLD.assigned_rider_id IS DISTINCT FROM NEW.assigned_rider_id) THEN
    RAISE EXCEPTION 'Unauthorized attempt to modify protected order fields.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;

CREATE OR REPLACE TRIGGER trg_guard_orders_immutable_fields
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.guard_orders_immutable_fields();


-- -----------------------------------------------------------------------------
-- 6. CONTROLLED RPC PROCEDURES
-- -----------------------------------------------------------------------------

-- A. Secure Order Creation Gateway
CREATE OR REPLACE FUNCTION public.create_order(
  p_customer_name VARCHAR(100),
  p_customer_phone VARCHAR(25),
  p_customer_type VARCHAR(30),
  p_ward_id VARCHAR(40),
  p_exact_address TEXT,
  p_delivery_time_slot VARCHAR(60),
  p_payment_method VARCHAR(50),
  p_include_cold_chain BOOLEAN,
  p_items JSONB, -- Array of [{ fishId, weightKg, cleaningOption }]
  p_notes TEXT DEFAULT ''
)
RETURNS JSONB AS $$
DECLARE
  v_order_id TEXT;
  v_guest_token UUID;
  v_ward_record RECORD;
  v_cold_chain_fee NUMERIC(10,2) := 0.00;
  v_items_subtotal NUMERIC(12,2) := 0.00;
  v_grand_total NUMERIC(12,2) := 0.00;
  v_item_record RECORD;
  v_fish_record RECORD;
  v_cleaning_extra NUMERIC(10,2);
  v_item_total NUMERIC(12,2);
  v_payment_status VARCHAR(30);
  v_payment_ref TEXT;
BEGIN
  -- 1. Validate Ward & Delivery Fee
  SELECT id, name, delivery_fee INTO v_ward_record
  FROM public.dar_wards
  WHERE id = p_ward_id AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or inactive delivery ward: %', p_ward_id;
  END IF;

  -- 2. Fetch authoritative cold chain fee
  IF p_include_cold_chain THEN
    SELECT cold_chain_fee INTO v_cold_chain_fee FROM public.platform_settings WHERE id = 1;
    IF v_cold_chain_fee IS NULL THEN v_cold_chain_fee := 1500.00; END IF;
  END IF;

  -- 3. Validate items array
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one fish item.';
  END IF;

  -- 4. Calculate Subtotal with authoritative prices
  FOR v_item_record IN SELECT * FROM jsonb_to_recordset(p_items) AS (
    "fishId" VARCHAR(60),
    "weightKg" NUMERIC(5,2),
    "cleaningOption" VARCHAR(80)
  ) LOOP
    SELECT id, name, price_per_kg, in_stock, stock_kg, cleaning_options
    INTO v_fish_record
    FROM public.fish_products
    WHERE id = v_item_record."fishId";

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product % does not exist.', v_item_record."fishId";
    END IF;

    IF NOT v_fish_record.in_stock THEN
      RAISE EXCEPTION 'Product % is currently out of stock.', v_fish_record.name;
    END IF;

    IF v_item_record."weightKg" <= 0 THEN
      RAISE EXCEPTION 'Invalid weight specified for %.', v_fish_record.name;
    END IF;

    -- Extract cleaning extra cost if configured
    SELECT COALESCE((elem->>'extraCost')::NUMERIC, 0.00)
    INTO v_cleaning_extra
    FROM jsonb_array_elements(v_fish_record.cleaning_options) AS elem
    WHERE elem->>'label' = v_item_record."cleaningOption"
       OR elem->>'id' = v_item_record."cleaningOption"
    LIMIT 1;

    IF v_cleaning_extra IS NULL THEN v_cleaning_extra := 0.00; END IF;

    v_item_total := (v_fish_record.price_per_kg * v_item_record."weightKg") + v_cleaning_extra;
    v_items_subtotal := v_items_subtotal + v_item_total;
  END LOOP;

  v_grand_total := v_items_subtotal + v_cold_chain_fee + v_ward_record.delivery_fee;
  
  -- Realistic payment status distinction:
  -- Cash on Delivery is PENDING_COD. Mobile Money/Online starts as PENDING until verified.
  v_payment_status := CASE WHEN p_payment_method ILIKE '%Cash%' THEN 'PENDING_COD' ELSE 'PENDING' END;
  v_payment_ref := UPPER(SPLIT_PART(p_payment_method, ' ', 1)) || '-' || LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0');
  v_guest_token := gen_random_uuid();
  v_order_id := public.generate_order_id();

  -- 5. Insert Order
  INSERT INTO public.orders (
    id,
    customer_id,
    guest_token,
    customer_name,
    customer_phone,
    customer_type,
    items_subtotal,
    cold_chain_fee,
    delivery_fee,
    grand_total,
    ward_id,
    ward_name,
    exact_address,
    delivery_time_slot,
    payment_method,
    payment_status,
    payment_ref,
    status,
    assigned_rider_id,
    rider_notes
  ) VALUES (
    v_order_id,
    auth.uid(),
    v_guest_token,
    p_customer_name,
    p_customer_phone,
    COALESCE(p_customer_type, 'Household'),
    v_items_subtotal,
    v_cold_chain_fee,
    v_ward_record.delivery_fee,
    v_grand_total,
    v_ward_record.id,
    v_ward_record.name,
    p_exact_address,
    p_delivery_time_slot,
    p_payment_method,
    v_payment_status,
    v_payment_ref,
    'received',
    NULL,
    p_notes
  );

  -- 6. Insert Order Items Snapshot
  FOR v_item_record IN SELECT * FROM jsonb_to_recordset(p_items) AS (
    "fishId" VARCHAR(60),
    "weightKg" NUMERIC(5,2),
    "cleaningOption" VARCHAR(80)
  ) LOOP
    SELECT id, name, price_per_kg, cleaning_options
    INTO v_fish_record
    FROM public.fish_products
    WHERE id = v_item_record."fishId";

    SELECT COALESCE((elem->>'extraCost')::NUMERIC, 0.00)
    INTO v_cleaning_extra
    FROM jsonb_array_elements(v_fish_record.cleaning_options) AS elem
    WHERE elem->>'label' = v_item_record."cleaningOption"
       OR elem->>'id' = v_item_record."cleaningOption"
    LIMIT 1;

    IF v_cleaning_extra IS NULL THEN v_cleaning_extra := 0.00; END IF;

    v_item_total := (v_fish_record.price_per_kg * v_item_record."weightKg") + v_cleaning_extra;

    INSERT INTO public.order_items (
      order_id,
      fish_id,
      fish_name,
      price_per_kg,
      weight_kg,
      cleaning_option,
      cleaning_extra,
      total_price
    ) VALUES (
      v_order_id,
      v_fish_record.id,
      v_fish_record.name,
      v_fish_record.price_per_kg,
      v_item_record."weightKg",
      v_item_record."cleaningOption",
      v_cleaning_extra,
      v_item_total
    );
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'orderId', v_order_id,
    'guestToken', v_guest_token,
    'grandTotal', v_grand_total,
    'itemsSubtotal', v_items_subtotal,
    'deliveryFee', v_ward_record.delivery_fee,
    'coldChainFee', v_cold_chain_fee,
    'status', 'received',
    'paymentStatus', v_payment_status
  );
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;

-- B. Secure Rider Status Progression RPC with Enforced Progression
CREATE OR REPLACE FUNCTION public.rider_update_order_status(
  p_order_id TEXT,
  p_status TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_order RECORD;
  v_role TEXT;
BEGIN
  v_role := public.get_current_user_role();
  
  IF v_role NOT IN ('rider', 'admin') THEN
    RAISE EXCEPTION 'Access denied. Rider or Admin role required.';
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order % not found.', p_order_id;
  END IF;

  -- Ensure rider is assigned
  IF v_role = 'rider' AND (v_order.assigned_rider_id IS NULL OR v_order.assigned_rider_id <> auth.uid()) THEN
    RAISE EXCEPTION 'You are not assigned to order %.', p_order_id;
  END IF;

  -- Enforce valid progression for rider workflow
  IF v_role = 'rider' THEN
    IF p_status = 'out_for_delivery' THEN
      IF v_order.status NOT IN ('packed', 'sourced') THEN
        RAISE EXCEPTION 'Cannot start transit for order with status: % (Must be packed/sourced).', v_order.status;
      END IF;
    ELSIF p_status = 'delivered' THEN
      IF v_order.status <> 'out_for_delivery' THEN
        RAISE EXCEPTION 'Cannot mark delivered before order is out_for_delivery (Current status: %).', v_order.status;
      END IF;
    ELSE
      RAISE EXCEPTION 'Riders can only transition orders to out_for_delivery or delivered.';
    END IF;
  END IF;

  UPDATE public.orders
  SET
    status = p_status,
    rider_notes = COALESCE(p_notes, rider_notes),
    updated_at = NOW()
  WHERE id = p_order_id;

  RETURN jsonb_build_object('success', true, 'orderId', p_order_id, 'status', p_status);
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;

-- C. Secure Freshness Rating Submission RPC (Explicit Authorization Logic)
CREATE OR REPLACE FUNCTION public.submit_order_rating(
  p_order_id TEXT,
  p_rating INT,
  p_feedback TEXT DEFAULT '',
  p_guest_token UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_order RECORD;
  v_is_authorized BOOLEAN := false;
BEGIN
  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5 stars.';
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order % not found.', p_order_id;
  END IF;

  IF v_order.status <> 'delivered' THEN
    RAISE EXCEPTION 'Ratings can only be submitted after the order has been delivered.';
  END IF;

  -- Explicit Authorization Evaluation
  IF public.get_current_user_role() = 'admin' THEN
    v_is_authorized := true;
  ELSIF v_order.customer_id IS NOT NULL AND auth.uid() IS NOT NULL AND v_order.customer_id = auth.uid() THEN
    v_is_authorized := true;
  ELSIF v_order.customer_id IS NULL AND v_order.guest_token IS NOT NULL AND p_guest_token IS NOT NULL AND v_order.guest_token = p_guest_token THEN
    v_is_authorized := true;
  END IF;

  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Unauthorized to rate order %. Missing or invalid credentials.', p_order_id;
  END IF;

  UPDATE public.orders
  SET
    freshness_rating = p_rating,
    feedback_text = p_feedback,
    updated_at = NOW()
  WHERE id = p_order_id;

  RETURN jsonb_build_object('success', true, 'orderId', p_order_id, 'rating', p_rating);
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;

-- D. Secure Guest Order Tracking RPC (Sanitized Output)
CREATE OR REPLACE FUNCTION public.get_guest_order_tracking(
  p_order_id TEXT,
  p_guest_token UUID
)
RETURNS JSONB AS $$
DECLARE
  v_order RECORD;
  v_items JSONB;
  v_logs JSONB;
  v_rider JSONB := NULL;
BEGIN
  IF p_guest_token IS NULL THEN
    RAISE EXCEPTION 'Guest access token is required.';
  END IF;

  SELECT
    id,
    customer_name,
    customer_phone,
    customer_type,
    status,
    delivery_time_slot,
    ward_id,
    ward_name,
    exact_address,
    items_subtotal,
    cold_chain_fee,
    delivery_fee,
    grand_total,
    payment_method,
    payment_status,
    assigned_rider_id,
    rider_notes,
    freshness_rating,
    feedback_text,
    created_at
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id AND guest_token = p_guest_token;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found or invalid guest access token.';
  END IF;

  -- Sanitized line items (no internal database IDs)
  SELECT jsonb_agg(jsonb_build_object(
    'fishName', fish_name,
    'pricePerKg', price_per_kg,
    'weightKg', weight_kg,
    'cleaningOption', cleaning_option,
    'totalPrice', total_price
  )) INTO v_items
  FROM public.order_items WHERE order_id = p_order_id;

  -- Sanitized tracking timeline
  SELECT jsonb_agg(jsonb_build_object(
    'status', status,
    'time', time_display,
    'label', label,
    'createdAt', created_at
  )) INTO v_logs
  FROM (
    SELECT status, time_display, label, created_at
    FROM public.order_status_logs
    WHERE order_id = p_order_id
    ORDER BY id ASC
  ) lg;

  -- Sanitized assigned rider contact
  IF v_order.assigned_rider_id IS NOT NULL THEN
    SELECT jsonb_build_object(
      'name', full_name,
      'phone', phone,
      'bikePlate', bike_plate,
      'bikeModel', bike_model,
      'rating', rating
    ) INTO v_rider
    FROM public.profiles
    WHERE id = v_order.assigned_rider_id;
  END IF;

  RETURN jsonb_build_object(
    'id', v_order.id,
    'customerName', v_order.customer_name,
    'customerPhone', v_order.customer_phone,
    'customerType', v_order.customer_type,
    'status', v_order.status,
    'deliveryTimeSlot', v_order.delivery_time_slot,
    'ward', v_order.ward_name,
    'exactAddress', v_order.exact_address,
    'itemsSubtotal', v_order.items_subtotal,
    'coldChainFee', v_order.cold_chain_fee,
    'deliveryFee', v_order.delivery_fee,
    'grandTotal', v_order.grand_total,
    'paymentMethod', v_order.payment_method,
    'paymentStatus', v_order.payment_status,
    'riderNotes', v_order.rider_notes,
    'freshnessRating', v_order.freshness_rating,
    'feedbackText', v_order.feedback_text,
    'createdAt', v_order.created_at,
    'items', COALESCE(v_items, '[]'::jsonb),
    'statusHistory', COALESCE(v_logs, '[]'::jsonb),
    'assignedRider', v_rider
  );
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;


-- -----------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dar_wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fish_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_logs ENABLE ROW LEVEL SECURITY;

-- A. FISH PRODUCTS
CREATE POLICY "Public fish catalog read" ON public.fish_products
  FOR SELECT USING (true);

CREATE POLICY "Admin fish catalog manage" ON public.fish_products
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- B. DAR WARDS
CREATE POLICY "Public wards read" ON public.dar_wards
  FOR SELECT USING (true);

CREATE POLICY "Admin wards manage" ON public.dar_wards
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- C. PLATFORM SETTINGS
CREATE POLICY "Public settings read" ON public.platform_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin settings manage" ON public.platform_settings
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- D. PROFILES
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id
    OR public.get_current_user_role() = 'admin'
    OR (public.get_current_user_role() = 'rider' AND role = 'customer')
  );

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.get_current_user_role() = 'admin');

CREATE POLICY "Admin profiles manage" ON public.profiles
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- E. ORDERS
CREATE POLICY "Orders read access" ON public.orders
  FOR SELECT USING (
    public.get_current_user_role() = 'admin'
    OR (customer_id IS NOT NULL AND customer_id = auth.uid())
    OR (public.get_current_user_role() = 'rider' AND assigned_rider_id = auth.uid())
  );

CREATE POLICY "Admin orders manage" ON public.orders
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- F. ORDER ITEMS
CREATE POLICY "Order items read access" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
      AND (
        public.get_current_user_role() = 'admin'
        OR (o.customer_id IS NOT NULL AND o.customer_id = auth.uid())
        OR (public.get_current_user_role() = 'rider' AND o.assigned_rider_id = auth.uid())
      )
    )
  );

CREATE POLICY "Admin order items manage" ON public.order_items
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- G. ORDER STATUS LOGS
CREATE POLICY "Status logs read access" ON public.order_status_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_status_logs.order_id
      AND (
        public.get_current_user_role() = 'admin'
        OR (o.customer_id IS NOT NULL AND o.customer_id = auth.uid())
        OR (public.get_current_user_role() = 'rider' AND o.assigned_rider_id = auth.uid())
      )
    )
  );


-- -----------------------------------------------------------------------------
-- 8. EXPLICIT RPC EXECUTE PRIVILEGES
-- -----------------------------------------------------------------------------

-- Revoke default public access on internal helpers
REVOKE ALL ON FUNCTION public.generate_order_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_current_user_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated, anon;

-- Customer / Guest order creation and tracking
GRANT EXECUTE ON FUNCTION public.create_order(VARCHAR, VARCHAR, VARCHAR, VARCHAR, TEXT, VARCHAR, VARCHAR, BOOLEAN, JSONB, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_guest_order_tracking(TEXT, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_order_rating(TEXT, INT, TEXT, UUID) TO anon, authenticated;

-- Rider workflow (Revoked from anon!)
REVOKE ALL ON FUNCTION public.rider_update_order_status(TEXT, TEXT, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.rider_update_order_status(TEXT, TEXT, TEXT) TO authenticated;


-- -----------------------------------------------------------------------------
-- 9. SUPABASE REALTIME CONFIGURATION
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.order_status_logs;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.fish_products;
  END IF;
END $$;
