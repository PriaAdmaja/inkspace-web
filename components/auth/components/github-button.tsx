import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function GithubButton() {
  return (
    <Button variant="outline">
      <Image src={"/logo/github.svg"} width={20} height={20} alt="github" />{" "}
      Continue with GitHub
    </Button>
  );
}
