import React, { useState } from "react";
import { auth, db } from "@/firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ShowNotification } from "../Toaster";

interface AttorneySignupProps {
  onSubmit: (data: any) => void;
  setType: (data: any) => void;
}
interface BarDetails {
  fullName: string;
  barNumber: string;
  licenseStatus: string;
  address: string;
  phoneNumber: string;
  faxNumber: string;
  email: string;
  website: string;
}

const parseBarResponse = (html: string): BarDetails | null => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const fullName = doc.querySelector("h3 b")?.textContent?.split("#")[0]?.trim() || "";
    const barNumber = doc.querySelector("h3 b")?.textContent?.match(/#(\d+)/)?.[1] || "";
    const licenseStatus = Array.from(doc.querySelectorAll("p.nostyle"))
      .find((p) => p.textContent?.includes("License Status:"))
      ?.querySelector("b")?.textContent?.replace("License Status:", "").trim() || "";
    const address = Array.from(doc.querySelectorAll("p.nostyle"))
      .find((p) => p.textContent?.includes("Address:"))
      ?.textContent?.replace("Address:", "").trim() || "";
    const phoneAndFaxElement = Array.from(doc.querySelectorAll("p"))
      .find((p) => p.textContent?.includes("Phone:"));

    const phoneNumber = phoneAndFaxElement
      ?.textContent?.split("|")[0]
      .replace("Phone:", "")
      .trim() || "";

    const faxNumber = phoneAndFaxElement
      ?.textContent?.split("|")[1]
      .replace("Fax:", "")
      .trim() || "Not Available";
    const email = doc.querySelector("span[id^='e']")?.textContent?.replace(/&#64;/g, "@").replace(/<span>/g, ".").trim() || "";
    const website = doc.querySelector("#websiteLink")?.getAttribute("href") || "Not Available";

    return {
      fullName,
      barNumber,
      licenseStatus,
      address,
      phoneNumber,
      faxNumber,
      email,
      website,
    };
  } catch (error) {
    console.error("Error parsing bar response:", error);
    return null;
  }
};

const AttorneySignup: React.FC<AttorneySignupProps> = ({ onSubmit, setType }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    barNumber: "",
    fullName: "",
    address: "",
    phoneNumber: "",
    website: "",
    languagesSpoken: "",
    companyName: "",
    faxNumber: "",
  });

  const [licenseStatus, setLicenseStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loader, setLoader] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.email) newErrors.email = "Email is required.";
      if (!formData.password) newErrors.password = "Password is required.";
    } else if (step === 2) {
      if (!formData.barNumber) newErrors.barNumber = "Bar Number is required.";
    } else if (step === 3) {
      //   if (!formData.fullName) newErrors.fullName = "Full Name is required.";
      //   if (!formData.address) newErrors.address = "Address is required.";
      //   if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchBarDetails = async () => {
    try {
      setLoader(true)
      const response = await fetch(
        `https://apps.calbar.ca.gov/attorney/Licensee/Detail/${formData.barNumber}`
      );
      const html = await response.text();
      const barDetails = parseBarResponse(html);
      console.log(barDetails)
      if (!barDetails) {
        alert("Error extracting bar details. Please check the Bar Number.");
        return;
      }

      if (barDetails.licenseStatus.toLowerCase() !== "active") {
        alert("The license is inactive. Registration cannot proceed.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        fullName: barDetails.fullName,
        address: barDetails.address,
        phoneNumber: barDetails.phoneNumber,
        faxNumber: barDetails.faxNumber,
        email: barDetails.email || prev.email,
        website: barDetails.website,
      }));

      setLicenseStatus("Active");
      setLoader(false)
      setStep((prev) => prev + 1);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        barNumber: "Error fetching license details. Please try again.",
      }));
    }
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (step === 2) {
      await fetchBarDetails();
      if (licenseStatus !== "Active") return;
    }

    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      if (validateStep()) {
        console.log(formData)
        // onSubmit(formData);
        setLoader(true)
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(userCredential.user, { displayName: formData.fullName });

        const userDocRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userDocRef, {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          fullName: formData.fullName,
          barNumber: formData.barNumber,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          website: formData.website,
          languagesSpoken: formData.languagesSpoken,
          companyName: formData.companyName,
          faxNumber: formData.faxNumber,
          isAttorney: true,
          createdAt: new Date(),
        });
      }
      setLoader(false)
      setType("signin")
      ShowNotification("Lawyer created successfully!", "success");
    } catch (error:any) {
      console.error("Error signing up:", error.message);
    }
    setLoader(false)
  };

  return (
    <div className="space-y-4">
      {step === 1 && (
        <>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.password ? "border-red-500" : ""}`}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          <p className="text-sm text-gray-500">
            This portal is exclusively for immigration lawyers. Verify your details
            <a
              href="https://apps.calbar.ca.gov/attorney/Licensee/Detail/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              here.
            </a>
          </p>
        </>
      )}

      {step === 2 && (
        <>
          <label className="font-bold">Bar Number Collection</label>
          <input
            type="text"
            name="barNumber"
            placeholder="Bar Number"
            value={formData.barNumber}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.barNumber ? "border-red-500" : ""}`}
          />
          {errors.barNumber && <p className="text-red-500 text-sm">{errors.barNumber}</p>}
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-xl font-bold">Additional Information</h2>
          <input
            type="text"
            name="languagesSpoken"
            placeholder="Languages Spoken"
            value={formData.languagesSpoken}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="faxNumber"
            placeholder="Fax Number"
            value={formData.faxNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </>
      )}

      {step === 4 && (
        <>
          <h2 className="text-xl font-bold">Verification and Confirmation</h2>
          <p>Review your information:</p>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{JSON.stringify(formData, null, 2)}</pre>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={loader}
            onClick={handleSubmit}
          >
            {loader ? "Loading..." : "Confirm and Complete"}
          </button>
        </>
      )}

      <div className="flex justify-between">
        {step > 1 && (
          <button onClick={handleBack} className="text-gray-500">
            Back
          </button>
        )}
        {step < 4 && (
          <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loader}>
            {loader ? "Loading..." : "Next"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AttorneySignup;





