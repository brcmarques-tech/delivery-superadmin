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
      usersByRole { role count }
      ordersByStatus { status count }
      pendingApprovals
    }
  }
`;

export const GET_ALL_USERS = gql`
  query AllUsers {
    allUsers {
      id name email phone role isActive createdAt
      pendingRole cpf vehicleType vehiclePlate identityPhotoUrl
      approvedAt rejectedAt rejectionReason
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
      deliveryFee estimatedDeliveryMinutes createdAt
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
      deliveryAddress notes createdAt
      customer { id name email phone }
      store { id name }
      items { id quantity totalPrice product { name price } }
      delivery { id deliverer { name phone } pickedUpAt deliveredAt }
    }
  }
`;
