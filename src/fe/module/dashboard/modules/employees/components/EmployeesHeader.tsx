import { Button } from "@/fe/components/ui";

interface EmployeesHeaderProps {
  employeesCount: number;
  onAddEmployee: () => void;
  onBackToDashboard: () => void;
}

export const EmployeesHeader = ({
  employeesCount,
  onAddEmployee,
  onBackToDashboard,
}: EmployeesHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Employee Management
        </h1>
        <div className="flex gap-3">
          <Button onClick={onAddEmployee}>+ Add Employee</Button>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Total Employees
        </p>
        <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
          {employeesCount}
        </p>
      </div>
    </div>
  );
};
