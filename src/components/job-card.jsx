// components/job-card.js
"use client";

import { FaEye, FaArchive, FaTrash, FaEdit, FaMapMarkerAlt, FaMoneyBillWave,FaClock   } from "react-icons/fa";
import Link from "next/link";

export function JobCards({ job, onDelete, onStatusChange, formatDate }) {
  const statusActions = {
    active: [
      { 
        label: "Archive", 
        icon: <FaArchive />,
        action: () => onStatusChange("archived"),
        color: "text-gray-600 hover:text-gray-800"
      }
    ],
    expired: [
      { 
        label: "Reactivate", 
        icon: <FaEye />,
        action: () => onStatusChange("active"),
        color: "text-blue-600 hover:text-blue-800"
      },
      { 
        label: "Archive", 
        icon: <FaArchive />,
        action: () => onStatusChange("archived"),
        color: "text-gray-600 hover:text-gray-800"
      }
    ],
    archived: [
      { 
        label: "Restore", 
        icon: <FaEye />,
        action: () => onStatusChange("active"),
        color: "text-blue-600 hover:text-blue-800"
      }
    ]
  };

  return (
    <div className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden border dark:border-gray-700 border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{job.title}</h3>
          <div className="flex items-center space-x-2">
            {job.status === "active" && new Date(job.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                New
              </span>
            )}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              job.status === "active" ? "bg-blue-100 text-blue-800" :
              job.status === "expired" ? "bg-yellow-100 text-yellow-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {job.status}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4 dark:text-gray-300">{job.description}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600 dark:text-white">
            <FaMapMarkerAlt className="mr-2 text-blue-500" />
            <span>
              {job.locationType === "remote" ? "Remote" : job.location}
              {job.locationType === "hybrid" && " (Hybrid)"}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-white">
            <FaMoneyBillWave className="mr-2 text-blue-500" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-white">
            <FaClock className="mr-2 text-blue-500" />
            <span>Apply by {formatDate(job.deadline)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Link 
            href={`/admin/jobs/edit/${job._id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 "
          >
            Edit
          </Link>
          
          <div className="flex space-x-2">
            {statusActions[job.status]?.map((action, i) => (
              <button
                key={i}
                onClick={action.action}
                className={`p-2 rounded-full hover:bg-gray-100 ${action.color}`}
                title={action.label}
              >
                {action.icon}
              </button>
            ))}
            <button
              onClick={() => onDelete(job._id)}
              className="p-2 rounded-full hover:bg-gray-100 text-red-600 hover:text-red-800"
              title="Delete"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}