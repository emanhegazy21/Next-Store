import { useRouter } from "next/router";
import React from "react";

const ErrorComponent = () => {
  const router = useRouter();
  const Back = () => {
    router.replace("/");
  };
  return (
    <div>
      <h1 className="alert alert-danger">Oops,SomeThing Wrong</h1>
      <button className="btn btn-dark" onClick={() => Back()}>
        Back to Home
      </button>
    </div>
  );
};

export default ErrorComponent;
