import { object, string, boolean, InferType } from "yup";

export const checkoutSchema = object({
  // Contact Information
  firstName: string().required("First name is required"),
  lastName: string().required("Last name is required"),
  address: string().required("Address is required"),
  email: string().email("Invalid email").required("Email is required"),
  phone: string().required("Phone number is required"),

  // Checkbox for alternate delivery address
  deliveryOption: boolean().optional(),

  // Delivery (Receiver) Information
  receiversFirstName: string().when("deliveryOption", {
    is: true,
    then: (schema) => schema.required("First name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  receiversLastName: string().when("deliveryOption", {
    is: true,
    then: (schema) => schema.required("Last name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  receiversAddress: string().when("deliveryOption", {
    is: true,
    then: (schema) => schema.required("Address is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  receiversEmail: string().when("deliveryOption", {
    is: true,
    then: (schema) =>
      schema.email("Invalid email").required("Email is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  receiversPhone: string().when("deliveryOption", {
    is: true,
    then: (schema) => schema.required("Phone number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export type CheckoutFormData = InferType<typeof checkoutSchema>;

export type CheckoutVendor = {
  id: string;
  vendor_id: string;
  subaccount_code: string | null;
  business_name: string;
};
