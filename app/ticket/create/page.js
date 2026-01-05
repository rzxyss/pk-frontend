"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Car } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";

export default function CreateTicketPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    number_plate: "",
    parking_id: "",
  });
  const [parkirOptions, setParkirOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingParkir, setLoadingParkir] = useState(true);

  useEffect(() => {
    fetchParkirOptions();
  }, []);

  const fetchParkirOptions = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/parkir`
      );
      // Filter only available parking spots
      const availableParkir = response.data.data.filter(
        (item) => item.is_used === 0
      );
      setParkirOptions(availableParkir);
      setLoadingParkir(false);
    } catch (error) {
      console.error("Error fetching parkir data:", error);
      setLoadingParkir(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets`, {
        number_plate: formData.number_plate,
        parking_id: parseInt(formData.parking_id),
      });

      // Otomatis open gate setelah create ticket
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gate/control`,
        {
          action: "open",
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Ticket created successfully! Gate opened automatically.",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gate/control`, {
          action: "open",
        });
        router.push("/ticket");
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          "Failed to create ticket: " +
          (error.response?.data?.message || error.message),
      });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Create Parking Ticket
          </h1>
          <p className="text-gray-600 mt-1">
            Create a parking ticket for a new vehicle
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Number Plate */}
          <div>
            <label
              htmlFor="number_plate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Number Plate <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Car size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="number_plate"
                name="number_plate"
                value={formData.number_plate}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Contoh: B 1234 XYZ"
                required
              />
            </div>
          </div>

          {/* Parking Spot */}
          <div>
            <label
              htmlFor="parking_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Parking Location <span className="text-red-500">*</span>
            </label>
            {loadingParkir ? (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                <span className="text-sm">Loading parking data...</span>
              </div>
            ) : (
              <select
                id="parking_id"
                name="parking_id"
                value={formData.parking_id}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              >
                <option value="">Select parking location</option>
                {parkirOptions.map((parkir) => (
                  <option key={parkir.id} value={parkir.id}>
                    {parkir.parking_number}
                  </option>
                ))}
              </select>
            )}
            {!loadingParkir && parkirOptions.length === 0 && (
              <p className="mt-2 text-sm text-red-600">
                No parking locations available.
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Car size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-900">
                  Check-in Information
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  Check-in time will be automatically recorded when the ticket
                  is created. Make sure the number plate and parking location
                  are correct.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || parkirOptions.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save</span>
                </>
              )}
            </button>
            <Link
              href="/ticket"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
