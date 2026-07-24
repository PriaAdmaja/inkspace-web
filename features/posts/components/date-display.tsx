import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export default function DateDisplay({ date }: { date: string }) {
  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger>
        <p className="hover:underline">{dayjs().to(dayjs(date))} </p>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{dayjs(date).format("lll")}</p>
      </TooltipContent>
    </Tooltip>
  );
}
