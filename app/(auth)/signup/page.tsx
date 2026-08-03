import SignupForm from "./SignupForm";
import { Suspense } from "react";

export default function SIgnupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />;
    </Suspense>
  );
}
