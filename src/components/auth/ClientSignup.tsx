import React, { useState } from "react";
import { auth, db } from "@/firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

interface FamilyMember {
  fullName: string;
  fileNumber: string;
  address: string;
  dob: string;
  nationality: string;
  countryOfResidence: string;
  isUnder18: boolean;
}

interface FormData {
  email: string;
  password: string;
  FullName: string;
  FileNumber: string;
  Address: string;
  Dob: string;
  Nationality: string;
  CountryOfResidence: string;
  familyMembers: FamilyMember[];
  asylumType: string;
  selfie: File | null;
  i862: File | null;
  i94: File | null;
  additionalDocs: File | null;
}

interface StepProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleNext?: () => void;
  handleBack?: () => void;
  setFormData?: React.Dispatch<React.SetStateAction<FormData>>;
  familyMembers: FamilyMember[];
  setFamilyMembers?: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
  onClose?: () => void;
  setType?: (data: any) => void;
}

interface ClientSignUpProps {
  onClose: () => void;
  setType: (data: any) => void;
}

export const ClientSignUp: React.FC<ClientSignUpProps> = ({ onClose, setType }) => {
  const [step, setStep] = useState(1);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    FullName: "",
    FileNumber: "",
    Address: "",
    Dob: "",
    Nationality: "",
    CountryOfResidence: "",
    familyMembers: [],
    selfie: null,
    i862: null,
    i94: null,
    additionalDocs: null,
    asylumType: "",
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  console.log(formData);

  return (
    <div className="">
      {step === 1 && (
        <Step1
          formData={formData}
          handleChange={handleChange}
          handleNext={handleNext}
          familyMembers={familyMembers}
          setFamilyMembers={setFamilyMembers}
        />
      )}
      {step === 2 && (
        <Step2
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleNext={handleNext}
          handleBack={handleBack}
          familyMembers={familyMembers}
          setFamilyMembers={setFamilyMembers}
        />
      )}
      {step === 3 && (
        <Step3
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleNext={handleNext}
          handleBack={handleBack} 
          familyMembers={familyMembers}
          setFamilyMembers={setFamilyMembers}
        />
      )}
      {step === 4 && (
        <Step4
          formData={formData}
          handleChange={handleChange}
          handleNext={handleNext}
          handleBack={handleBack}
          familyMembers={familyMembers}
          setFamilyMembers={setFamilyMembers}
        />
      )}
      {step === 5 && (
        <Step5
          formData={formData}
          handleChange={handleChange}
          handleBack={handleBack}
          setType={setType}
          familyMembers={familyMembers}
          setFamilyMembers={setFamilyMembers}
        />
      )}
    </div>
  );
};


const Step1: React.FC<StepProps> = ({ formData, handleChange, handleNext }) => {
  const [errors, setErrors] = React.useState({ email: '', password: '' });

  const validate = () => {
    const newErrors = { email: '', password: '' };
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleNextClick = () => {
    if (validate()) {
      handleNext?.();
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : ''}`}
      />
      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

      <button
        onClick={handleNextClick}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Next
      </button>
    </div>
  );
};

const Step2: React.FC<StepProps> = ({
  formData,
  handleChange,
  handleNext,
  handleBack,
  familyMembers,
  setFamilyMembers,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [familyMemberErrors, setFamilyMemberErrors] = useState<string[]>([]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const newFamilyMemberErrors: string[] = [];

    if (!formData.FullName) newErrors.FullName = "Full Name is required.";
    if (!formData.FileNumber) newErrors.FileNumber = "File Number is required.";
    if (!formData.Address) newErrors.Address = "Address is required.";
    if (!formData.Dob) newErrors.Dob = "Date of Birth is required.";
    if (!formData.Nationality) newErrors.Nationality = "Nationality is required.";
    if (!formData.CountryOfResidence) newErrors.CountryOfResidence = "Country of Residence is required.";

    familyMembers.forEach((member, index) => {
      if (
        !member.fullName ||
        !member.fileNumber ||
        !member.address ||
        !member.dob ||
        !member.nationality ||
        !member.countryOfResidence
      ) {
        newFamilyMemberErrors[index] = `Please provide valid details for family member #${index + 1}.`;
      }
    });

    setErrors(newErrors);
    setFamilyMemberErrors(newFamilyMemberErrors);
    return Object.keys(newErrors).length === 0 && newFamilyMemberErrors.length === 0;
  };

  const handleNextClick = () => {
    if (validate()) {
      handleNext?.();
    }
  };

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      fullName: "",
      fileNumber: "",
      address: "",
      dob: "",
      nationality: "",
      countryOfResidence: "",
      isUnder18: false,
    };

    // setFamilyMembers((prev) => {
    //   const updated = [...prev, newMember];
    //   return updated;
    // });
  };

  const handleFamilyMemberChange = (
    index: number,
    field: keyof FamilyMember,
    value: string | boolean
  ) => {
    const updatedMembers = [...familyMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };

    // setFamilyMembers(updatedMembers);
  };

  const removeFamilyMember = (index: number) => {
    // setFamilyMembers((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {(["FullName", "FileNumber", "Address", "Dob", "Nationality", "CountryOfResidence"] as Array<keyof FormData>).map(
        (field) => (
          <div key={field}>
            <input
              type={field === "Dob" ? "date" : "text"}
              name={field}
              value={formData[field] as string}
              onChange={handleChange}
              placeholder={field.replace(/([A-Z])/g, " $1").trim()}
              className={`w-full p-2 border rounded ${errors[field] ? "border-red-500" : ""}`}
            />
            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>
        )
      )}
      <div>
        <h3 className="text-lg font-semibold">Family Members</h3>
        {familyMembers.map((member, index) => (
          <div key={index} className="space-y-2 p-4 border rounded">
            <input
              type="text"
              value={member.fullName}
              onChange={(e) => handleFamilyMemberChange(index, "fullName", e.target.value)}
              placeholder="Full Name"
              className={`w-full p-2 border rounded ${familyMemberErrors[index]?.includes("Full Name") ? "border-red-500" : ""}`}
            />
            <input
              type="text"
              value={member.fileNumber}
              onChange={(e) => handleFamilyMemberChange(index, "fileNumber", e.target.value)}
              placeholder="File Number"
              className={`w-full p-2 border rounded ${familyMemberErrors[index]?.includes("File Number") ? "border-red-500" : ""}`}
            />
            <input
              type="text"
              value={member.address}
              onChange={(e) => handleFamilyMemberChange(index, "address", e.target.value)}
              placeholder="Address"
              className={`w-full p-2 border rounded ${familyMemberErrors[index]?.includes("Address") ? "border-red-500" : ""}`}
            />
            <input
              type="date"
              value={member.dob}
              onChange={(e) => handleFamilyMemberChange(index, "dob", e.target.value)}
              placeholder="Date of Birth"
              className={`w-full p-2 border rounded ${familyMemberErrors[index]?.includes("Date of Birth") ? "border-red-500" : ""}`}
            />
            <input
              type="text"
              value={member.nationality}
              onChange={(e) => handleFamilyMemberChange(index, "nationality", e.target.value)}
              placeholder="Nationality"
              className={`w-full p-2 border rounded ${familyMemberErrors[index]?.includes("Nationality") ? "border-red-500" : ""}`}
            />
            <input
              type="text"
              value={member.countryOfResidence}
              onChange={(e) => handleFamilyMemberChange(index, "countryOfResidence", e.target.value)}
              placeholder="Country of Residence"
              className={`w-full p-2 border rounded ${familyMemberErrors[index]?.includes("Country of Residence") ? "border-red-500" : ""}`}
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={member.isUnder18}
                onChange={(e) => handleFamilyMemberChange(index, "isUnder18", e.target.checked)}
              />
              <span>Is Under 18</span>
            </label>
            <button
              onClick={() => removeFamilyMember(index)}
              className="text-red-500"
            >
              Remove
            </button>
            {familyMemberErrors[index] && (
              <p className="text-red-500 text-sm">{familyMemberErrors[index]}</p>
            )}
          </div>
        ))}
        <button
          onClick={addFamilyMember}
          className="bg-gray-200 text-blue-500 px-4 py-2 rounded"
        >
          Add Family Member
        </button>
      </div>
      <div className="flex justify-between">
        <button onClick={handleBack} className="text-gray-500">
          Back
        </button>
        <button
          onClick={handleNextClick}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const Step3: React.FC<StepProps> = ({ formData, setFormData, handleNext, handleBack }) => {
  const [errors, setErrors] = useState({
    i862: "",
    i94: "",
    additionalDocs: "",
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.i862) newErrors.i862 = "The Notice to Appear (I-862) is required.";
    if (!formData.i94) newErrors.i94 = "The Arrival/Departure Record (I-94) is required.";
    if (!formData.additionalDocs) newErrors.additionalDocs = "Additional documents are required.";

    // setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Invalid file type. Only PDF, JPEG, and PNG are allowed.",
        }));
        return;
      }
      setErrors((prev) => ({ ...prev, [name]: "" }));
      // setFormData((prev) => ({
      //   ...prev,
      //   [name]: file,
      // }));
    }
  };

  const handleNextClick = () => {
    if (validate()) {
      handleNext?.();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-semibold">Notice to Appear (I-862)</label>
        <input
          type="file"
          name="i862"
          accept=".pdf,.jpeg,.png"
          onChange={handleFileChange}
          className={`w-full p-2 border rounded ${errors.i862 ? "border-red-500" : ""}`}
        />
        {errors.i862 && <p className="text-red-500 text-sm">{errors.i862}</p>}
      </div>

      <div>
        <label className="block font-semibold">Arrival/Departure Record (I-94)</label>
        <input
          type="file"
          name="i94"
          accept=".pdf,.jpeg,.png"
          onChange={handleFileChange}
          className={`w-full p-2 border rounded ${errors.i94 ? "border-red-500" : ""}`}
        />
        {errors.i94 && <p className="text-red-500 text-sm">{errors.i94}</p>}
      </div>

      <div>
        <label className="block font-semibold">Additional Documents</label>
        <input
          type="file"
          name="additionalDocs"
          accept=".pdf,.jpeg,.png"
          onChange={handleFileChange}
          className={`w-full p-2 border rounded ${errors.additionalDocs ? "border-red-500" : ""}`}
        />
        {errors.additionalDocs && <p className="text-red-500 text-sm">{errors.additionalDocs}</p>}
      </div>

      <div className="flex justify-between">
        <button onClick={handleBack} className="text-gray-500">
          Back
        </button>
        <button
          onClick={handleNextClick}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const Step4: React.FC<StepProps> = ({ formData, handleChange, handleNext, handleBack }) => {
  const [error, setError] = useState<string>('');

  const handleNextStep = () => {
    if (!formData.asylumType) {
      setError('Please select an asylum type.');
      return;
    }
    setError('');
    handleNext?.();
  };

  return (
    <div className="space-y-4">
      <label className="block font-semibold">Asylum Type</label>
      <select
        name="asylumType"
        value={formData.asylumType}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Type</option>
        <option value="race">Race</option>
        <option value="religion">Religion</option>
        <option value="nationality">Nationality</option>
        <option value="politicalOpinion">Political Opinion</option>
        <option value="membership">Membership in a Particular Social Group</option>
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-between mt-4">
        <button onClick={handleBack} className="text-gray-500">Back</button>
        <button onClick={handleNextStep} className="bg-blue-500 text-white px-4 py-2 rounded">
          Next
        </button>
      </div>
    </div>
  );
};

const Step5: React.FC<StepProps> = ({ formData, handleBack, onClose, setType }) => {
  const [selfie, setSelfie] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const validate = () => {
    if (!selfie) {
      setError("Please upload a selfie for identity verification.");
      return false;
    }

    if (!["image/jpeg", "image/png"].includes(selfie.type)) {
      setError("Invalid file type. Only JPEG and PNG formats are allowed.");
      return false;
    }

    if (selfie.size > 2 * 1024 * 1024) {
      setError("File size exceeds the 2MB limit.");
      return false;
    }

    setError("");
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelfie(file);

    if (file && ["image/jpeg", "image/png"].includes(file.type)) {
      setError("");
    }
  };

  const handleSubmit = async () => {
    try {
      if (validate()) {
        console.log(formData)
        // onSubmit(formData);
        // setLoader(true)
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(userCredential.user, { displayName: formData.FullName });

        const userDocRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userDocRef, {
          uid: userCredential.user.uid,
          isAttorney: false,
          createdAt: new Date(),
          ...formData
        });
      }
      // setLoader(false)
      // setType("signin")
    } catch (error:any) {
      console.error("Error signing up:", error.message);
    }
    // setLoader(false)
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Identity Verification</h2>
      <input
        type="file"
        name="selfie"
        accept="image/*"
        onChange={handleFileChange}
        className={`w-full p-2 border rounded ${error ? "border-red-500" : ""}`}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-between mt-4">
        <button onClick={handleBack} className="text-gray-500">
          Back
        </button>
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </div>
    </div>
  );
};


export default ClientSignUp;
