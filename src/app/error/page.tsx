"use client";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg border border-red-100">
        <h2 className="text-center text-3xl font-extrabold text-red-600">
          Something went wrong
        </h2>
        <p className="text-center text-gray-600">
          There was an error with your request. Please try again.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => (window.location.href = "/login")}
            className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-blue/90"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
