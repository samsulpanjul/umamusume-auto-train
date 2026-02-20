import { Plus } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";

import { Button } from "@/components/ui/button";

type Props = {
  cardType: string;
};

export default function FunctionModUmaCard({
  cardType
}: Props) {

  return (
    <div style={{ "aspect-ratio": '1 / 1', width: '100%'}} className="p-5">
      <Button style={{ width:'100%', height:'100%', borderRadius: '50%' }} variant="outline">
        <Plus />
      </Button>
    </div>
  );
}
