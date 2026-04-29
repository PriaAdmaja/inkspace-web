import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeClosed } from "lucide-react";
import { ComponentProps, useState } from "react";

export default function InputPassword(
  props: Omit<ComponentProps<typeof InputGroupInput>, "type">,
) {
  const [isHidePassword, setIsHidePassword] = useState<boolean>(true);
  return (
    <InputGroup>
      <InputGroupInput
        placeholder="Enter your password"
        autoComplete="off"
        {...props}
        type={isHidePassword ? "password" : "text"}
      />
      <InputGroupAddon align={"inline-end"}>
        <InputGroupButton onClick={() => setIsHidePassword((prev) => !prev)} tabIndex={-1}>
          {isHidePassword ? <EyeClosed /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
