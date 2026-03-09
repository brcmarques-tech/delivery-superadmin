import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user { id name email role }
    }
  }
`;

export const GET_DASHBOARD_STATS = gql`
  query DashboardStats {
    dashboardStats {
      totalUsers
      totalStores
      totalOrders
      totalRevenue
      platformRevenue
      usersByRole { role count }
      ordersByStatus { status count }
      pendingApprovals
      totalDeliveries
      activeDeliveries
      completedDeliveries
      onlineDeliverers
    }
  }
`;

export const GET_ALL_USERS = gql`
  query AllUsers {
    allUsers {
      id name email phone role isActive createdAt
      pendingRole cpf vehicleType vehiclePlate identityPhotoUrl
      approvedAt rejectedAt rejectionReason
      vendorPlan planExpiresAt mpConnected
      stores { id name }
    }
  }
`;

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($id: String!, $role: UserRole!) {
    updateUserRole(id: $id, role: $role) { id role }
  }
`;

export const TOGGLE_USER_ACTIVE = gql`
  mutation ToggleUserActive($id: String!) {
    toggleUserActive(id: $id) { id isActive }
  }
`;

export const GET_ALL_STORES = gql`
  query AllStores {
    allStores {
      id name description phone city state isOpen isActive
      hasOwnDelivery freeDelivery deliveryFee estimatedDeliveryMinutes
      deliveryStartTime deliveryEndTime freeDeliveryAbove minimumOrder
      street number neighborhood zipCode createdAt
      owner { id name email }
      products { id }
      categories { id }
    }
  }
`;

export const TOGGLE_STORE_ACTIVE = gql`
  mutation ToggleStoreActive($id: String!) {
    toggleStoreActive(id: $id) { id isActive }
  }
`;

export const GET_PENDING_APPROVALS = gql`
  query PendingApprovals {
    pendingApprovals {
      id name email phone role pendingRole cpf
      vehicleType vehiclePlate identityPhotoUrl createdAt
    }
  }
`;

export const APPROVE_USER = gql`
  mutation ApproveUser($id: String!) {
    approveUser(id: $id) { id role pendingRole approvedAt }
  }
`;

export const REJECT_USER = gql`
  mutation RejectUser($id: String!, $reason: String!) {
    rejectUser(id: $id, reason: $reason) { id pendingRole rejectedAt rejectionReason }
  }
`;

export const GET_NOTIFICATION_LOGS = gql`
  query NotificationLogs {
    notificationLogs {
      id type to userName subject message success error createdAt
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query AllOrders {
    allOrders {
      id orderNumber status total subtotal deliveryFee
      paymentMethod isPickup customerConfirmedAt
      deliveryAddress notes createdAt
      customer { id name email phone }
      store { id name }
      items { id quantity totalPrice product { name price } }
      delivery { id deliverer { name phone } pickedUpAt deliveredAt }
    }
  }
`;

export const UPDATE_VENDOR_PLAN = gql`
  mutation UpdateVendorPlan($id: String!, $plan: VendorPlan!, $durationMonths: Int) {
    updateVendorPlan(id: $id, plan: $plan, durationMonths: $durationMonths) {
      id vendorPlan planExpiresAt
    }
  }
`;

export const GET_AVAILABLE_PLANS = gql`
  query AvailablePlans {
    availablePlans {
      plan maxStores canPromote monthlyPrice
    }
  }
`;

export const GET_ALL_PROMOTIONS = gql`
  query AllPromotions {
    allPromotions {
      id title description imageUrl startDate endDate isActive isPaid
      promotionalPrice adCost createdAt
      store { id name owner { id name } }
      product { id name imageUrl price }
    }
  }
`;

export const TOGGLE_PROMOTION_ACTIVE = gql`
  mutation TogglePromotionActive($id: String!) {
    togglePromotionActive(id: $id) { id isActive }
  }
`;

export const MARK_PROMOTION_PAID = gql`
  mutation MarkPromotionPaid($id: String!) {
    markPromotionPaid(id: $id) { id isPaid }
  }
`;

export const GET_PROMO_PRICE_PER_DAY = gql`
  query PromoPricePerDay {
    promoPricePerDay
  }
`;

export const SET_PROMO_PRICE_PER_DAY = gql`
  mutation SetPromoPricePerDay($price: Float!) {
    setPromoPricePerDay(price: $price) { id key value }
  }
`;

export const GET_DELIVERY_PRICES = gql`
  query DeliveryPrices {
    deliveryPricePerKm
    deliveryBasePrice
  }
`;

export const SET_DELIVERY_PRICE_PER_KM = gql`
  mutation SetDeliveryPricePerKm($price: Float!) {
    setDeliveryPricePerKm(price: $price) { id key value }
  }
`;

export const SET_DELIVERY_BASE_PRICE = gql`
  mutation SetDeliveryBasePrice($price: Float!) {
    setDeliveryBasePrice(price: $price) { id key value }
  }
`;

export const GET_ALL_DELIVERIES = gql`
  query AllDeliveries {
    allDeliveries {
      id pickedUpAt deliveredAt createdAt
      payoutStatus payoutAmount payoutMpId
      vendorPayoutStatus vendorPayoutAmount vendorPayoutMpId
      deliverer { id name phone }
      order { id orderNumber status total deliveryFee deliveryAddress store { id name hasOwnDelivery } customer { id name phone } }
    }
  }
`;

export const GET_ALL_PAYMENTS = gql`
  query AllPayments {
    allPayments {
      id type description amount status mpPaymentId checkoutUrl createdAt
      user { id name email }
    }
  }
`;
