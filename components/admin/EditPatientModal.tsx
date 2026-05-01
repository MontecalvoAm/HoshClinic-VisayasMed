"use client";
import { useState, useEffect, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "../ui/Modal";
import { Patient } from "@/lib/types";
import { updatePatient } from "@/lib/actions/patientActions";
import { toast } from "sonner";

const civilStatus = [
  "Single",
  "Married",
  "Widowed",
  "Divorced",
  "Separated",
];
const gender = ["Male", "Female"];
const bloodType = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const patientSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  middle_name: z.string().optional(),
  birth_date: z.string().min(1, "Birth date is required"),
  gender: z.enum(gender),
  civil_status: z.enum(civilStatus),
  blood_type: z.enum(bloodType),
  address: z.string().min(1, "Address is required"),
  contact_number: z.string().min(1, "Contact number is required"),
});

type PatientFormInputs = z.infer<typeof patientSchema>;

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

const EditPatientModal = ({
  isOpen,
  onClose,
  patient,
}: EditPatientModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormInputs>({
    resolver: zodResolver(patientSchema),
  });

  useEffect(() => {
    if (patient) {
      reset({
        ...patient,
        birth_date: new Date(patient.birth_date).toISOString().split("T")[0],
      });
    }
  }, [patient, reset]);

  const onSubmit: SubmitHandler<PatientFormInputs> = async (data) => {
    if (!patient) return;

    const result = await updatePatient(patient.id, data);
    if (result.success) {
      toast.success("Patient updated successfully!");
      onClose();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Patient">
      {patient && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>First Name</label>
              <input
                {...register("first_name")}
                className="w-full p-2 border rounded"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div>
              <label>Last Name</label>
              <input
                {...register("last_name")}
                className="w-full p-2 border rounded"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm">
                  {errors.last_name.message}
                </p>
              )}
            </div>
            <div>
              <label>Middle Name</label>
              <input
                {...register("middle_name")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label>Birth Date</label>
              <input
                type="date"
                {...register("birth_date")}
                className="w-full p-2 border rounded"
              />
              {errors.birth_date && (
                <p className="text-red-500 text-sm">
                  {errors.birth_date.message}
                </p>
              )}
            </div>
            <div>
              <label>Gender</label>
              <select {...register("gender")} className="w-full p-2 border rounded">
                {gender.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Civil Status</label>
              <select
                {...register("civil_status")}
                className="w-full p-2 border rounded"
              >
                {civilStatus.map((cs) => (
                  <option key={cs} value={cs}>
                    {cs}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Blood Type</label>
              <select
                {...register("blood_type")}
                className="w-full p-2 border rounded"
              >
                {bloodType.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Address</label>
              <input
                {...register("address")}
                className="w-full p-2 border rounded"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>
            <div>
              <label>Contact Number</label>
              <input
                {...register("contact_number")}
                className="w-full p-2 border rounded"
              />
              {errors.contact_number && (
                <p className="text-red-500 text-sm">
                  {errors.contact_number.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EditPatientModal;
