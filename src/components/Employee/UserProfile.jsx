import { useState } from "react";
import PersonalData from "./tabs/PersonalData";
import WorkData from "./tabs/WorkData";
import ContactData from "./tabs/ContactData";

export default function UserProfile({ employee }) {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Datos personales" },
    { id: "work", label: "Datos laborales" },
    { id: "contact", label: "Datos de contactos" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalData employee={employee} />;
      case "work":
        return <WorkData employee={employee} />;
      case "contact":
        return <ContactData employee={employee} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 bg-[#1f2937] text-white rounded-xl shadow-lg p-6">

      {/* HEADER */}
      <div className="flex items-center gap-6 pb-6 border-b border-white/10">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-700">
          <img
            src="/user-avatar.png"
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-semibold">
            {employee.name} {employee.lastName}
          </h1>
          <p className="text-gray-300">Empleado #{employee.id}</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mt-6 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 -mb-px font-medium border-b-2 transition-all
              ${activeTab === tab.id
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-200"}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="mt-6">{renderTabContent()}</div>
    </div>
  );
}
