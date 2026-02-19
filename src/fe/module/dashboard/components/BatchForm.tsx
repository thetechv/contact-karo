"use client";

import { Form, Field } from "formik";
import {
  EnhancedForm,
  FormFieldWrapper,
  FormikSubmitButton,
  batchFormSchema,
  type BatchFormData,
  type ApiResponse,
} from "@/fe/lib/validation";

interface BatchFormProps {
  onSubmit: (data: BatchFormData) => Promise<ApiResponse>;
  onSuccess?: () => Promise<void>;
}

const initialValues: BatchFormData = {
  name: "",
  qty: 1,
  notes: "",
  type: "car",
  isTestBatch: false,
};

export const BatchForm = ({ onSubmit, onSuccess }: BatchFormProps) => {
  return (
    <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Create New Batch
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Generate QR codes in bulk for distribution
          </p>
        </div>
      </div>

      <div className="mt-6">
        <EnhancedForm<BatchFormData>
          initialValues={initialValues}
          validationSchema={batchFormSchema}
          onSubmit={onSubmit}
          onSuccess={onSuccess}
          successMessage="Batch created successfully! QR codes are generating now."
          autoResetOnSuccess={true}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            formState,
          }) => (
            <Form className="grid gap-5 sm:grid-cols-2">
              <FormFieldWrapper
                name="name"
                label="Batch Name"
                required
                error={errors.name}
                touched={touched.name}
              >
                <Field
                  name="name"
                  type="text"
                  placeholder="BATCH001"
                  autoComplete="off"
                  suppressHydrationWarning={true}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                  disabled={formState.isSubmitting}
                />
              </FormFieldWrapper>

              <FormFieldWrapper
                name="qty"
                label="Quantity"
                required
                error={errors.qty}
                touched={touched.qty}
              >
                <Field
                  name="qty"
                  type="number"
                  min={1}
                  placeholder="100"
                  autoComplete="off"
                  suppressHydrationWarning={true}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                  disabled={formState.isSubmitting}
                />
              </FormFieldWrapper>

              <FormFieldWrapper
                name="type"
                label="Type"
                required
                error={errors.type}
                touched={touched.type}
              >
                <Field
                  name="type"
                  as="select"
                  autoComplete="off"
                  suppressHydrationWarning={true}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                  disabled={formState.isSubmitting}
                >
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="bag-tag">Bag Tag</option>
                  <option value="door-tag">Door Tag</option>
                  <option value="business-card">Business Card</option>
                </Field>
              </FormFieldWrapper>

              <FormFieldWrapper
                name="isTestBatch"
                label="Test batch"
                error={errors.isTestBatch}
                touched={touched.isTestBatch}
                className="sm:col-span-2"
              >
                <label className="inline-flex items-center gap-3">
                  <Field
                    name="isTestBatch"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
                    disabled={formState.isSubmitting}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Create as a test batch (no distribution)
                  </span>
                </label>
              </FormFieldWrapper>

              <FormFieldWrapper
                name="notes"
                label="Notes (Optional)"
                error={errors.notes}
                touched={touched.notes}
                className="sm:col-span-2"
              >
                <Field
                  name="notes"
                  as="textarea"
                  placeholder="Additional notes..."
                  rows={4}
                  autoComplete="off"
                  suppressHydrationWarning={true}
                  className="w-full min-h-[96px] rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 resize-vertical transition-all"
                  disabled={formState.isSubmitting}
                />
              </FormFieldWrapper>

              <div className="flex items-center justify-end sm:col-span-2">
                <FormikSubmitButton
                  isSubmitting={formState.isSubmitting}
                  loadingText="Creating..."
                >
                  Create Batch →
                </FormikSubmitButton>
              </div>
            </Form>
          )}
        </EnhancedForm>
      </div>
    </section>
  );
};
