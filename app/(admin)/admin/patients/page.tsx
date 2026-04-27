import { getPatients } from "@/lib/actions/patientActions";
import { PatientTable } from "@/components/admin/PatientTable";

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <div className="space-y-6">
      <PatientTable patients={patients} />
    </div>
  );
}
