import { supabase } from '../utils/supabaseClient';

/**
 * Samaki Fresh — Customer & Rider Supabase Service Gateway
 */

// 1. Fetch live fish species catalog from Supabase
export async function fetchLiveFishCatalog() {
  if (!supabase) return { success: false, data: null };
  try {
    const { data, error } = await supabase
      .from('fish_products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.warn('[Supabase] Failed to fetch fish products:', error.message);
      return { success: false, error };
    }

    // Map snake_case to app structure
    const mapped = data.map((f) => ({
      id: f.id,
      name: f.name,
      swahiliName: f.swahili_name,
      category: f.category,
      categoryLabel: f.category_label,
      description: f.description,
      pricePerKg: Number(f.price_per_kg),
      unit: f.unit || 'kg',
      minWeightKg: Number(f.min_weight_kg) || 0.5,
      weightStep: Number(f.weight_step) || 0.5,
      stockKg: Number(f.stock_kg) || 0,
      inStock: Boolean(f.in_stock),
      badge: f.badge,
      source: f.source,
      image: f.image_url,
      cleaningOptions: f.cleaning_options || [],
      storageTip: f.storage_tip,
      nutrition: f.nutrition
    }));

    return { success: true, data: mapped };
  } catch (err) {
    console.warn('[Supabase] Catalog fetch exception:', err);
    return { success: false, error: err };
  }
}

// 2. Authoritative Order Creation via RPC
export async function createOrderRPC({
  customerName,
  customerPhone,
  customerType,
  wardId,
  exactAddress,
  deliveryTimeSlot,
  paymentMethod,
  coldChainPackaging,
  cart,
  notes
}) {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };

  try {
    const itemsPayload = cart.map((c) => ({
      fishId: c.fishId,
      weightKg: c.weightKg,
      cleaningOption: c.cleaningOption
    }));

    const { data, error } = await supabase.rpc('create_order', {
      p_customer_name: customerName,
      p_customer_phone: customerPhone,
      p_customer_type: customerType || 'Household',
      p_ward_id: wardId || 'mikocheni',
      p_exact_address: exactAddress,
      p_delivery_time_slot: deliveryTimeSlot,
      p_payment_method: paymentMethod,
      p_include_cold_chain: Boolean(coldChainPackaging),
      p_items: itemsPayload,
      p_notes: notes || ''
    });

    if (error) {
      console.warn('[Supabase RPC create_order Error]:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.warn('[Supabase RPC create_order Exception]:', err);
    return { success: false, error: err.message };
  }
}

// 3. Guest Order Tracking via RPC
export async function getGuestOrderTrackingRPC(orderId, guestToken) {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };

  try {
    const { data, error } = await supabase.rpc('get_guest_order_tracking', {
      p_order_id: orderId,
      p_guest_token: guestToken
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 4. Freshness Rating Submission via RPC
export async function submitOrderRatingRPC(orderId, rating, feedbackText = '', guestToken = null) {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };

  try {
    const { data, error } = await supabase.rpc('submit_order_rating', {
      p_order_id: orderId,
      p_rating: rating,
      p_feedback: feedbackText,
      p_guest_token: guestToken
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 5. Rider Status Progression via RPC
export async function riderUpdateOrderStatusRPC(orderId, nextStatus, notes = '') {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };

  try {
    const { data, error } = await supabase.rpc('rider_update_order_status', {
      p_order_id: orderId,
      p_status: nextStatus,
      p_notes: notes
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 6. Subscribe to Realtime order milestones
export function subscribeToOrderRealtime(orderId, onUpdate) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel(`order_tracking_${orderId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`
      },
      (payload) => {
        onUpdate(payload);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'order_status_logs',
        filter: `order_id=eq.${orderId}`
      },
      (payload) => {
        onUpdate(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
