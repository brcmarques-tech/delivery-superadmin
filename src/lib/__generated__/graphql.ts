import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AddToCartInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['String']['input'];
  quantity?: Scalars['Int']['input'];
  weightGrams?: InputMaybe<Scalars['Int']['input']>;
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String']['output'];
  complement?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isDefault: Scalars['Boolean']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  neighborhood: Scalars['String']['output'];
  number: Scalars['String']['output'];
  state: Scalars['String']['output'];
  street: Scalars['String']['output'];
  user: AppUser;
  zipCode: Scalars['String']['output'];
};

export type AnticipationResult = {
  __typename?: 'AnticipationResult';
  approvedAmount: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  fee: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  requestedAmount: Scalars['Float']['output'];
  status: Scalars['String']['output'];
};

export type AnticipationSimulation = {
  __typename?: 'AnticipationSimulation';
  anticipatedAmount: Scalars['Float']['output'];
  fee: Scalars['Float']['output'];
  feePercentage: Scalars['Float']['output'];
  originalAmount: Scalars['Float']['output'];
};

export type AppAuthResponse = {
  __typename?: 'AppAuthResponse';
  accessToken: Scalars['String']['output'];
  user: AppUser;
};

export type AppUser = {
  __typename?: 'AppUser';
  acceptedTermsAt?: Maybe<Scalars['DateTime']['output']>;
  addresses?: Maybe<Array<Address>>;
  approvedAt?: Maybe<Scalars['DateTime']['output']>;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  birthDate?: Maybe<Scalars['String']['output']>;
  cnhNumber?: Maybe<Scalars['String']['output']>;
  cpf?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  googleId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  identityPhotoBackUrl?: Maybe<Scalars['String']['output']>;
  identityPhotoUrl?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isDeliverer: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  notificationEmail?: Maybe<Scalars['String']['output']>;
  orders?: Maybe<Array<Order>>;
  pagarmeRecipientId?: Maybe<Scalars['String']['output']>;
  paymentConnected: Scalars['Boolean']['output'];
  pendingRole?: Maybe<Scalars['String']['output']>;
  permissions?: Maybe<Scalars['String']['output']>;
  phone: Scalars['String']['output'];
  phoneVerified: Scalars['Boolean']['output'];
  profilePhotoUrl?: Maybe<Scalars['String']['output']>;
  rejectedAt?: Maybe<Scalars['DateTime']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  updatedAt: Scalars['DateTime']['output'];
  vehiclePlate?: Maybe<Scalars['String']['output']>;
  vehicleType?: Maybe<Scalars['String']['output']>;
};

export type Appointment = {
  __typename?: 'Appointment';
  address?: Maybe<Scalars['String']['output']>;
  appointmentNumber: Scalars['String']['output'];
  checkoutUrl?: Maybe<Scalars['String']['output']>;
  commissionAmount?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  customer: AppUser;
  endTime: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  pagarmeOrderId?: Maybe<Scalars['String']['output']>;
  paymentMethod?: Maybe<Scalars['String']['output']>;
  paymentStatus?: Maybe<Scalars['String']['output']>;
  pixQrCode?: Maybe<Scalars['String']['output']>;
  pixQrCodeBase64?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  quoteDescription?: Maybe<Scalars['String']['output']>;
  quoteResponse?: Maybe<Scalars['String']['output']>;
  scheduledDate: Scalars['String']['output'];
  scheduledTime: Scalars['String']['output'];
  service: Service;
  status: AppointmentStatus;
  store: Store;
  updatedAt: Scalars['DateTime']['output'];
};

export enum AppointmentStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Confirmed = 'CONFIRMED',
  NoShow = 'NO_SHOW',
  Pending = 'PENDING',
  Quoted = 'QUOTED',
  QuoteAccepted = 'QUOTE_ACCEPTED',
  QuoteRejected = 'QUOTE_REJECTED',
  QuoteRequested = 'QUOTE_REQUESTED'
}

export type ApprovalLog = {
  __typename?: 'ApprovalLog';
  action: Scalars['String']['output'];
  adminId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  identityPhotoBackUrl?: Maybe<Scalars['String']['output']>;
  identityPhotoUrl?: Maybe<Scalars['String']['output']>;
  profilePhotoUrl?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
  userEmail: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  userName: Scalars['String']['output'];
  userType: Scalars['String']['output'];
};

export type BarcodeLookupResult = {
  __typename?: 'BarcodeLookupResult';
  barcode: Scalars['String']['output'];
  brand?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['String']['output']>;
};

export type BulkCreateProductsInput = {
  products: Array<BulkProductItem>;
  storeId: Scalars['String']['input'];
};

export type BulkImportResult = {
  __typename?: 'BulkImportResult';
  created: Scalars['Int']['output'];
  errors: Array<Scalars['String']['output']>;
};

export type BulkProductItem = {
  barcode?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isVariableWeight?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  stock?: InputMaybe<Scalars['Float']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type CartItem = {
  __typename?: 'CartItem';
  createdAt: Scalars['DateTime']['output'];
  customer: AppUser;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  product: Product;
  quantity: Scalars['Int']['output'];
  store: Store;
  updatedAt: Scalars['DateTime']['output'];
  weightGrams?: Maybe<Scalars['Int']['output']>;
};

export type CartProductSummary = {
  __typename?: 'CartProductSummary';
  productId: Scalars['ID']['output'];
  productImageUrl?: Maybe<Scalars['String']['output']>;
  productName: Scalars['String']['output'];
  totalPeople: Scalars['Int']['output'];
  totalQuantity: Scalars['Int']['output'];
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  products?: Maybe<Array<Product>>;
  requiresAgeVerification: Scalars['Boolean']['output'];
  sortOrder: Scalars['Float']['output'];
  store: Store;
};

export type Coupon = {
  __typename?: 'Coupon';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  discountType: Scalars['String']['output'];
  discountValue: Scalars['Float']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  maxDiscount?: Maybe<Scalars['Float']['output']>;
  maxUses: Scalars['Int']['output'];
  minimumOrder?: Maybe<Scalars['Float']['output']>;
  store: Store;
  updatedAt: Scalars['DateTime']['output'];
  usesCount: Scalars['Int']['output'];
};

export type CouponValidation = {
  __typename?: 'CouponValidation';
  couponId: Scalars['String']['output'];
  discount: Scalars['Float']['output'];
  message: Scalars['String']['output'];
  valid: Scalars['Boolean']['output'];
};

export type CreateAddressInput = {
  city: Scalars['String']['input'];
  complement?: InputMaybe<Scalars['String']['input']>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  neighborhood: Scalars['String']['input'];
  number: Scalars['String']['input'];
  state: Scalars['String']['input'];
  street: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type CreateAppointmentInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  cardId?: InputMaybe<Scalars['String']['input']>;
  cardToken?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /** ON_SERVICE | PIX | CREDIT_CARD */
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  scheduledDate: Scalars['String']['input'];
  scheduledTime: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
  storeId: Scalars['String']['input'];
};

export type CreateCouponInput = {
  code: Scalars['String']['input'];
  discountType?: Scalars['String']['input'];
  discountValue: Scalars['Float']['input'];
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  maxDiscount?: InputMaybe<Scalars['Float']['input']>;
  maxUses?: InputMaybe<Scalars['Int']['input']>;
  minimumOrder?: InputMaybe<Scalars['Float']['input']>;
  storeId: Scalars['String']['input'];
};

export type CreateOrderInput = {
  ageVerified?: InputMaybe<Scalars['Boolean']['input']>;
  cardId?: InputMaybe<Scalars['String']['input']>;
  cardToken?: InputMaybe<Scalars['String']['input']>;
  couponCode?: InputMaybe<Scalars['String']['input']>;
  deliveryAddress?: InputMaybe<Scalars['String']['input']>;
  deliveryLatitude?: InputMaybe<Scalars['Float']['input']>;
  deliveryLongitude?: InputMaybe<Scalars['Float']['input']>;
  isPickup?: InputMaybe<Scalars['Boolean']['input']>;
  items: Array<OrderItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  storeId: Scalars['String']['input'];
};

export type CreateProductInput = {
  barcode?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isVariableWeight?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  stock?: InputMaybe<Scalars['Float']['input']>;
  storeId: Scalars['String']['input'];
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePromotionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDate: Scalars['DateTime']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  productId?: InputMaybe<Scalars['String']['input']>;
  promotionalPrice: Scalars['Float']['input'];
  startDate: Scalars['DateTime']['input'];
  storeId: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateServiceInput = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  estimatedDuration?: InputMaybe<Scalars['Int']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  price?: InputMaybe<Scalars['Float']['input']>;
  requiresQuote?: InputMaybe<Scalars['Boolean']['input']>;
  storeId: Scalars['String']['input'];
};

export type CreateServiceRatingInput = {
  appointmentId: Scalars['String']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
  photoUrls?: InputMaybe<Array<Scalars['String']['input']>>;
  rating: Scalars['Int']['input'];
};

export type CreateStoreInput = {
  bannerUrl?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  complement?: InputMaybe<Scalars['String']['input']>;
  deliveryEndTime?: InputMaybe<Scalars['String']['input']>;
  deliveryFee?: InputMaybe<Scalars['Float']['input']>;
  deliveryStartTime?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  estimatedDeliveryMinutes?: InputMaybe<Scalars['Float']['input']>;
  freeDelivery?: InputMaybe<Scalars['Boolean']['input']>;
  freeDeliveryAbove?: InputMaybe<Scalars['Float']['input']>;
  hasOwnDelivery?: InputMaybe<Scalars['Boolean']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  minimumOrder?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  neighborhood: Scalars['String']['input'];
  number: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  state: Scalars['String']['input'];
  storeType?: InputMaybe<StoreType>;
  street: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type DashboardStats = {
  __typename?: 'DashboardStats';
  activeDeliveries: Scalars['Int']['output'];
  appointmentRevenue: Scalars['Float']['output'];
  avgTicket: Scalars['Float']['output'];
  cancellationRate: Scalars['Float']['output'];
  completedDeliveries: Scalars['Int']['output'];
  onlineDeliverers: Scalars['Int']['output'];
  ordersByDay: Array<DayStats>;
  ordersByStatus: Array<StatusCount>;
  pendingApprovals: Scalars['Int']['output'];
  platformRevenue: Scalars['Float']['output'];
  recentOrders: Array<RecentOrder>;
  topStores: Array<TopStore>;
  totalAppointments: Scalars['Int']['output'];
  totalDeliveries: Scalars['Int']['output'];
  totalOrders: Scalars['Int']['output'];
  totalRevenue: Scalars['Float']['output'];
  totalStores: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
  usersByRole: Array<RoleCount>;
};

export type DayStats = {
  __typename?: 'DayStats';
  count: Scalars['Int']['output'];
  date: Scalars['String']['output'];
  revenue: Scalars['Float']['output'];
};

export type Delivery = {
  __typename?: 'Delivery';
  createdAt: Scalars['DateTime']['output'];
  currentLatitude?: Maybe<Scalars['Float']['output']>;
  currentLongitude?: Maybe<Scalars['Float']['output']>;
  deliveredAt?: Maybe<Scalars['DateTime']['output']>;
  deliverer?: Maybe<AppUser>;
  id: Scalars['ID']['output'];
  order: Order;
  payoutAmount?: Maybe<Scalars['Float']['output']>;
  payoutMpId?: Maybe<Scalars['String']['output']>;
  payoutStatus?: Maybe<Scalars['String']['output']>;
  pickedUpAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  vendorPayoutAmount?: Maybe<Scalars['Float']['output']>;
  vendorPayoutMpId?: Maybe<Scalars['String']['output']>;
  vendorPayoutStatus?: Maybe<Scalars['String']['output']>;
};

export type FrequentStore = {
  __typename?: 'FrequentStore';
  bannerUrl?: Maybe<Scalars['String']['output']>;
  deliveryFee: Scalars['Float']['output'];
  description?: Maybe<Scalars['String']['output']>;
  freeDelivery: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isOpen: Scalars['Boolean']['output'];
  lastOrderAt: Scalars['DateTime']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  orderCount: Scalars['Int']['output'];
  verificationLevel?: Maybe<Scalars['String']['output']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptAppTerms: AppUser;
  acceptDelivery: Delivery;
  acceptQuote: Appointment;
  acceptSubscriptionTerms: VendorUser;
  acceptVendorTerms: VendorUser;
  addToCart: CartItem;
  adjustOrderItemWeight: Order;
  adminDeleteCoupon: Scalars['Boolean']['output'];
  adminToggleCoupon: Coupon;
  approveAppUser: AppUser;
  approveVendorUser: VendorUser;
  bulkCreateProducts: BulkImportResult;
  cancelAppointment: Appointment;
  cancelDispute: Order;
  cancelOrder: Order;
  cancelSubscription: Scalars['Boolean']['output'];
  claimBadgeReward: Store;
  clearAllNotifications: Scalars['Boolean']['output'];
  clearCart: Scalars['Boolean']['output'];
  clearCartByStore: Scalars['Boolean']['output'];
  completeAppointment: Appointment;
  confirmAppointment: Appointment;
  confirmDelivery: Delivery;
  confirmEmailVerification: Scalars['Boolean']['output'];
  confirmPickup: Delivery;
  confirmReceipt: Order;
  createAddress: Address;
  createAppointment: Appointment;
  createCategory: Category;
  createCoupon: Coupon;
  createOrder: Order;
  createPlanUpgrade: Payment;
  createProduct: Product;
  createPromotion: Promotion;
  createService: Service;
  createStore: Store;
  customerDenyDelivery: Order;
  deleteAddress: Scalars['Boolean']['output'];
  deleteCard: Scalars['Boolean']['output'];
  deleteCategory: Scalars['Boolean']['output'];
  deleteCoupon: Scalars['Boolean']['output'];
  deleteNotification: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deletePromotion: Scalars['Boolean']['output'];
  deleteService: Scalars['Boolean']['output'];
  disconnectPayment: Scalars['Boolean']['output'];
  disputeCompletedOrder: Order;
  followStore: Scalars['Boolean']['output'];
  googleAuthApp: AppAuthResponse;
  googleAuthVendor: VendorAuthResponse;
  loginApp: AppAuthResponse;
  loginVendor: VendorAuthResponse;
  logout: Scalars['Boolean']['output'];
  markNoShow: Appointment;
  markPromotionPaid: Promotion;
  rateService: ServiceRating;
  reactivateSubscription: Scalars['Boolean']['output'];
  recalculateVerification: Store;
  refundOrder: Order;
  registerApp: AppAuthResponse;
  registerAppPushToken: Scalars['Boolean']['output'];
  registerAppWithGoogle: AppAuthResponse;
  registerAsDeliverer: AppUser;
  registerRecipient: Scalars['Boolean']['output'];
  registerSuperadmin: AppUser;
  registerVendor: VendorAuthResponse;
  registerVendorPushToken: Scalars['Boolean']['output'];
  registerVendorWithGoogle: VendorAuthResponse;
  rejectAppUser: AppUser;
  rejectOrder: Order;
  rejectQuote: Appointment;
  rejectVendorUser: VendorUser;
  removeFromCart: Scalars['Boolean']['output'];
  requestAnticipation: AnticipationResult;
  requestCancelDispute: Order;
  requestPasswordResetApp: Scalars['String']['output'];
  requestPasswordResetVendor: Scalars['String']['output'];
  requestQuote: Appointment;
  requestStoreDelete: Scalars['Boolean']['output'];
  requestVendorStoreDelete: Scalars['Boolean']['output'];
  resendNotification: Scalars['Boolean']['output'];
  resetPassword: Scalars['Boolean']['output'];
  resolveDispute: Order;
  respondQuote: Appointment;
  restoreProduct: Product;
  saveCard: SavedCard;
  sendEmailVerification: Scalars['Boolean']['output'];
  sendVerificationCode: Scalars['String']['output'];
  setDefaultAddress: Address;
  setDeliveryBasePrice: PlatformConfig;
  setDeliveryCommissionPercent: PlatformConfig;
  setDeliveryPricePerKm: PlatformConfig;
  setMinimumOrderPlatform: PlatformConfig;
  setPromoPricePerDay: PlatformConfig;
  setSchedule: Array<Schedule>;
  setStoreVerification: Store;
  simulatePayment: Order;
  swapPromotionProduct: Promotion;
  toggleAppUserActive: AppUser;
  toggleAutoAnticipation: Scalars['Boolean']['output'];
  toggleCouponActive: Coupon;
  toggleProductActive: Product;
  toggleProductAvailability: Product;
  togglePromotionActive: Promotion;
  toggleStoreActive: Store;
  toggleStoreOpen: Store;
  toggleVendorUserActive: VendorUser;
  unfollowStore: Scalars['Boolean']['output'];
  updateAddress: Address;
  updateAppProfile: AppUser;
  updateAppUserRole: AppUser;
  updateBadgePoints: Scalars['Boolean']['output'];
  updateBadgeRewards: Scalars['Boolean']['output'];
  updateBadgeThresholds: Scalars['Boolean']['output'];
  updateCartItem: CartItem;
  updateCategory: Category;
  updateContractContent: Scalars['Boolean']['output'];
  updateCoupon: Coupon;
  updateNotificationEmail: AppUser;
  updateOrderStatus: Order;
  updatePlanConfig: Scalars['Boolean']['output'];
  updateProduct: Product;
  updateService: Service;
  updateStore: Store;
  updateSubscriptionCard: Scalars['Boolean']['output'];
  updateSuperadminPermissions: AppUser;
  updateVendorPlan: VendorUser;
  updateVendorProfile: VendorUser;
  uploadFromUrl: Scalars['String']['output'];
  uploadImage: Scalars['String']['output'];
  validateDocumentPhoto: PhotoValidation;
  validateFacePhoto: PhotoValidation;
  validateRegistration: ValidationResult;
  vendorCancelAppointment: Appointment;
  vendorCancelOrder: Order;
  vendorConfirmPickup: Order;
  verifyCode: Scalars['Boolean']['output'];
};


export type MutationAcceptDeliveryArgs = {
  orderId: Scalars['String']['input'];
};


export type MutationAcceptQuoteArgs = {
  id: Scalars['String']['input'];
  scheduledDate: Scalars['String']['input'];
  scheduledTime: Scalars['String']['input'];
};


export type MutationAddToCartArgs = {
  input: AddToCartInput;
};


export type MutationAdjustOrderItemWeightArgs = {
  actualWeightGrams: Scalars['Int']['input'];
  orderItemId: Scalars['String']['input'];
};


export type MutationAdminDeleteCouponArgs = {
  id: Scalars['String']['input'];
};


export type MutationAdminToggleCouponArgs = {
  id: Scalars['String']['input'];
};


export type MutationApproveAppUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationApproveVendorUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationBulkCreateProductsArgs = {
  input: BulkCreateProductsInput;
};


export type MutationCancelAppointmentArgs = {
  id: Scalars['String']['input'];
};


export type MutationCancelDisputeArgs = {
  orderId: Scalars['String']['input'];
};


export type MutationCancelOrderArgs = {
  orderId: Scalars['String']['input'];
};


export type MutationClaimBadgeRewardArgs = {
  level: Scalars['String']['input'];
  storeId: Scalars['String']['input'];
};


export type MutationClearCartByStoreArgs = {
  storeId: Scalars['String']['input'];
};


export type MutationCompleteAppointmentArgs = {
  id: Scalars['String']['input'];
};


export type MutationConfirmAppointmentArgs = {
  id: Scalars['String']['input'];
};


export type MutationConfirmDeliveryArgs = {
  deliveryId: Scalars['String']['input'];
};


export type MutationConfirmEmailVerificationArgs = {
  code: Scalars['String']['input'];
  userType?: Scalars['String']['input'];
};


export type MutationConfirmPickupArgs = {
  deliveryId: Scalars['String']['input'];
};


export type MutationConfirmReceiptArgs = {
  orderId: Scalars['String']['input'];
};


export type MutationCreateAddressArgs = {
  input: CreateAddressInput;
};


export type MutationCreateAppointmentArgs = {
  input: CreateAppointmentInput;
};


export type MutationCreateCategoryArgs = {
  name: Scalars['String']['input'];
  requiresAgeVerification?: InputMaybe<Scalars['Boolean']['input']>;
  storeId: Scalars['String']['input'];
};


export type MutationCreateCouponArgs = {
  input: CreateCouponInput;
};


export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type MutationCreatePlanUpgradeArgs = {
  billingPeriod?: InputMaybe<Scalars['String']['input']>;
  cardToken?: InputMaybe<Scalars['String']['input']>;
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  plan: VendorPlan;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationCreatePromotionArgs = {
  input: CreatePromotionInput;
};


export type MutationCreateServiceArgs = {
  input: CreateServiceInput;
};


export type MutationCreateStoreArgs = {
  input: CreateStoreInput;
};


export type MutationCustomerDenyDeliveryArgs = {
  orderId: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};


export type MutationDeleteAddressArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCardArgs = {
  cardId: Scalars['String']['input'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCouponArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteNotificationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeletePromotionArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteServiceArgs = {
  id: Scalars['String']['input'];
};


export type MutationDisputeCompletedOrderArgs = {
  orderId: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};


export type MutationFollowStoreArgs = {
  storeId: Scalars['String']['input'];
};


export type MutationGoogleAuthAppArgs = {
  idToken: Scalars['String']['input'];
};


export type MutationGoogleAuthVendorArgs = {
  forceLogin?: InputMaybe<Scalars['Boolean']['input']>;
  idToken: Scalars['String']['input'];
};


export type MutationLoginAppArgs = {
  forceLogin?: InputMaybe<Scalars['Boolean']['input']>;
  input: LoginInput;
};


export type MutationLoginVendorArgs = {
  forceLogin?: InputMaybe<Scalars['Boolean']['input']>;
  input: LoginInput;
};


export type MutationMarkNoShowArgs = {
  id: Scalars['String']['input'];
};


export type MutationMarkPromotionPaidArgs = {
  id: Scalars['String']['input'];
};


export type MutationRateServiceArgs = {
  input: CreateServiceRatingInput;
};


export type MutationRecalculateVerificationArgs = {
  storeId: Scalars['String']['input'];
};


export type MutationRefundOrderArgs = {
  orderId: Scalars['String']['input'];
};


export type MutationRegisterAppArgs = {
  input: RegisterAppInput;
};


export type MutationRegisterAppPushTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationRegisterAppWithGoogleArgs = {
  cpf: Scalars['String']['input'];
  idToken: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};


export type MutationRegisterAsDelivererArgs = {
  input: RegisterDelivererInput;
};


export type MutationRegisterRecipientArgs = {
  recipientData: Scalars['String']['input'];
};


export type MutationRegisterSuperadminArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  permissions?: InputMaybe<Scalars['String']['input']>;
  phone: Scalars['String']['input'];
};


export type MutationRegisterVendorArgs = {
  input: RegisterVendorInput;
};


export type MutationRegisterVendorPushTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationRegisterVendorWithGoogleArgs = {
  cpf: Scalars['String']['input'];
  idToken: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};


export type MutationRejectAppUserArgs = {
  id: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};


export type MutationRejectOrderArgs = {
  orderId: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};


export type MutationRejectQuoteArgs = {
  id: Scalars['String']['input'];
};


export type MutationRejectVendorUserArgs = {
  id: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};


export type MutationRemoveFromCartArgs = {
  cartItemId: Scalars['String']['input'];
};


export type MutationRequestCancelDisputeArgs = {
  orderId: Scalars['String']['input'];
};


export type MutationRequestPasswordResetAppArgs = {
  email: Scalars['String']['input'];
};


export type MutationRequestPasswordResetVendorArgs = {
  email: Scalars['String']['input'];
};


export type MutationRequestQuoteArgs = {
  input: RequestQuoteInput;
};


export type MutationRequestStoreDeleteArgs = {
  password: Scalars['String']['input'];
  storeId: Scalars['String']['input'];
};


export type MutationRequestVendorStoreDeleteArgs = {
  password: Scalars['String']['input'];
  storeId: Scalars['String']['input'];
};


export type MutationResendNotificationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
  type?: Scalars['String']['input'];
};


export type MutationResolveDisputeArgs = {
  orderId: Scalars['String']['input'];
  resolution: Scalars['String']['input'];
};


export type MutationRespondQuoteArgs = {
  id: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  response: Scalars['String']['input'];
};


export type MutationRestoreProductArgs = {
  id: Scalars['String']['input'];
};


export type MutationSaveCardArgs = {
  token: Scalars['String']['input'];
};


export type MutationSendEmailVerificationArgs = {
  userType?: Scalars['String']['input'];
};


export type MutationSendVerificationCodeArgs = {
  input: SendCodeInput;
};


export type MutationSetDefaultAddressArgs = {
  id: Scalars['String']['input'];
};


export type MutationSetDeliveryBasePriceArgs = {
  price: Scalars['Float']['input'];
};


export type MutationSetDeliveryCommissionPercentArgs = {
  percent: Scalars['Float']['input'];
};


export type MutationSetDeliveryPricePerKmArgs = {
  price: Scalars['Float']['input'];
};


export type MutationSetMinimumOrderPlatformArgs = {
  price: Scalars['Float']['input'];
};


export type MutationSetPromoPricePerDayArgs = {
  price: Scalars['Float']['input'];
};


export type MutationSetScheduleArgs = {
  input: SetScheduleInput;
};


export type MutationSetStoreVerificationArgs = {
  level: VerificationLevel;
  score?: InputMaybe<Scalars['Float']['input']>;
  storeId: Scalars['String']['input'];
};


export type MutationSimulatePaymentArgs = {
  orderId: Scalars['String']['input'];
};


export type MutationSwapPromotionProductArgs = {
  id: Scalars['String']['input'];
  productId: Scalars['String']['input'];
  promotionalPrice: Scalars['Float']['input'];
  title: Scalars['String']['input'];
};


export type MutationToggleAppUserActiveArgs = {
  id: Scalars['String']['input'];
};


export type MutationToggleAutoAnticipationArgs = {
  enabled: Scalars['Boolean']['input'];
};


export type MutationToggleCouponActiveArgs = {
  id: Scalars['String']['input'];
};


export type MutationToggleProductActiveArgs = {
  id: Scalars['String']['input'];
};


export type MutationToggleProductAvailabilityArgs = {
  id: Scalars['String']['input'];
};


export type MutationTogglePromotionActiveArgs = {
  id: Scalars['String']['input'];
};


export type MutationToggleStoreActiveArgs = {
  id: Scalars['String']['input'];
};


export type MutationToggleStoreOpenArgs = {
  id: Scalars['String']['input'];
};


export type MutationToggleVendorUserActiveArgs = {
  id: Scalars['String']['input'];
};


export type MutationUnfollowStoreArgs = {
  storeId: Scalars['String']['input'];
};


export type MutationUpdateAddressArgs = {
  input: UpdateAddressInput;
};


export type MutationUpdateAppProfileArgs = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  currentPassword?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  newPassword?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateAppUserRoleArgs = {
  id: Scalars['String']['input'];
  role: UserRole;
};


export type MutationUpdateBadgePointsArgs = {
  points: Scalars['String']['input'];
};


export type MutationUpdateBadgeRewardsArgs = {
  level: Scalars['String']['input'];
  rewards: Scalars['String']['input'];
};


export type MutationUpdateBadgeThresholdsArgs = {
  thresholds: Scalars['String']['input'];
};


export type MutationUpdateCartItemArgs = {
  input: UpdateCartItemInput;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  requiresAgeVerification?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationUpdateContractContentArgs = {
  content: Scalars['String']['input'];
  type: Scalars['String']['input'];
};


export type MutationUpdateCouponArgs = {
  input: UpdateCouponInput;
};


export type MutationUpdateNotificationEmailArgs = {
  email: Scalars['String']['input'];
};


export type MutationUpdateOrderStatusArgs = {
  id: Scalars['String']['input'];
  status: OrderStatus;
};


export type MutationUpdatePlanConfigArgs = {
  annualPrice: Scalars['Float']['input'];
  canUseCoupons: Scalars['Boolean']['input'];
  commissionPercent: Scalars['Float']['input'];
  freePromosPerWeek: Scalars['Int']['input'];
  hasAnalytics: Scalars['Boolean']['input'];
  highlightDaysPerMonth: Scalars['Int']['input'];
  isContactSales: Scalars['Boolean']['input'];
  listingPriority: Scalars['Int']['input'];
  maxEmailsPerMonth: Scalars['Int']['input'];
  maxProductsPerStore: Scalars['Int']['input'];
  maxStores: Scalars['Int']['input'];
  monthlyPrice: Scalars['Float']['input'];
  plan: VendorPlan;
  quarterlyPrice: Scalars['Float']['input'];
  semiannualPrice: Scalars['Float']['input'];
  supportLevel: Scalars['String']['input'];
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationUpdateServiceArgs = {
  input: UpdateServiceInput;
};


export type MutationUpdateStoreArgs = {
  input: UpdateStoreInput;
};


export type MutationUpdateSubscriptionCardArgs = {
  cardToken: Scalars['String']['input'];
};


export type MutationUpdateSuperadminPermissionsArgs = {
  id: Scalars['String']['input'];
  permissions: Scalars['String']['input'];
};


export type MutationUpdateVendorPlanArgs = {
  durationMonths?: Scalars['Int']['input'];
  id: Scalars['String']['input'];
  plan: VendorPlan;
};


export type MutationUpdateVendorProfileArgs = {
  currentPassword?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  newPassword?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUploadFromUrlArgs = {
  folder?: InputMaybe<Scalars['String']['input']>;
  url: Scalars['String']['input'];
};


export type MutationUploadImageArgs = {
  base64: Scalars['String']['input'];
  folder?: InputMaybe<Scalars['String']['input']>;
};


export type MutationValidateDocumentPhotoArgs = {
  imageUrl: Scalars['String']['input'];
};


export type MutationValidateFacePhotoArgs = {
  imageUrl: Scalars['String']['input'];
};


export type MutationValidateRegistrationArgs = {
  cpf: Scalars['String']['input'];
  email: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  userType?: Scalars['String']['input'];
};


export type MutationVendorCancelAppointmentArgs = {
  id: Scalars['String']['input'];
};


export type MutationVendorCancelOrderArgs = {
  orderId: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};


export type MutationVendorConfirmPickupArgs = {
  orderId: Scalars['String']['input'];
};


export type MutationVerifyCodeArgs = {
  input: VerifyCodeInput;
};

export type NotificationLog = {
  __typename?: 'NotificationLog';
  createdAt: Scalars['DateTime']['output'];
  error?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  retryCount: Scalars['Float']['output'];
  subject: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  to: Scalars['String']['output'];
  type: Scalars['String']['output'];
  userName: Scalars['String']['output'];
  vendorId?: Maybe<Scalars['String']['output']>;
};

export type Order = {
  __typename?: 'Order';
  capturedAt?: Maybe<Scalars['DateTime']['output']>;
  checkoutUrl?: Maybe<Scalars['String']['output']>;
  commissionAmount?: Maybe<Scalars['Float']['output']>;
  commissionPercent?: Maybe<Scalars['Float']['output']>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  coupon?: Maybe<Coupon>;
  couponCode?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  customer: AppUser;
  customerConfirmedAt?: Maybe<Scalars['DateTime']['output']>;
  delivererConfirmedDeliveryAt?: Maybe<Scalars['DateTime']['output']>;
  delivery?: Maybe<Delivery>;
  deliveryAddress?: Maybe<Scalars['String']['output']>;
  deliveryFee: Scalars['Float']['output'];
  deliveryLatitude?: Maybe<Scalars['Float']['output']>;
  deliveryLongitude?: Maybe<Scalars['Float']['output']>;
  discount?: Maybe<Scalars['Float']['output']>;
  disputeReason?: Maybe<Scalars['String']['output']>;
  disputeResolution?: Maybe<Scalars['String']['output']>;
  disputeResolvedAt?: Maybe<Scalars['DateTime']['output']>;
  disputedAt?: Maybe<Scalars['DateTime']['output']>;
  estimatedDeliveryEta?: Maybe<Scalars['DateTime']['output']>;
  estimatedPickupEta?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isPickup: Scalars['Boolean']['output'];
  isSettled: Scalars['Boolean']['output'];
  items: Array<OrderItem>;
  mpPreferenceId?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  orderNumber: Scalars['String']['output'];
  paymentMethod?: Maybe<Scalars['String']['output']>;
  pixQrCode?: Maybe<Scalars['String']['output']>;
  pixQrCodeBase64?: Maybe<Scalars['String']['output']>;
  preAuthChargeId?: Maybe<Scalars['String']['output']>;
  rejectedAt?: Maybe<Scalars['DateTime']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  status: OrderStatus;
  store: Store;
  subtotal: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  vendorConfirmedPickupAt?: Maybe<Scalars['DateTime']['output']>;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  order: Order;
  product?: Maybe<Product>;
  quantity: Scalars['Int']['output'];
  totalPrice: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
  weightGrams?: Maybe<Scalars['Int']['output']>;
};

export type OrderItemInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  weightGrams?: InputMaybe<Scalars['Int']['input']>;
};

export enum OrderStatus {
  Accepted = 'ACCEPTED',
  AwaitingPayment = 'AWAITING_PAYMENT',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Delivered = 'DELIVERED',
  DelivererConfirmedDelivery = 'DELIVERER_CONFIRMED_DELIVERY',
  Delivering = 'DELIVERING',
  Disputed = 'DISPUTED',
  Expired = 'EXPIRED',
  PaymentReview = 'PAYMENT_REVIEW',
  Pending = 'PENDING',
  PickedUp = 'PICKED_UP',
  Preparing = 'PREPARING',
  Ready = 'READY',
  Rejected = 'REJECTED',
  VendorConfirmedPickup = 'VENDOR_CONFIRMED_PICKUP'
}

export type Payment = {
  __typename?: 'Payment';
  amount: Scalars['Float']['output'];
  appUser?: Maybe<AppUser>;
  checkoutUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['String']['output']>;
  mpPaymentId?: Maybe<Scalars['String']['output']>;
  mpPreferenceId?: Maybe<Scalars['String']['output']>;
  pagarmeInvoiceId?: Maybe<Scalars['String']['output']>;
  pagarmeOrderId?: Maybe<Scalars['String']['output']>;
  pagarmeSubscriptionId?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  type: Scalars['String']['output'];
  vendorUser?: Maybe<VendorUser>;
};

export type PhotoValidation = {
  __typename?: 'PhotoValidation';
  message: Scalars['String']['output'];
  valid: Scalars['Boolean']['output'];
};

export type PlanInfo = {
  __typename?: 'PlanInfo';
  annualPrice: Scalars['Float']['output'];
  canUseCoupons: Scalars['Boolean']['output'];
  commissionPercent: Scalars['Float']['output'];
  freePromosPerWeek: Scalars['Int']['output'];
  hasAnalytics: Scalars['Boolean']['output'];
  highlightDaysPerMonth: Scalars['Int']['output'];
  isContactSales: Scalars['Boolean']['output'];
  listingPriority: Scalars['Int']['output'];
  maxEmailsPerMonth: Scalars['Int']['output'];
  maxProductsPerStore: Scalars['Int']['output'];
  maxStores: Scalars['Int']['output'];
  monthlyPrice: Scalars['Float']['output'];
  plan: VendorPlan;
  quarterlyPrice: Scalars['Float']['output'];
  semiannualPrice: Scalars['Float']['output'];
  supportLevel: Scalars['String']['output'];
};

export type PlatformConfig = {
  __typename?: 'PlatformConfig';
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  value: Scalars['String']['output'];
};

export type PopularProduct = {
  __typename?: 'PopularProduct';
  categoryId?: Maybe<Scalars['String']['output']>;
  categoryName?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isAvailable: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  promotionalPrice?: Maybe<Scalars['Float']['output']>;
  storeId: Scalars['String']['output'];
  storeIsOpen: Scalars['Boolean']['output'];
  storeLogoUrl?: Maybe<Scalars['String']['output']>;
  storeName: Scalars['String']['output'];
  totalSold: Scalars['Int']['output'];
  unit?: Maybe<Scalars['String']['output']>;
};

export type Product = {
  __typename?: 'Product';
  barcode?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Category>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isAvailable: Scalars['Boolean']['output'];
  isVariableWeight: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  promotionalPrice?: Maybe<Scalars['Float']['output']>;
  stock: Scalars['Float']['output'];
  store: Store;
  unit?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductDeletedPayload = {
  __typename?: 'ProductDeletedPayload';
  id: Scalars['ID']['output'];
  storeId?: Maybe<Scalars['String']['output']>;
};

export type Promotion = {
  __typename?: 'Promotion';
  adCost: Scalars['Float']['output'];
  checkoutUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isPaid: Scalars['Boolean']['output'];
  price?: Maybe<Scalars['Float']['output']>;
  product?: Maybe<Product>;
  promotionalPrice: Scalars['Float']['output'];
  startDate: Scalars['DateTime']['output'];
  store: Store;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  activePromotions: Array<Promotion>;
  allAppUsers: Array<AppUser>;
  allCoupons: Array<Coupon>;
  allDeliveries: Array<Delivery>;
  allOrders: Array<Order>;
  allPayments: Array<Payment>;
  allPromotions: Array<Promotion>;
  allServicesByStore: Array<Service>;
  allStores: Array<Store>;
  allVendorUsers: Array<VendorUser>;
  appointment: Appointment;
  approvalLogs: Array<ApprovalLog>;
  availableDeliveries: Array<Order>;
  availablePlans: Array<PlanInfo>;
  availableSlots: Array<Scalars['String']['output']>;
  averageStoreRating: Scalars['Float']['output'];
  badgeConfig: Scalars['String']['output'];
  calculateDeliveryFee: Scalars['Float']['output'];
  categoriesByStore: Array<Category>;
  contractContent: Scalars['String']['output'];
  contractUpdatedAt?: Maybe<Scalars['String']['output']>;
  dashboardStats: DashboardStats;
  deletedProductsByStore: Array<Product>;
  deliveryBasePrice: Scalars['Float']['output'];
  deliveryCommissionPercent: Scalars['Float']['output'];
  deliveryPricePerKm: Scalars['Float']['output'];
  disputedOrders: Array<Order>;
  estimatedDeliveryTime: Scalars['Float']['output'];
  followedStores: Array<Store>;
  followerCount: Scalars['Int']['output'];
  frequentStores: Array<FrequentStore>;
  isFollowingStore: Scalars['Boolean']['output'];
  lookupBarcode: BarcodeLookupResult;
  meApp: AppUser;
  meVendor: VendorUser;
  minimumOrderPlatform: Scalars['Float']['output'];
  myAddresses: Array<Address>;
  myAppointments: Array<Appointment>;
  myBalance: RecipientBalance;
  myCards: Array<SavedCard>;
  myCart: Array<CartItem>;
  myCartByStore: Array<CartItem>;
  myDeliveries: Array<Delivery>;
  myOrders: Array<Order>;
  myPayments: Array<Payment>;
  myPromotions: Array<Promotion>;
  myStores: Array<Store>;
  mySubscription?: Maybe<VendorSubscription>;
  nearbyStores: Array<Store>;
  notificationLogs: Array<NotificationLog>;
  onlineDeliverersCount: Scalars['Int']['output'];
  order: Order;
  pendingAppApprovals: Array<AppUser>;
  pendingVendorApprovals: Array<VendorUser>;
  platformConfigs: Array<PlatformConfig>;
  popularProducts: Array<PopularProduct>;
  product: Product;
  productsByStore: Array<Product>;
  productsByStoreAll: Array<Product>;
  promoPricePerDay: Scalars['Float']['output'];
  ratingForAppointment?: Maybe<ServiceRating>;
  reorderSuggestions: Array<ReorderProduct>;
  searchCatalog: Array<Product>;
  searchProductImages: Array<Scalars['String']['output']>;
  searchProducts: Array<Product>;
  searchServices: Array<Service>;
  service: Service;
  serviceRatings: Array<ServiceRating>;
  servicesByStore: Array<Service>;
  simulateAnticipation: AnticipationSimulation;
  store: Store;
  storeAppointments: Array<Appointment>;
  storeCartSummary: Array<CartProductSummary>;
  storeCoupons: Array<Coupon>;
  storeOrders: Array<Order>;
  storeSchedule: Array<Schedule>;
  stores: Array<Store>;
  topStoresWeekly: Array<WeeklyTopStore>;
  validateCoupon: CouponValidation;
};


export type QueryAllPaymentsArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryAllServicesByStoreArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryAppointmentArgs = {
  id: Scalars['String']['input'];
};


export type QueryAvailableSlotsArgs = {
  date: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
  storeId: Scalars['String']['input'];
};


export type QueryAverageStoreRatingArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryCalculateDeliveryFeeArgs = {
  customerLatitude: Scalars['Float']['input'];
  customerLongitude: Scalars['Float']['input'];
  storeId: Scalars['String']['input'];
};


export type QueryCategoriesByStoreArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryContractContentArgs = {
  type: Scalars['String']['input'];
};


export type QueryContractUpdatedAtArgs = {
  type: Scalars['String']['input'];
};


export type QueryDeletedProductsByStoreArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryEstimatedDeliveryTimeArgs = {
  customerLatitude: Scalars['Float']['input'];
  customerLongitude: Scalars['Float']['input'];
  storeId: Scalars['String']['input'];
};


export type QueryFollowerCountArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryFrequentStoresArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryIsFollowingStoreArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryLookupBarcodeArgs = {
  barcode: Scalars['String']['input'];
};


export type QueryMyCartByStoreArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryNearbyStoresArgs = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  radiusKm?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryOrderArgs = {
  id: Scalars['String']['input'];
};


export type QueryPopularProductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProductArgs = {
  id: Scalars['String']['input'];
};


export type QueryProductsByStoreArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryProductsByStoreAllArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryRatingForAppointmentArgs = {
  appointmentId: Scalars['String']['input'];
};


export type QueryReorderSuggestionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySearchCatalogArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QuerySearchProductImagesArgs = {
  query: Scalars['String']['input'];
};


export type QuerySearchProductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QuerySearchServicesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QueryServiceArgs = {
  id: Scalars['String']['input'];
};


export type QueryServiceRatingsArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryServicesByStoreArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryStoreArgs = {
  id: Scalars['String']['input'];
};


export type QueryStoreAppointmentsArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<AppointmentStatus>;
  storeId: Scalars['String']['input'];
};


export type QueryStoreCartSummaryArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryStoreCouponsArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryStoreOrdersArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryStoreScheduleArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryTopStoresWeeklyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryValidateCouponArgs = {
  code: Scalars['String']['input'];
  storeId: Scalars['String']['input'];
  subtotal: Scalars['Float']['input'];
};

export type RecentOrder = {
  __typename?: 'RecentOrder';
  createdAt: Scalars['DateTime']['output'];
  customerName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  orderNumber: Scalars['String']['output'];
  status: Scalars['String']['output'];
  storeName: Scalars['String']['output'];
  total: Scalars['Float']['output'];
};

export type RecipientBalance = {
  __typename?: 'RecipientBalance';
  autoAnticipationEnabled: Scalars['Boolean']['output'];
  availableAmount: Scalars['Float']['output'];
  transferredAmount: Scalars['Float']['output'];
  waitingFundsAmount: Scalars['Float']['output'];
};

export type RegisterAppInput = {
  cpf: Scalars['String']['input'];
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type RegisterDelivererInput = {
  birthDate: Scalars['String']['input'];
  cnhNumber?: InputMaybe<Scalars['String']['input']>;
  identityPhotoBackUrl?: InputMaybe<Scalars['String']['input']>;
  identityPhotoUrl?: InputMaybe<Scalars['String']['input']>;
  profilePhotoUrl?: InputMaybe<Scalars['String']['input']>;
  vehiclePlate?: InputMaybe<Scalars['String']['input']>;
  vehicleType: Scalars['String']['input'];
};

export type RegisterVendorInput = {
  cpf: Scalars['String']['input'];
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type ReorderProduct = {
  __typename?: 'ReorderProduct';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isAvailable: Scalars['Boolean']['output'];
  lastOrderedAt: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  promotionalPrice?: Maybe<Scalars['Float']['output']>;
  storeId: Scalars['String']['output'];
  storeIsOpen: Scalars['Boolean']['output'];
  storeLogoUrl?: Maybe<Scalars['String']['output']>;
  storeName: Scalars['String']['output'];
};

export type RequestQuoteInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  serviceId: Scalars['String']['input'];
  storeId: Scalars['String']['input'];
};

export type RoleCount = {
  __typename?: 'RoleCount';
  count: Scalars['Int']['output'];
  role: Scalars['String']['output'];
};

export type SavedCard = {
  __typename?: 'SavedCard';
  brand: Scalars['String']['output'];
  expMonth: Scalars['Int']['output'];
  expYear: Scalars['Int']['output'];
  holderName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastFourDigits: Scalars['String']['output'];
};

export type Schedule = {
  __typename?: 'Schedule';
  dayOfWeek: Scalars['Int']['output'];
  endTime: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  startTime: Scalars['String']['output'];
  store: Store;
};

export type ScheduleEntryInput = {
  dayOfWeek: Scalars['Int']['input'];
  endTime: Scalars['String']['input'];
  isActive?: Scalars['Boolean']['input'];
  startTime: Scalars['String']['input'];
};

export type SendCodeInput = {
  channel: Scalars['String']['input'];
  fallbackEmail?: InputMaybe<Scalars['String']['input']>;
  value: Scalars['String']['input'];
};

export type Service = {
  __typename?: 'Service';
  category?: Maybe<Category>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  estimatedDuration: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isAvailable: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  price?: Maybe<Scalars['Float']['output']>;
  requiresQuote: Scalars['Boolean']['output'];
  store: Store;
  updatedAt: Scalars['DateTime']['output'];
};

export type ServiceRating = {
  __typename?: 'ServiceRating';
  appointment: Appointment;
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  customer: AppUser;
  id: Scalars['ID']['output'];
  photoUrls?: Maybe<Array<Scalars['String']['output']>>;
  rating: Scalars['Int']['output'];
  service: Service;
  store: Store;
};

export type SessionKickedPayload = {
  __typename?: 'SessionKickedPayload';
  userId: Scalars['String']['output'];
  userType: Scalars['String']['output'];
};

export type SetScheduleInput = {
  entries: Array<ScheduleEntryInput>;
  storeId: Scalars['String']['input'];
};

export type StatusCount = {
  __typename?: 'StatusCount';
  count: Scalars['Int']['output'];
  status: Scalars['String']['output'];
};

export type Store = {
  __typename?: 'Store';
  badgeClaimCount: Scalars['Int']['output'];
  bannerUrl?: Maybe<Scalars['String']['output']>;
  categories?: Maybe<Array<Category>>;
  city: Scalars['String']['output'];
  commissionReductionExpiresAt?: Maybe<Scalars['DateTime']['output']>;
  commissionReductionPercent: Scalars['Float']['output'];
  complement?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deliveryEndTime?: Maybe<Scalars['String']['output']>;
  deliveryFee: Scalars['Float']['output'];
  deliveryStartTime?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  estimatedDeliveryMinutes: Scalars['Float']['output'];
  freeDelivery: Scalars['Boolean']['output'];
  freeDeliveryAbove?: Maybe<Scalars['Float']['output']>;
  freePromoDaysCredit: Scalars['Int']['output'];
  hasOwnDelivery: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isOpen: Scalars['Boolean']['output'];
  lastClaimedScore: Scalars['Int']['output'];
  latitude: Scalars['Float']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  longitude: Scalars['Float']['output'];
  minimumOrder: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  neighborhood: Scalars['String']['output'];
  number: Scalars['String']['output'];
  owner: VendorUser;
  ownerPaymentConnected: Scalars['Boolean']['output'];
  phone: Scalars['String']['output'];
  products?: Maybe<Array<Product>>;
  services?: Maybe<Array<Service>>;
  state: Scalars['String']['output'];
  storeType: StoreType;
  street: Scalars['String']['output'];
  totalProducts: Scalars['Int']['output'];
  totalSales: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  verificationLevel: VerificationLevel;
  verificationScore: Scalars['Int']['output'];
  zipCode: Scalars['String']['output'];
};

export enum StoreType {
  Products = 'PRODUCTS',
  Services = 'SERVICES'
}

export type Subscription = {
  __typename?: 'Subscription';
  deliveryUpdated: Delivery;
  orderCreated: Order;
  orderUpdated: Order;
  productDeleted: ProductDeletedPayload;
  productUpdated: Product;
  promotionUpdated: Promotion;
  sessionKicked: SessionKickedPayload;
  storeUpdated: Store;
};


export type SubscriptionDeliveryUpdatedArgs = {
  orderId?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionOrderCreatedArgs = {
  storeId?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionOrderUpdatedArgs = {
  orderId?: InputMaybe<Scalars['String']['input']>;
  storeId?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionProductDeletedArgs = {
  storeId?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionProductUpdatedArgs = {
  storeId?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionSessionKickedArgs = {
  userId: Scalars['String']['input'];
  userType?: Scalars['String']['input'];
};


export type SubscriptionStoreUpdatedArgs = {
  storeId?: InputMaybe<Scalars['String']['input']>;
};

export type TopStore = {
  __typename?: 'TopStore';
  orderCount: Scalars['Int']['output'];
  revenue: Scalars['Float']['output'];
  storeId: Scalars['String']['output'];
  storeName: Scalars['String']['output'];
};

export type UpdateAddressInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  complement?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  neighborhood?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCartItemInput = {
  cartItemId: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  weightGrams?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateCouponInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  discountType?: InputMaybe<Scalars['String']['input']>;
  discountValue?: InputMaybe<Scalars['Float']['input']>;
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['String']['input'];
  maxDiscount?: InputMaybe<Scalars['Float']['input']>;
  maxUses?: InputMaybe<Scalars['Int']['input']>;
  minimumOrder?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateProductInput = {
  barcode?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isVariableWeight?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  stock?: InputMaybe<Scalars['Float']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateServiceInput = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  estimatedDuration?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['String']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  requiresQuote?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateStoreInput = {
  bannerUrl?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  complement?: InputMaybe<Scalars['String']['input']>;
  deliveryEndTime?: InputMaybe<Scalars['String']['input']>;
  deliveryFee?: InputMaybe<Scalars['Float']['input']>;
  deliveryStartTime?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  estimatedDeliveryMinutes?: InputMaybe<Scalars['Float']['input']>;
  freeDelivery?: InputMaybe<Scalars['Boolean']['input']>;
  freeDeliveryAbove?: InputMaybe<Scalars['Float']['input']>;
  hasOwnDelivery?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['String']['input'];
  latitude?: InputMaybe<Scalars['Float']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  minimumOrder?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  neighborhood?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  storeType?: InputMaybe<StoreType>;
  street?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export enum UserRole {
  Admin = 'ADMIN',
  Customer = 'CUSTOMER',
  Deliverer = 'DELIVERER',
  Superadmin = 'SUPERADMIN',
  Vendor = 'VENDOR'
}

export type ValidationResult = {
  __typename?: 'ValidationResult';
  cpfError?: Maybe<Scalars['String']['output']>;
  emailError?: Maybe<Scalars['String']['output']>;
  phoneError?: Maybe<Scalars['String']['output']>;
  valid: Scalars['Boolean']['output'];
};

export type VendorAuthResponse = {
  __typename?: 'VendorAuthResponse';
  accessToken: Scalars['String']['output'];
  user: VendorUser;
};

export enum VendorPlan {
  Custom = 'CUSTOM',
  Enterprise = 'ENTERPRISE',
  Free = 'FREE',
  Premium = 'PREMIUM',
  Pro = 'PRO'
}

export type VendorSubscription = {
  __typename?: 'VendorSubscription';
  amount: Scalars['Float']['output'];
  billingPeriod: Scalars['String']['output'];
  cancelAtPeriodEnd: Scalars['Boolean']['output'];
  canceledAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currentPeriodEnd?: Maybe<Scalars['DateTime']['output']>;
  currentPeriodStart?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  installments: Scalars['Int']['output'];
  metadata?: Maybe<Scalars['String']['output']>;
  pagarmeSubscriptionId: Scalars['String']['output'];
  plan: VendorPlan;
  status: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  vendorUser: VendorUser;
};

export type VendorUser = {
  __typename?: 'VendorUser';
  acceptedSubscriptionTermsAt?: Maybe<Scalars['DateTime']['output']>;
  acceptedTermsAt?: Maybe<Scalars['DateTime']['output']>;
  approvedAt?: Maybe<Scalars['DateTime']['output']>;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  cpf?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  googleId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  pagarmeCustomerId?: Maybe<Scalars['String']['output']>;
  pagarmeRecipientId?: Maybe<Scalars['String']['output']>;
  pagarmeSubscriptionId?: Maybe<Scalars['String']['output']>;
  paymentConnected: Scalars['Boolean']['output'];
  pendingRole?: Maybe<Scalars['String']['output']>;
  phone: Scalars['String']['output'];
  phoneVerified: Scalars['Boolean']['output'];
  planExpiresAt?: Maybe<Scalars['DateTime']['output']>;
  rejectedAt?: Maybe<Scalars['DateTime']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  stores?: Maybe<Array<Store>>;
  updatedAt: Scalars['DateTime']['output'];
  vendorPlan?: Maybe<VendorPlan>;
};

export enum VerificationLevel {
  Bronze = 'BRONZE',
  Diamond = 'DIAMOND',
  Gold = 'GOLD',
  None = 'NONE',
  Silver = 'SILVER'
}

export type VerifyCodeInput = {
  channel: Scalars['String']['input'];
  code: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type WeeklyTopStore = {
  __typename?: 'WeeklyTopStore';
  bannerUrl?: Maybe<Scalars['String']['output']>;
  deliveryFee: Scalars['Float']['output'];
  description?: Maybe<Scalars['String']['output']>;
  freeDelivery: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isOpen: Scalars['Boolean']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  orderCount: Scalars['Int']['output'];
  totalRevenue: Scalars['Float']['output'];
  verificationLevel?: Maybe<Scalars['String']['output']>;
};

export type DisputedOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type DisputedOrdersQuery = { __typename?: 'Query', disputedOrders: Array<{ __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, total: number, subtotal: number, deliveryFee: number, disputeReason?: string | null, deliveryAddress?: string | null, createdAt: any, customer: { __typename?: 'AppUser', id: string, name: string, email: string, phone: string }, store: { __typename?: 'Store', id: string, name: string }, items: Array<{ __typename?: 'OrderItem', id: string, quantity: number, totalPrice: number, product?: { __typename?: 'Product', name: string, price: number } | null }> }> };

export type ResolveDisputeMutationVariables = Exact<{
  orderId: Scalars['String']['input'];
  resolution: Scalars['String']['input'];
}>;


export type ResolveDisputeMutation = { __typename?: 'Mutation', resolveDispute: { __typename?: 'Order', id: string, status: OrderStatus } };

export type LoginAppMutationVariables = Exact<{
  input: LoginInput;
  forceLogin?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type LoginAppMutation = { __typename?: 'Mutation', loginApp: { __typename?: 'AppAuthResponse', accessToken: string, user: { __typename?: 'AppUser', id: string, name: string, email: string, role: UserRole } } };

export type DashboardStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardStatsQuery = { __typename?: 'Query', dashboardStats: { __typename?: 'DashboardStats', totalUsers: number, totalStores: number, totalOrders: number, totalRevenue: number, platformRevenue: number, pendingApprovals: number, totalDeliveries: number, activeDeliveries: number, completedDeliveries: number, onlineDeliverers: number, avgTicket: number, cancellationRate: number, totalAppointments: number, appointmentRevenue: number, usersByRole: Array<{ __typename?: 'RoleCount', role: string, count: number }>, ordersByStatus: Array<{ __typename?: 'StatusCount', status: string, count: number }>, ordersByDay: Array<{ __typename?: 'DayStats', date: string, count: number, revenue: number }>, topStores: Array<{ __typename?: 'TopStore', storeId: string, storeName: string, orderCount: number, revenue: number }>, recentOrders: Array<{ __typename?: 'RecentOrder', id: string, orderNumber: string, status: string, total: number, customerName: string, storeName: string, createdAt: any }> } };

export type AllAppUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllAppUsersQuery = { __typename?: 'Query', allAppUsers: Array<{ __typename?: 'AppUser', id: string, name: string, email: string, phone: string, role: UserRole, isActive: boolean, createdAt: any, pendingRole?: string | null, cpf?: string | null, vehicleType?: string | null, vehiclePlate?: string | null, identityPhotoUrl?: string | null, identityPhotoBackUrl?: string | null, profilePhotoUrl?: string | null, approvedAt?: any | null, rejectedAt?: any | null, rejectionReason?: string | null, paymentConnected: boolean, permissions?: string | null, notificationEmail?: string | null }> };

export type AllVendorUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllVendorUsersQuery = { __typename?: 'Query', allVendorUsers: Array<{ __typename?: 'VendorUser', id: string, name: string, email: string, phone: string, role: UserRole, isActive: boolean, createdAt: any, pendingRole?: string | null, cpf?: string | null, approvedAt?: any | null, rejectedAt?: any | null, rejectionReason?: string | null, vendorPlan?: VendorPlan | null, planExpiresAt?: any | null, paymentConnected: boolean, stores?: Array<{ __typename?: 'Store', id: string, name: string }> | null }> };

export type UpdateAppUserRoleMutationVariables = Exact<{
  id: Scalars['String']['input'];
  role: UserRole;
}>;


export type UpdateAppUserRoleMutation = { __typename?: 'Mutation', updateAppUserRole: { __typename?: 'AppUser', id: string, role: UserRole } };

export type ToggleAppUserActiveMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ToggleAppUserActiveMutation = { __typename?: 'Mutation', toggleAppUserActive: { __typename?: 'AppUser', id: string, isActive: boolean } };

export type ToggleVendorUserActiveMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ToggleVendorUserActiveMutation = { __typename?: 'Mutation', toggleVendorUserActive: { __typename?: 'VendorUser', id: string, isActive: boolean } };

export type AllStoresQueryVariables = Exact<{ [key: string]: never; }>;


export type AllStoresQuery = { __typename?: 'Query', allStores: Array<{ __typename?: 'Store', id: string, name: string, description?: string | null, phone: string, city: string, state: string, isOpen: boolean, isActive: boolean, hasOwnDelivery: boolean, freeDelivery: boolean, deliveryFee: number, estimatedDeliveryMinutes: number, deliveryStartTime?: string | null, deliveryEndTime?: string | null, freeDeliveryAbove?: number | null, minimumOrder: number, street: string, number: string, neighborhood: string, zipCode: string, createdAt: any, verificationLevel: VerificationLevel, verificationScore: number, totalSales: number, totalProducts: number, owner: { __typename?: 'VendorUser', id: string, name: string, email: string, vendorPlan?: VendorPlan | null }, products?: Array<{ __typename?: 'Product', id: string }> | null, categories?: Array<{ __typename?: 'Category', id: string }> | null }> };

export type ToggleStoreActiveMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ToggleStoreActiveMutation = { __typename?: 'Mutation', toggleStoreActive: { __typename?: 'Store', id: string, isActive: boolean } };

export type RequestStoreDeleteMutationVariables = Exact<{
  storeId: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RequestStoreDeleteMutation = { __typename?: 'Mutation', requestStoreDelete: boolean };

export type SetStoreVerificationMutationVariables = Exact<{
  storeId: Scalars['String']['input'];
  level: VerificationLevel;
  score?: InputMaybe<Scalars['Float']['input']>;
}>;


export type SetStoreVerificationMutation = { __typename?: 'Mutation', setStoreVerification: { __typename?: 'Store', id: string, verificationLevel: VerificationLevel, verificationScore: number } };

export type PendingAppApprovalsQueryVariables = Exact<{ [key: string]: never; }>;


export type PendingAppApprovalsQuery = { __typename?: 'Query', pendingAppApprovals: Array<{ __typename?: 'AppUser', id: string, name: string, email: string, phone: string, role: UserRole, pendingRole?: string | null, cpf?: string | null, vehicleType?: string | null, vehiclePlate?: string | null, identityPhotoUrl?: string | null, identityPhotoBackUrl?: string | null, profilePhotoUrl?: string | null, createdAt: any }> };

export type PendingVendorApprovalsQueryVariables = Exact<{ [key: string]: never; }>;


export type PendingVendorApprovalsQuery = { __typename?: 'Query', pendingVendorApprovals: Array<{ __typename?: 'VendorUser', id: string, name: string, email: string, phone: string, role: UserRole, pendingRole?: string | null, cpf?: string | null, createdAt: any }> };

export type ApproveAppUserMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ApproveAppUserMutation = { __typename?: 'Mutation', approveAppUser: { __typename?: 'AppUser', id: string, role: UserRole, pendingRole?: string | null, approvedAt?: any | null } };

export type ApproveVendorUserMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ApproveVendorUserMutation = { __typename?: 'Mutation', approveVendorUser: { __typename?: 'VendorUser', id: string, role: UserRole, pendingRole?: string | null, approvedAt?: any | null } };

export type RejectAppUserMutationVariables = Exact<{
  id: Scalars['String']['input'];
  reason: Scalars['String']['input'];
}>;


export type RejectAppUserMutation = { __typename?: 'Mutation', rejectAppUser: { __typename?: 'AppUser', id: string, pendingRole?: string | null, rejectedAt?: any | null, rejectionReason?: string | null } };

export type RejectVendorUserMutationVariables = Exact<{
  id: Scalars['String']['input'];
  reason: Scalars['String']['input'];
}>;


export type RejectVendorUserMutation = { __typename?: 'Mutation', rejectVendorUser: { __typename?: 'VendorUser', id: string, pendingRole?: string | null, rejectedAt?: any | null, rejectionReason?: string | null } };

export type NotificationLogsQueryVariables = Exact<{ [key: string]: never; }>;


export type NotificationLogsQuery = { __typename?: 'Query', notificationLogs: Array<{ __typename?: 'NotificationLog', id: string, type: string, to: string, userName: string, subject: string, message: string, success: boolean, error?: string | null, createdAt: any }> };

export type ResendNotificationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ResendNotificationMutation = { __typename?: 'Mutation', resendNotification: boolean };

export type DeleteNotificationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteNotificationMutation = { __typename?: 'Mutation', deleteNotification: boolean };

export type ClearAllNotificationsMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearAllNotificationsMutation = { __typename?: 'Mutation', clearAllNotifications: boolean };

export type ApprovalLogsQueryVariables = Exact<{ [key: string]: never; }>;


export type ApprovalLogsQuery = { __typename?: 'Query', approvalLogs: Array<{ __typename?: 'ApprovalLog', id: string, userId: string, userName: string, userEmail: string, userType: string, action: string, role: string, reason?: string | null, createdAt: any, profilePhotoUrl?: string | null, identityPhotoUrl?: string | null, identityPhotoBackUrl?: string | null }> };

export type AllOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllOrdersQuery = { __typename?: 'Query', allOrders: Array<{ __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, total: number, subtotal: number, deliveryFee: number, paymentMethod?: string | null, isPickup: boolean, customerConfirmedAt?: any | null, deliveryAddress?: string | null, notes?: string | null, createdAt: any, customer: { __typename?: 'AppUser', id: string, name: string, email: string, phone: string }, store: { __typename?: 'Store', id: string, name: string }, items: Array<{ __typename?: 'OrderItem', id: string, quantity: number, totalPrice: number, product?: { __typename?: 'Product', name: string, price: number } | null }>, delivery?: { __typename?: 'Delivery', id: string, pickedUpAt?: any | null, deliveredAt?: any | null, deliverer?: { __typename?: 'AppUser', name: string, phone: string } | null } | null }> };

export type UpdateVendorPlanMutationVariables = Exact<{
  id: Scalars['String']['input'];
  plan: VendorPlan;
  durationMonths?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UpdateVendorPlanMutation = { __typename?: 'Mutation', updateVendorPlan: { __typename?: 'VendorUser', id: string, vendorPlan?: VendorPlan | null, planExpiresAt?: any | null } };

export type AvailablePlansQueryVariables = Exact<{ [key: string]: never; }>;


export type AvailablePlansQuery = { __typename?: 'Query', availablePlans: Array<{ __typename?: 'PlanInfo', plan: VendorPlan, maxStores: number, monthlyPrice: number, quarterlyPrice: number, semiannualPrice: number, annualPrice: number, commissionPercent: number, freePromosPerWeek: number, maxProductsPerStore: number, maxEmailsPerMonth: number, listingPriority: number, highlightDaysPerMonth: number, canUseCoupons: boolean, hasAnalytics: boolean, supportLevel: string, isContactSales: boolean }> };

export type UpdatePlanConfigMutationVariables = Exact<{
  plan: VendorPlan;
  maxStores: Scalars['Int']['input'];
  commissionPercent: Scalars['Float']['input'];
  monthlyPrice: Scalars['Float']['input'];
  quarterlyPrice: Scalars['Float']['input'];
  semiannualPrice: Scalars['Float']['input'];
  annualPrice: Scalars['Float']['input'];
  freePromosPerWeek: Scalars['Int']['input'];
  maxProductsPerStore: Scalars['Int']['input'];
  maxEmailsPerMonth: Scalars['Int']['input'];
  listingPriority: Scalars['Int']['input'];
  highlightDaysPerMonth: Scalars['Int']['input'];
  canUseCoupons: Scalars['Boolean']['input'];
  hasAnalytics: Scalars['Boolean']['input'];
  supportLevel: Scalars['String']['input'];
  isContactSales: Scalars['Boolean']['input'];
}>;


export type UpdatePlanConfigMutation = { __typename?: 'Mutation', updatePlanConfig: boolean };

export type AllPromotionsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllPromotionsQuery = { __typename?: 'Query', allPromotions: Array<{ __typename?: 'Promotion', id: string, title: string, description?: string | null, imageUrl?: string | null, startDate: any, endDate: any, isActive: boolean, isPaid: boolean, promotionalPrice: number, adCost: number, createdAt: any, store: { __typename?: 'Store', id: string, name: string, owner: { __typename?: 'VendorUser', id: string, name: string } }, product?: { __typename?: 'Product', id: string, name: string, imageUrl?: string | null, price: number } | null }> };

export type TogglePromotionActiveMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type TogglePromotionActiveMutation = { __typename?: 'Mutation', togglePromotionActive: { __typename?: 'Promotion', id: string, isActive: boolean } };

export type MarkPromotionPaidMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type MarkPromotionPaidMutation = { __typename?: 'Mutation', markPromotionPaid: { __typename?: 'Promotion', id: string, isPaid: boolean } };

export type PromoPricePerDayQueryVariables = Exact<{ [key: string]: never; }>;


export type PromoPricePerDayQuery = { __typename?: 'Query', promoPricePerDay: number };

export type SetPromoPricePerDayMutationVariables = Exact<{
  price: Scalars['Float']['input'];
}>;


export type SetPromoPricePerDayMutation = { __typename?: 'Mutation', setPromoPricePerDay: { __typename?: 'PlatformConfig', id: string, key: string, value: string } };

export type DeliveryPricesQueryVariables = Exact<{ [key: string]: never; }>;


export type DeliveryPricesQuery = { __typename?: 'Query', deliveryPricePerKm: number, deliveryBasePrice: number, deliveryCommissionPercent: number, minimumOrderPlatform: number };

export type SetMinimumOrderPlatformMutationVariables = Exact<{
  price: Scalars['Float']['input'];
}>;


export type SetMinimumOrderPlatformMutation = { __typename?: 'Mutation', setMinimumOrderPlatform: { __typename?: 'PlatformConfig', id: string, key: string, value: string } };

export type SetDeliveryPricePerKmMutationVariables = Exact<{
  price: Scalars['Float']['input'];
}>;


export type SetDeliveryPricePerKmMutation = { __typename?: 'Mutation', setDeliveryPricePerKm: { __typename?: 'PlatformConfig', id: string, key: string, value: string } };

export type SetDeliveryBasePriceMutationVariables = Exact<{
  price: Scalars['Float']['input'];
}>;


export type SetDeliveryBasePriceMutation = { __typename?: 'Mutation', setDeliveryBasePrice: { __typename?: 'PlatformConfig', id: string, key: string, value: string } };

export type SetDeliveryCommissionMutationVariables = Exact<{
  percent: Scalars['Float']['input'];
}>;


export type SetDeliveryCommissionMutation = { __typename?: 'Mutation', setDeliveryCommissionPercent: { __typename?: 'PlatformConfig', id: string, key: string, value: string } };

export type AllCouponsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllCouponsQuery = { __typename?: 'Query', allCoupons: Array<{ __typename?: 'Coupon', id: string, code: string, discountType: string, discountValue: number, minimumOrder?: number | null, maxDiscount?: number | null, maxUses: number, usesCount: number, isActive: boolean, expiresAt?: any | null, createdAt: any, store: { __typename?: 'Store', id: string, name: string, owner: { __typename?: 'VendorUser', id: string, name: string } } }> };

export type AdminToggleCouponMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type AdminToggleCouponMutation = { __typename?: 'Mutation', adminToggleCoupon: { __typename?: 'Coupon', id: string, isActive: boolean } };

export type AdminDeleteCouponMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type AdminDeleteCouponMutation = { __typename?: 'Mutation', adminDeleteCoupon: boolean };

export type ContractContentQueryVariables = Exact<{
  type: Scalars['String']['input'];
}>;


export type ContractContentQuery = { __typename?: 'Query', contractContent: string };

export type ContractUpdatedAtQueryVariables = Exact<{
  type: Scalars['String']['input'];
}>;


export type ContractUpdatedAtQuery = { __typename?: 'Query', contractUpdatedAt?: string | null };

export type UpdateContractContentMutationVariables = Exact<{
  type: Scalars['String']['input'];
  content: Scalars['String']['input'];
}>;


export type UpdateContractContentMutation = { __typename?: 'Mutation', updateContractContent: boolean };

export type AllDeliveriesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllDeliveriesQuery = { __typename?: 'Query', allDeliveries: Array<{ __typename?: 'Delivery', id: string, pickedUpAt?: any | null, deliveredAt?: any | null, createdAt: any, payoutStatus?: string | null, payoutAmount?: number | null, payoutMpId?: string | null, vendorPayoutStatus?: string | null, vendorPayoutAmount?: number | null, vendorPayoutMpId?: string | null, deliverer?: { __typename?: 'AppUser', id: string, name: string, phone: string } | null, order: { __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, total: number, deliveryFee: number, deliveryAddress?: string | null, store: { __typename?: 'Store', id: string, name: string, hasOwnDelivery: boolean }, customer: { __typename?: 'AppUser', id: string, name: string, phone: string } } }> };

export type BadgeConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type BadgeConfigQuery = { __typename?: 'Query', badgeConfig: string };

export type UpdateBadgeThresholdsMutationVariables = Exact<{
  thresholds: Scalars['String']['input'];
}>;


export type UpdateBadgeThresholdsMutation = { __typename?: 'Mutation', updateBadgeThresholds: boolean };

export type UpdateBadgePointsMutationVariables = Exact<{
  points: Scalars['String']['input'];
}>;


export type UpdateBadgePointsMutation = { __typename?: 'Mutation', updateBadgePoints: boolean };

export type UpdateBadgeRewardsMutationVariables = Exact<{
  level: Scalars['String']['input'];
  rewards: Scalars['String']['input'];
}>;


export type UpdateBadgeRewardsMutation = { __typename?: 'Mutation', updateBadgeRewards: boolean };

export type RegisterSuperadminMutationVariables = Exact<{
  name: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  permissions?: InputMaybe<Scalars['String']['input']>;
}>;


export type RegisterSuperadminMutation = { __typename?: 'Mutation', registerSuperadmin: { __typename?: 'AppUser', id: string, name: string, email: string, role: UserRole, permissions?: string | null } };

export type UpdateSuperadminPermissionsMutationVariables = Exact<{
  id: Scalars['String']['input'];
  permissions: Scalars['String']['input'];
}>;


export type UpdateSuperadminPermissionsMutation = { __typename?: 'Mutation', updateSuperadminPermissions: { __typename?: 'AppUser', id: string, name: string, email: string, permissions?: string | null } };

export type UpdateNotificationEmailMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type UpdateNotificationEmailMutation = { __typename?: 'Mutation', updateNotificationEmail: { __typename?: 'AppUser', id: string, notificationEmail?: string | null } };

export type AllPaymentsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllPaymentsQuery = { __typename?: 'Query', allPayments: Array<{ __typename?: 'Payment', id: string, type: string, description: string, amount: number, status: string, mpPaymentId?: string | null, checkoutUrl?: string | null, createdAt: any, appUser?: { __typename?: 'AppUser', id: string, name: string, email: string } | null, vendorUser?: { __typename?: 'VendorUser', id: string, name: string, email: string } | null }> };


export const DisputedOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DisputedOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disputedOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryFee"}},{"kind":"Field","name":{"kind":"Name","value":"disputeReason"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DisputedOrdersQuery, DisputedOrdersQueryVariables>;
export const ResolveDisputeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResolveDispute"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resolution"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resolveDispute"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"resolution"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resolution"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<ResolveDisputeMutation, ResolveDisputeMutationVariables>;
export const LoginAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"forceLogin"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginApp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"forceLogin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"forceLogin"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<LoginAppMutation, LoginAppMutationVariables>;
export const DashboardStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DashboardStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dashboardStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalUsers"}},{"kind":"Field","name":{"kind":"Name","value":"totalStores"}},{"kind":"Field","name":{"kind":"Name","value":"totalOrders"}},{"kind":"Field","name":{"kind":"Name","value":"totalRevenue"}},{"kind":"Field","name":{"kind":"Name","value":"platformRevenue"}},{"kind":"Field","name":{"kind":"Name","value":"usersByRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ordersByStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pendingApprovals"}},{"kind":"Field","name":{"kind":"Name","value":"totalDeliveries"}},{"kind":"Field","name":{"kind":"Name","value":"activeDeliveries"}},{"kind":"Field","name":{"kind":"Name","value":"completedDeliveries"}},{"kind":"Field","name":{"kind":"Name","value":"onlineDeliverers"}},{"kind":"Field","name":{"kind":"Name","value":"ordersByDay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"topStores"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"storeName"}},{"kind":"Field","name":{"kind":"Name","value":"orderCount"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recentOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"customerName"}},{"kind":"Field","name":{"kind":"Name","value":"storeName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"avgTicket"}},{"kind":"Field","name":{"kind":"Name","value":"cancellationRate"}},{"kind":"Field","name":{"kind":"Name","value":"totalAppointments"}},{"kind":"Field","name":{"kind":"Name","value":"appointmentRevenue"}}]}}]}}]} as unknown as DocumentNode<DashboardStatsQuery, DashboardStatsQueryVariables>;
export const AllAppUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllAppUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allAppUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"pendingRole"}},{"kind":"Field","name":{"kind":"Name","value":"cpf"}},{"kind":"Field","name":{"kind":"Name","value":"vehicleType"}},{"kind":"Field","name":{"kind":"Name","value":"vehiclePlate"}},{"kind":"Field","name":{"kind":"Name","value":"identityPhotoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"identityPhotoBackUrl"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhotoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}},{"kind":"Field","name":{"kind":"Name","value":"paymentConnected"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"notificationEmail"}}]}}]}}]} as unknown as DocumentNode<AllAppUsersQuery, AllAppUsersQueryVariables>;
export const AllVendorUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllVendorUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allVendorUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"pendingRole"}},{"kind":"Field","name":{"kind":"Name","value":"cpf"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}},{"kind":"Field","name":{"kind":"Name","value":"vendorPlan"}},{"kind":"Field","name":{"kind":"Name","value":"planExpiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"paymentConnected"}},{"kind":"Field","name":{"kind":"Name","value":"stores"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<AllVendorUsersQuery, AllVendorUsersQueryVariables>;
export const UpdateAppUserRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAppUserRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserRole"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAppUserRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<UpdateAppUserRoleMutation, UpdateAppUserRoleMutationVariables>;
export const ToggleAppUserActiveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleAppUserActive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleAppUserActive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<ToggleAppUserActiveMutation, ToggleAppUserActiveMutationVariables>;
export const ToggleVendorUserActiveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleVendorUserActive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleVendorUserActive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<ToggleVendorUserActiveMutation, ToggleVendorUserActiveMutationVariables>;
export const AllStoresDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllStores"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allStores"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"isOpen"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"hasOwnDelivery"}},{"kind":"Field","name":{"kind":"Name","value":"freeDelivery"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryFee"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDeliveryMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"freeDeliveryAbove"}},{"kind":"Field","name":{"kind":"Name","value":"minimumOrder"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"neighborhood"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"verificationLevel"}},{"kind":"Field","name":{"kind":"Name","value":"verificationScore"}},{"kind":"Field","name":{"kind":"Name","value":"totalSales"}},{"kind":"Field","name":{"kind":"Name","value":"totalProducts"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"vendorPlan"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<AllStoresQuery, AllStoresQueryVariables>;
export const ToggleStoreActiveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleStoreActive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleStoreActive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<ToggleStoreActiveMutation, ToggleStoreActiveMutationVariables>;
export const RequestStoreDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestStoreDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestStoreDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"storeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}]}}]} as unknown as DocumentNode<RequestStoreDeleteMutation, RequestStoreDeleteMutationVariables>;
export const SetStoreVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetStoreVerification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"level"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerificationLevel"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"score"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setStoreVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"storeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}}},{"kind":"Argument","name":{"kind":"Name","value":"level"},"value":{"kind":"Variable","name":{"kind":"Name","value":"level"}}},{"kind":"Argument","name":{"kind":"Name","value":"score"},"value":{"kind":"Variable","name":{"kind":"Name","value":"score"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"verificationLevel"}},{"kind":"Field","name":{"kind":"Name","value":"verificationScore"}}]}}]}}]} as unknown as DocumentNode<SetStoreVerificationMutation, SetStoreVerificationMutationVariables>;
export const PendingAppApprovalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PendingAppApprovals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pendingAppApprovals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"pendingRole"}},{"kind":"Field","name":{"kind":"Name","value":"cpf"}},{"kind":"Field","name":{"kind":"Name","value":"vehicleType"}},{"kind":"Field","name":{"kind":"Name","value":"vehiclePlate"}},{"kind":"Field","name":{"kind":"Name","value":"identityPhotoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"identityPhotoBackUrl"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhotoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<PendingAppApprovalsQuery, PendingAppApprovalsQueryVariables>;
export const PendingVendorApprovalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PendingVendorApprovals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pendingVendorApprovals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"pendingRole"}},{"kind":"Field","name":{"kind":"Name","value":"cpf"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<PendingVendorApprovalsQuery, PendingVendorApprovalsQueryVariables>;
export const ApproveAppUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApproveAppUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"approveAppUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"pendingRole"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}}]}}]}}]} as unknown as DocumentNode<ApproveAppUserMutation, ApproveAppUserMutationVariables>;
export const ApproveVendorUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApproveVendorUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"approveVendorUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"pendingRole"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}}]}}]}}]} as unknown as DocumentNode<ApproveVendorUserMutation, ApproveVendorUserMutationVariables>;
export const RejectAppUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RejectAppUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rejectAppUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pendingRole"}},{"kind":"Field","name":{"kind":"Name","value":"rejectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}}]}}]}}]} as unknown as DocumentNode<RejectAppUserMutation, RejectAppUserMutationVariables>;
export const RejectVendorUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RejectVendorUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rejectVendorUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pendingRole"}},{"kind":"Field","name":{"kind":"Name","value":"rejectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}}]}}]}}]} as unknown as DocumentNode<RejectVendorUserMutation, RejectVendorUserMutationVariables>;
export const NotificationLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<NotificationLogsQuery, NotificationLogsQueryVariables>;
export const ResendNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResendNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<ResendNotificationMutation, ResendNotificationMutationVariables>;
export const DeleteNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteNotificationMutation, DeleteNotificationMutationVariables>;
export const ClearAllNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClearAllNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clearAllNotifications"}}]}}]} as unknown as DocumentNode<ClearAllNotificationsMutation, ClearAllNotificationsMutationVariables>;
export const ApprovalLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ApprovalLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"approvalLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"profilePhotoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"identityPhotoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"identityPhotoBackUrl"}}]}}]}}]} as unknown as DocumentNode<ApprovalLogsQuery, ApprovalLogsQueryVariables>;
export const AllOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryFee"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"isPickup"}},{"kind":"Field","name":{"kind":"Name","value":"customerConfirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"delivery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deliverer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pickedUpAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}}]}}]}}]}}]} as unknown as DocumentNode<AllOrdersQuery, AllOrdersQueryVariables>;
export const UpdateVendorPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVendorPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"plan"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VendorPlan"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"durationMonths"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateVendorPlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"plan"},"value":{"kind":"Variable","name":{"kind":"Name","value":"plan"}}},{"kind":"Argument","name":{"kind":"Name","value":"durationMonths"},"value":{"kind":"Variable","name":{"kind":"Name","value":"durationMonths"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"vendorPlan"}},{"kind":"Field","name":{"kind":"Name","value":"planExpiresAt"}}]}}]}}]} as unknown as DocumentNode<UpdateVendorPlanMutation, UpdateVendorPlanMutationVariables>;
export const AvailablePlansDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AvailablePlans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availablePlans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plan"}},{"kind":"Field","name":{"kind":"Name","value":"maxStores"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quarterlyPrice"}},{"kind":"Field","name":{"kind":"Name","value":"semiannualPrice"}},{"kind":"Field","name":{"kind":"Name","value":"annualPrice"}},{"kind":"Field","name":{"kind":"Name","value":"commissionPercent"}},{"kind":"Field","name":{"kind":"Name","value":"freePromosPerWeek"}},{"kind":"Field","name":{"kind":"Name","value":"maxProductsPerStore"}},{"kind":"Field","name":{"kind":"Name","value":"maxEmailsPerMonth"}},{"kind":"Field","name":{"kind":"Name","value":"listingPriority"}},{"kind":"Field","name":{"kind":"Name","value":"highlightDaysPerMonth"}},{"kind":"Field","name":{"kind":"Name","value":"canUseCoupons"}},{"kind":"Field","name":{"kind":"Name","value":"hasAnalytics"}},{"kind":"Field","name":{"kind":"Name","value":"supportLevel"}},{"kind":"Field","name":{"kind":"Name","value":"isContactSales"}}]}}]}}]} as unknown as DocumentNode<AvailablePlansQuery, AvailablePlansQueryVariables>;
export const UpdatePlanConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePlanConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"plan"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VendorPlan"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maxStores"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commissionPercent"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"monthlyPrice"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"quarterlyPrice"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"semiannualPrice"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"annualPrice"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"freePromosPerWeek"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maxProductsPerStore"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maxEmailsPerMonth"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listingPriority"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlightDaysPerMonth"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"canUseCoupons"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hasAnalytics"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"supportLevel"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isContactSales"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePlanConfig"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"plan"},"value":{"kind":"Variable","name":{"kind":"Name","value":"plan"}}},{"kind":"Argument","name":{"kind":"Name","value":"maxStores"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maxStores"}}},{"kind":"Argument","name":{"kind":"Name","value":"commissionPercent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commissionPercent"}}},{"kind":"Argument","name":{"kind":"Name","value":"monthlyPrice"},"value":{"kind":"Variable","name":{"kind":"Name","value":"monthlyPrice"}}},{"kind":"Argument","name":{"kind":"Name","value":"quarterlyPrice"},"value":{"kind":"Variable","name":{"kind":"Name","value":"quarterlyPrice"}}},{"kind":"Argument","name":{"kind":"Name","value":"semiannualPrice"},"value":{"kind":"Variable","name":{"kind":"Name","value":"semiannualPrice"}}},{"kind":"Argument","name":{"kind":"Name","value":"annualPrice"},"value":{"kind":"Variable","name":{"kind":"Name","value":"annualPrice"}}},{"kind":"Argument","name":{"kind":"Name","value":"freePromosPerWeek"},"value":{"kind":"Variable","name":{"kind":"Name","value":"freePromosPerWeek"}}},{"kind":"Argument","name":{"kind":"Name","value":"maxProductsPerStore"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maxProductsPerStore"}}},{"kind":"Argument","name":{"kind":"Name","value":"maxEmailsPerMonth"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maxEmailsPerMonth"}}},{"kind":"Argument","name":{"kind":"Name","value":"listingPriority"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listingPriority"}}},{"kind":"Argument","name":{"kind":"Name","value":"highlightDaysPerMonth"},"value":{"kind":"Variable","name":{"kind":"Name","value":"highlightDaysPerMonth"}}},{"kind":"Argument","name":{"kind":"Name","value":"canUseCoupons"},"value":{"kind":"Variable","name":{"kind":"Name","value":"canUseCoupons"}}},{"kind":"Argument","name":{"kind":"Name","value":"hasAnalytics"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hasAnalytics"}}},{"kind":"Argument","name":{"kind":"Name","value":"supportLevel"},"value":{"kind":"Variable","name":{"kind":"Name","value":"supportLevel"}}},{"kind":"Argument","name":{"kind":"Name","value":"isContactSales"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isContactSales"}}}]}]}}]} as unknown as DocumentNode<UpdatePlanConfigMutation, UpdatePlanConfigMutationVariables>;
export const AllPromotionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllPromotions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allPromotions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isPaid"}},{"kind":"Field","name":{"kind":"Name","value":"promotionalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"adCost"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]}}]} as unknown as DocumentNode<AllPromotionsQuery, AllPromotionsQueryVariables>;
export const TogglePromotionActiveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TogglePromotionActive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"togglePromotionActive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<TogglePromotionActiveMutation, TogglePromotionActiveMutationVariables>;
export const MarkPromotionPaidDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkPromotionPaid"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markPromotionPaid"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPaid"}}]}}]}}]} as unknown as DocumentNode<MarkPromotionPaidMutation, MarkPromotionPaidMutationVariables>;
export const PromoPricePerDayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PromoPricePerDay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"promoPricePerDay"}}]}}]} as unknown as DocumentNode<PromoPricePerDayQuery, PromoPricePerDayQueryVariables>;
export const SetPromoPricePerDayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetPromoPricePerDay"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"price"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setPromoPricePerDay"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"price"},"value":{"kind":"Variable","name":{"kind":"Name","value":"price"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<SetPromoPricePerDayMutation, SetPromoPricePerDayMutationVariables>;
export const DeliveryPricesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DeliveryPrices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deliveryPricePerKm"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryBasePrice"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryCommissionPercent"}},{"kind":"Field","name":{"kind":"Name","value":"minimumOrderPlatform"}}]}}]} as unknown as DocumentNode<DeliveryPricesQuery, DeliveryPricesQueryVariables>;
export const SetMinimumOrderPlatformDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetMinimumOrderPlatform"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"price"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setMinimumOrderPlatform"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"price"},"value":{"kind":"Variable","name":{"kind":"Name","value":"price"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<SetMinimumOrderPlatformMutation, SetMinimumOrderPlatformMutationVariables>;
export const SetDeliveryPricePerKmDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDeliveryPricePerKm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"price"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setDeliveryPricePerKm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"price"},"value":{"kind":"Variable","name":{"kind":"Name","value":"price"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<SetDeliveryPricePerKmMutation, SetDeliveryPricePerKmMutationVariables>;
export const SetDeliveryBasePriceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDeliveryBasePrice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"price"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setDeliveryBasePrice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"price"},"value":{"kind":"Variable","name":{"kind":"Name","value":"price"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<SetDeliveryBasePriceMutation, SetDeliveryBasePriceMutationVariables>;
export const SetDeliveryCommissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDeliveryCommission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"percent"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setDeliveryCommissionPercent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"percent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"percent"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<SetDeliveryCommissionMutation, SetDeliveryCommissionMutationVariables>;
export const AllCouponsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllCoupons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allCoupons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"discountType"}},{"kind":"Field","name":{"kind":"Name","value":"discountValue"}},{"kind":"Field","name":{"kind":"Name","value":"minimumOrder"}},{"kind":"Field","name":{"kind":"Name","value":"maxDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"maxUses"}},{"kind":"Field","name":{"kind":"Name","value":"usesCount"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllCouponsQuery, AllCouponsQueryVariables>;
export const AdminToggleCouponDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AdminToggleCoupon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminToggleCoupon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<AdminToggleCouponMutation, AdminToggleCouponMutationVariables>;
export const AdminDeleteCouponDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AdminDeleteCoupon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminDeleteCoupon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<AdminDeleteCouponMutation, AdminDeleteCouponMutationVariables>;
export const ContractContentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ContractContent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractContent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}]}]}}]} as unknown as DocumentNode<ContractContentQuery, ContractContentQueryVariables>;
export const ContractUpdatedAtDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ContractUpdatedAt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractUpdatedAt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}]}]}}]} as unknown as DocumentNode<ContractUpdatedAtQuery, ContractUpdatedAtQueryVariables>;
export const UpdateContractContentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateContractContent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateContractContent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}}]}]}}]} as unknown as DocumentNode<UpdateContractContentMutation, UpdateContractContentMutationVariables>;
export const AllDeliveriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllDeliveries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allDeliveries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pickedUpAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"payoutStatus"}},{"kind":"Field","name":{"kind":"Name","value":"payoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"payoutMpId"}},{"kind":"Field","name":{"kind":"Name","value":"vendorPayoutStatus"}},{"kind":"Field","name":{"kind":"Name","value":"vendorPayoutAmount"}},{"kind":"Field","name":{"kind":"Name","value":"vendorPayoutMpId"}},{"kind":"Field","name":{"kind":"Name","value":"deliverer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryFee"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"hasOwnDelivery"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllDeliveriesQuery, AllDeliveriesQueryVariables>;
export const BadgeConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BadgeConfig"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"badgeConfig"}}]}}]} as unknown as DocumentNode<BadgeConfigQuery, BadgeConfigQueryVariables>;
export const UpdateBadgeThresholdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBadgeThresholds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"thresholds"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBadgeThresholds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"thresholds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"thresholds"}}}]}]}}]} as unknown as DocumentNode<UpdateBadgeThresholdsMutation, UpdateBadgeThresholdsMutationVariables>;
export const UpdateBadgePointsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBadgePoints"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"points"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBadgePoints"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"points"},"value":{"kind":"Variable","name":{"kind":"Name","value":"points"}}}]}]}}]} as unknown as DocumentNode<UpdateBadgePointsMutation, UpdateBadgePointsMutationVariables>;
export const UpdateBadgeRewardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBadgeRewards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"level"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rewards"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBadgeRewards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"level"},"value":{"kind":"Variable","name":{"kind":"Name","value":"level"}}},{"kind":"Argument","name":{"kind":"Name","value":"rewards"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rewards"}}}]}]}}]} as unknown as DocumentNode<UpdateBadgeRewardsMutation, UpdateBadgeRewardsMutationVariables>;
export const RegisterSuperadminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterSuperadmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerSuperadmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}},{"kind":"Argument","name":{"kind":"Name","value":"permissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]} as unknown as DocumentNode<RegisterSuperadminMutation, RegisterSuperadminMutationVariables>;
export const UpdateSuperadminPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSuperadminPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSuperadminPermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"permissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]} as unknown as DocumentNode<UpdateSuperadminPermissionsMutation, UpdateSuperadminPermissionsMutationVariables>;
export const UpdateNotificationEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNotificationEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNotificationEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notificationEmail"}}]}}]}}]} as unknown as DocumentNode<UpdateNotificationEmailMutation, UpdateNotificationEmailMutationVariables>;
export const AllPaymentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllPayments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allPayments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"mpPaymentId"}},{"kind":"Field","name":{"kind":"Name","value":"checkoutUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"appUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vendorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<AllPaymentsQuery, AllPaymentsQueryVariables>;