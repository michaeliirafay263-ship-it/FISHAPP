import { supabase } from '../utils/supabaseClient';

/**
 * Samaki Fresh — Admin Panel Supabase Service Gateway
 */

// 1. Fetch all orders with items & logs for Admin Dashboard
export async function fetchAdminOrders() {
  if (!supabase) return { success: false, data: null };

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*), order_status_logs(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Admin Supabase] Fetch orders error:', error.message);
      return { success: false, error };
    }

    const mapped = data.map((o) => ({
      id: o.id,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      customerType: o.customer_type,
      itemsSubtotal: Number(o.items_subtotal),
      coldChainFee: Number(o.cold_chain_fee),
      deliveryFee: Number(o.delivery_fee),
      grandTotal: Number(o.grand_total),
      ward: o.ward_name,
      wardId: o.ward_id,
      exactAddress: o.exact_address,
      deliveryTimeSlot: o.delivery_time_slot,
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status,
      paymentRef: o.payment_ref,
      status: o.status,
      assignedRiderId: o.assigned_rider_id,
      riderNotes: o.rider_notes,
      freshnessRating: o.freshness_rating,
      feedbackText: o.feedback_text,
      createdAt: o.created_at,
      items: (o.order_items || []).map((it) => ({
        id: it.fish_id,
        name: it.fish_name,
        pricePerKg: Number(it.price_per_kg),
        weightKg: Number(it.weight_kg),
        cleaningOption: it.cleaning_option,
        totalPrice: Number(it.total_price)
      })),
      statusHistory: (o.order_status_logs || []).map((lg) => ({
        status: lg.status,
        time: lg.time_display,
        label: lg.label,
        createdAt: lg.created_at
      }))
    }));

    return { success: true, data: mapped };
  } catch (err) {
    console.warn('[Admin Supabase] Orders exception:', err);
    return { success: false, error: err };
  }
}

// 2. Update order status as Admin
export async function adminUpdateOrderStatus(orderId, nextStatus, riderId = null, note = '') {
  if (!supabase) return { success: false };

  try {
    const updates = {
      status: nextStatus,
      updated_at: new Date().toISOString()
    };
    if (riderId !== null) updates.assigned_rider_id = riderId;
    if (note) updates.rider_notes = note;

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 3. Assign rider to order
export async function adminAssignRider(orderId, riderId) {
  if (!supabase) return { success: false };

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ assigned_rider_id: riderId, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 4. Update daily fish stock and market price
export async function adminUpdateDailyFish(fishId, updates) {
  if (!supabase) return { success: false };

  try {
    const dbUpdates = {};
    if (updates.pricePerKg !== undefined) dbUpdates.price_per_kg = updates.pricePerKg;
    if (updates.stockKg !== undefined) dbUpdates.stock_kg = updates.stockKg;
    if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('fish_products')
      .update(dbUpdates)
      .eq('id', fishId)
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 5. Add new catch species
export async function adminAddNewFish(fishData) {
  if (!supabase) return { success: false };

  try {
    const record = {
      id: fishData.id || `fish-${Date.now()}`,
      name: fishData.name,
      swahili_name: fishData.swahiliName || fishData.name,
      category: fishData.category || 'fresh',
      category_label: fishData.categoryLabel || 'Fresh Catch',
      description: fishData.description || '',
      price_per_kg: Number(fishData.pricePerKg) || 0,
      unit: fishData.unit || 'kg',
      min_weight_kg: Number(fishData.minWeightKg) || 0.5,
      weight_step: Number(fishData.weightStep) || 0.5,
      stock_kg: Number(fishData.stockKg) || 0,
      in_stock: Number(fishData.stockKg) > 0,
      badge: fishData.badge || '',
      source: fishData.source || 'Kivukoni Fish Market',
      image_url: fishData.image || 'https://images.unsplash.com/photo-1534943441045-1089d75cb355?auto=format&fit=crop&w=800&q=80',
      cleaning_options: fishData.cleaningOptions || [],
      storage_tip: fishData.storageTip || '',
      nutrition: fishData.nutrition || ''
    };

    const { data, error } = await supabase
      .from('fish_products')
      .insert([record])
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 6. Subscribe to Realtime Admin Updates
export function subscribeToAdminRealtime(onNewOrder, onOrderUpdate) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('admin_live_feed')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => {
        if (onNewOrder) onNewOrder(payload.new);
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'orders' },
      (payload) => {
        if (onOrderUpdate) onOrderUpdate(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
