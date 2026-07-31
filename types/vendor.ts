import { object, string, boolean, mixed, InferType } from "yup";

export const vendorSchema = object({
  // step 1 — personal info
  fullName: string().required("Full name is required"),
  email: string().email("Invalid email address").required("Email is required"),
  phoneNumber: string()
    .required("Phone number is required")
    .min(10, "Enter a valid phone number"),
  logo: mixed<File>().optional(),

  // step 2 — business info
  businessName: string().required("Business name is required"),
  storeType: string().required("Store type is required"),
  productCategory: string().required("Product category is required"),
  businessAddress: string()
    .required("Business address is required")
    .min(10, "Add a more specific address e.g. Wuse 2, Abuja"),
  socials: object({
    instagram: string().optional(),
    twitter: string().optional(),
    tiktok: string().optional(),
    facebook: string().optional(),
    website: string()
      .url("Enter a valid URL e.g. https://mystore.com")
      .optional(),
  }).optional(),

  // step 3 — store policies
  returnPolicy: string().required("Return policy is required"),
  deliveryDuration: string().required("Delivery duration is required"),
  agreesToPlatformFee: boolean()
    .oneOf([true], "You must agree to the platform fee policy to continue")
    .required(),

  // step 4 — bank details
  bankName: string().required("Bank name is required"),
  accountNumber: string()
    .required("Account number is required")
    .length(10, "Account number must be exactly 10 digits"),
  accountName: string().required("Account name is required"),
});

export type VendorFormData = InferType<typeof vendorSchema>;

export type StepField = keyof VendorFormData;

export type Step = {
  id: number;
  title: string;
  description: string;
  fields: StepField[];
};

export const VENDOR_STEPS: Step[] = [
  {
    id: 1,
    title: "Personal Information",
    description: "Tell us about yourself",
    fields: ["fullName", "email", "phoneNumber"],
  },
  {
    id: 2,
    title: "Business Information",
    description: "Details about your business",
    fields: ["businessName", "storeType", "productCategory", "businessAddress"],
  },
  {
    id: 3,
    title: "Store Policies",
    description: "Set your store rules",
    fields: ["returnPolicy", "deliveryDuration", "agreesToPlatformFee"],
  },
  {
    id: 4,
    title: "Bank Details",
    description: "Your payment account",
    fields: ["bankName", "accountNumber", "accountName"],
  },
];

export type VendorRow = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  businessName: string;
  storeType: string;
  businessAddress: string;
  latitude: number | null;
  longitude: number | null;
  productCategory: string;
  socials: string | null;
  vendor_id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  returnPolicy: string;
  deliveryDuration: string;
  subaccount_code: string | null;
  subaccount_pending: boolean;
  updatedAt: string;
  createdAt: string;
};

export type VendorSocials = {
  instagram?: string | null;
  twitter?: string | null;
  tiktok?: string | null;
  facebook?: string | null;
  website?: string | null;
};

export type VendorInsert = {
  vendor_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  logo_url?: string | null;
  business_name: string;
  store_type: string;
  business_address: string;
  latitude: number | null;
  longitude: number | null;
  product_category: string;
  socials: VendorSocials | null;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  return_policy: string;
  delivery_duration: string;
  subaccount_code: string | null;
  subaccount_pending: boolean;
  updated_at: string;
  agreed_to_platform_fee: boolean;
};

export interface Vendor {
  id: string;
  business_name?: string;
  full_name: string;
  product_category?: string;
  business_address?: string;
  phone_number?: string;
  email?: string;
  socials?: string;
  logo_url?: string;
  cover_url?: string;
  verified?: boolean;
  joined_at?: string;
  total_products?: number;
  average_rating?: number;
  instagram?: string;
  facebook?: string;
  x?: string;
  tiktok?: string;
  website?: string;
  active?: boolean;
}
