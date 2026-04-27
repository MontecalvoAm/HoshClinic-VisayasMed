import React from "react";
import { Button } from "@/components/ui/Button";
import { getAppointments } from "@/lib/actions/appointmentActions";
import { AppointmentTable } from "@/components/admin/AppointmentTable";

export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div className="space-y-6">
      <AppointmentTable appointments={appointments} />
    </div>
  );
}
