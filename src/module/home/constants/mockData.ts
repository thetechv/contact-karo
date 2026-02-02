export interface VehicleOwner {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  vehicle_no: string;
  vehicle_type: string;
  emergency_contact_1: string;
  emergency_contact_2?: string;
  address: string;
}

export const mockVehicleOwners: VehicleOwner[] = [
  {
    name: "Rahul Sharma",
    phone: "9876543210",
    whatsapp: "9876543210",
    email: "rahul.sharma@gmail.com",
    vehicle_no: "DL01AB1234",
    vehicle_type: "car",
    emergency_contact_1: "9123456789",
    emergency_contact_2: "9988776655",
    address: "Flat 203, Green Residency, Rohini, Delhi",
  },
  {
    name: "Amit Verma",
    phone: "9898989898",
    whatsapp: "9898989898",
    email: "amit.verma@yahoo.com",
    vehicle_no: "UP32CD4567",
    vehicle_type: "bike",
    emergency_contact_1: "9012345678",
    emergency_contact_2: "9112233445",
    address: "Near Civil Lines, Lucknow, Uttar Pradesh",
  },
  {
    name: "Sneha Gupta",
    phone: "9765432109",
    whatsapp: "9765432109",
    email: "sneha.gupta@outlook.com",
    vehicle_no: "MH12EF7890",
    vehicle_type: "scooter",
    emergency_contact_1: "9345678123",
    address: "Baner Road, Pune, Maharashtra",
  },
];

// Helper function to get a random vehicle owner
export const getRandomVehicleOwner = (): VehicleOwner => {
  const randomIndex = Math.floor(Math.random() * mockVehicleOwners.length);
  return mockVehicleOwners[randomIndex];
};

// Helper function to get vehicle owner by vehicle number
export const getVehicleOwnerByNumber = (
  vehicleNo: string,
): VehicleOwner | undefined => {
  return mockVehicleOwners.find(
    (owner) => owner.vehicle_no.toLowerCase() === vehicleNo.toLowerCase(),
  );
};
