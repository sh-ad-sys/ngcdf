import BursaryForm from "./Form";

export default function BursaryApplicationPage() {
  return (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-10">
  <h1 className="text-2xl font-bold text-center mb-10">
    Student Bursary Application
  </h1>
  <BursaryForm />
</div>

  );
}
