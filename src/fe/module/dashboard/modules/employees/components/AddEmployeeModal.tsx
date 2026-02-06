import { Modal, Input, Button } from "@/fe/components/ui";
import type { EmployeeFormData, FormErrors } from "../constants";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: EmployeeFormData;
  formErrors: FormErrors;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onFormDataChange: (field: keyof EmployeeFormData, value: string) => void;
}

export const AddEmployeeModal = ({
  isOpen,
  onClose,
  formData,
  formErrors,
  submitting,
  onSubmit,
  onFormDataChange,
}: AddEmployeeModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Employee"
      maxWidth="md"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => onFormDataChange("name", e.target.value)}
          error={formErrors.name}
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => onFormDataChange("email", e.target.value)}
          error={formErrors.email}
          required
        />
        <Input
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) =>
            onFormDataChange(
              "phone",
              e.target.value.replace(/\D/g, "").slice(0, 10),
            )
          }
          error={formErrors.phone}
          required
        />
        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => onFormDataChange("password", e.target.value)}
          error={formErrors.password}
          helperText="Minimum 6 characters"
          required
        />
        <Input
          label="Address"
          value={formData.address}
          onChange={(e) => onFormDataChange("address", e.target.value)}
        />
        {formErrors.submit && (
          <p className="text-sm text-red-500">{formErrors.submit}</p>
        )}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="flex-1">
            {submitting ? "Adding..." : "Add Employee"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
