"use client";

import React from "react";
import { Form, Field } from "formik";
import {
  EnhancedForm,
  FormFieldWrapper,
  FormikSubmitButton,
  ownerFormSchema,
  type OwnerFormData,
  type ApiResponse,
} from "@/fe/lib/validation";
import { ownerFormFields } from "../constants";
import { ownerModalStyles } from "../styles/ownerModalStyles";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { ModalHeader } from "./ModalHeader";

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OwnerFormData) => Promise<void>;
  initialData?: OwnerFormData;
}

const defaultInitialValues: OwnerFormData = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  vehicle_no: "",
  vehicle_type: "",
  emergency_contact_1: "",
  emergency_contact_2: "",
  address: "",
};

export function OwnerLoginModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: OwnerLoginModalProps) {
  if (!isOpen) return null;

  // Use initialData if provided, otherwise use default empty values
  const initialValues: OwnerFormData = initialData
    ? {
        name: initialData.name || "",
        phone: initialData.phone || "",
        whatsapp: initialData.whatsapp || "",
        email: initialData.email || "",
        vehicle_no: initialData.vehicle_no || "",
        vehicle_type: initialData.vehicle_type || "",
        emergency_contact_1: initialData.emergency_contact_1 || "",
        emergency_contact_2: initialData.emergency_contact_2 || "",
        address: initialData.address || "",
      }
    : defaultInitialValues;

  const handleOwnerSubmit = async (
    data: OwnerFormData,
  ): Promise<ApiResponse> => {
    try {
      await onSubmit(data);
      return {
        success: true,
        message: "Owner information submitted successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error?.message || "Failed to submit owner information",
      };
    }
  };

  const renderFormField = (field: (typeof ownerFormFields)[0]) => {
    if (field.type === "textarea") {
      return (
        <FormFieldWrapper
          key={field.name}
          name={field.name}
          label={field.label}
          required={field.required}
          className={
            ["address", "email"].includes(field.name)
              ? ownerModalStyles.form.fullWidth
              : ""
          }
        >
          <Field
            name={field.name}
            as="textarea"
            placeholder={field.placeholder}
            rows={field.rows || 3}
            className={ownerModalStyles.form.textarea}
          />
        </FormFieldWrapper>
      );
    }

    if (field.type === "select") {
      return (
        <FormFieldWrapper
          key={field.name}
          name={field.name}
          label={field.label}
          required={field.required}
          className={
            ["address", "email"].includes(field.name)
              ? ownerModalStyles.form.fullWidth
              : ""
          }
        >
          <Field
            name={field.name}
            as="select"
            className={ownerModalStyles.form.input}
          >
            <option value="">{field.placeholder}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Field>
        </FormFieldWrapper>
      );
    }

    return (
      <FormFieldWrapper
        key={field.name}
        name={field.name}
        label={field.label}
        required={field.required}
        className={
          ["address", "email"].includes(field.name)
            ? ownerModalStyles.form.fullWidth
            : ""
        }
      >
        <Field
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          className={ownerModalStyles.form.input}
        />
      </FormFieldWrapper>
    );
  };

  return (
    <div className={ownerModalStyles.overlay}>
      <div className={ownerModalStyles.backdrop} onClick={onClose} />

      <div className={ownerModalStyles.modal}>
        <ModalHeader title="Update Owner Details" onClose={onClose} />

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            <EnhancedForm<OwnerFormData>
              initialValues={initialValues}
              validationSchema={ownerFormSchema}
              onSubmit={handleOwnerSubmit}
              successMessage="Owner information submitted successfully!"
              autoResetOnSuccess={false}
            >
              {({ values, errors, touched, formState }) => (
                <Form className="space-y-4">
                  <div className={ownerModalStyles.form.grid}>
                    {ownerFormFields
                      .filter((f) => f.name !== "vehicle_type")
                      .map(renderFormField)}
                  </div>

                  <FormikSubmitButton
                    isSubmitting={formState.isSubmitting}
                    loadingText="⏳ Submitting..."
                    className={ownerModalStyles.form.submitButton}
                  >
                    Submit Details ✓
                  </FormikSubmitButton>
                </Form>
              )}
            </EnhancedForm>
          </div>
        </div>
      </div>
    </div>
  );
}
