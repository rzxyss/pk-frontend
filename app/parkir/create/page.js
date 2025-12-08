"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Save } from "lucide-react";
import Link from "next/link";

export default function CreateParkirPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    parking_number: 0,
    is_used: 0,
    trig: 0,
    echo: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "is_used" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/parkir`,
        formData
      );
      alert("Data parkir berhasil ditambahkan!");
      router.push("/parkir");
    } catch (error) {
      console.error("Error creating parkir:", error);
      alert(
        "Gagal menambahkan data parkir: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Tambah Data Parkir
          </h1>
          <p className="text-gray-600 mt-1">
            Tambahkan data parkir baru ke sistem
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Parking Number */}
          <div>
            <label
              htmlFor="parking_number"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nomor Parkir <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="parking_number"
              name="parking_number"
              value={formData.parking_number}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Is Used */}
          <div>
            <label
              htmlFor="is_used"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Status Penggunaan <span className="text-red-500">*</span>
            </label>
            <select
              id="is_used"
              name="is_used"
              value={formData.is_used}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            >
              <option value={0}>Available</option>
              <option value={1}>Used</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="echo"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Echo Pin <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="echo"
              name="echo"
              value={formData.echo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="trig"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Trig Pin <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="trig"
              name="trig"
              value={formData.trig}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              <Save size={18} />
              {loading ? "Menyimpan..." : "Simpan Data"}
            </button>
            <Link
              href="/parkir"
              className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
