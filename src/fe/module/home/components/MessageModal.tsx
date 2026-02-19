"use client";

import React from "react";
import { Form, Field } from "formik";
import {
  EnhancedForm,
  FormFieldWrapper,
  FormikSubmitButton,
  messageFormSchema,
  type MessageFormData,
  type ApiResponse,
} from "@/fe/lib/validation";
import { messageModalStyles } from "@/fe/module/home/styles/modalStyles";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReason: string | null;
  onSend: (
    additionalMessage: string,
    phoneNumber: string,
    reasonId: string,
  ) => Promise<any>;
  reasonOptions: Array<{ id: string; icon: string; label: string }>;
}

export const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  selectedReason,
  onSend,
  reasonOptions,
}) => {
  const s = messageModalStyles;

  if (!isOpen) return null;

  const initialValues: MessageFormData = {
    reasonId: selectedReason || "",
    additionalMessage: "",
    phoneNumber: "",
  };

  const handleMessageSubmit = async (
    data: MessageFormData,
  ): Promise<ApiResponse> => {
    try {
      await onSend(data.additionalMessage, data.phoneNumber, data.reasonId);
      return {
        success: true,
        message: "WhatsApp message sent successfully!",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error?.message || "Failed to send message",
      };
    }
  };

  const handleSuccess = () => {
    // Small delay to let user see the success message
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div className={s.backdrop} onClick={onClose} />

      {/* Modal */}
      <div className={s.container}>
        {/* Header */}
        <div className={s.header}>
          <div className={s.headerContent}>
            <h2 className={s.title}>Send Message</h2>
            <button onClick={onClose} className={s.closeButton}>
              <svg
                className={s.closeIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={s.content}>
          <EnhancedForm<MessageFormData>
            initialValues={initialValues}
            validationSchema={messageFormSchema}
            onSubmit={handleMessageSubmit}
            onSuccess={handleSuccess}
            successMessage="Message sent successfully!"
            autoResetOnSuccess={true}
          >
            {({ values, errors, touched, formState }) => (
              <Form className="space-y-4">
                {/* Selected Reason */}
                <FormFieldWrapper
                  name="reasonId"
                  label="Select Reason"
                  required
                  error={errors.reasonId}
                  touched={touched.reasonId}
                >
                  <Field
                    name="reasonId"
                    as="select"
                    className={s.input}
                    disabled={formState.isSubmitting}
                  >
                    <option value="">Select a reason...</option>
                    {reasonOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </Field>
                </FormFieldWrapper>

                {/* Additional Message */}
                <FormFieldWrapper
                  name="additionalMessage"
                  label="Additional Message (Optional)"
                  error={errors.additionalMessage}
                  touched={touched.additionalMessage}
                >
                  <Field
                    name="additionalMessage"
                    as="textarea"
                    placeholder="Add any additional details..."
                    rows={3}
                    className={s.textarea}
                    disabled={formState.isSubmitting}
                  />
                </FormFieldWrapper>

                {/* Share Your Number */}
                <FormFieldWrapper
                  name="phoneNumber"
                  label="Your Contact Number (Optional)"
                  error={errors.phoneNumber}
                  touched={touched.phoneNumber}
                >
                  <Field
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    className={s.input}
                    disabled={formState.isSubmitting}
                  />
                </FormFieldWrapper>

                {/* Footer */}
                <div className={s.footer}>
                  <button
                    type="button"
                    onClick={onClose}
                    className={s.cancelButton}
                    disabled={formState.isSubmitting}
                  >
                    Cancel
                  </button>

                  <FormikSubmitButton
                    isSubmitting={formState.isSubmitting}
                    loadingText="Sending..."
                    className={`${s.sendButton} flex items-center gap-2`}
                  >
                    <span>Send Message</span>
                    <svg
                      className={s.whatsappIcon}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </FormikSubmitButton>
                </div>
              </Form>
            )}
          </EnhancedForm>
        </div>
      </div>
    </div>
  );
};
