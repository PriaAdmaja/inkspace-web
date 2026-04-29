import { Button } from "@/components/ui/button";
import GoogleLogo from "../logo/google-logo";

export default function GoogleButton() {
  return (
    <Button variant="outline">
      <GoogleLogo className="size-5" />
      Continue with Google
    </Button>
  );
}
